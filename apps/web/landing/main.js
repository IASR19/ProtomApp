/* ProtomApp — landing page. JS puro, sem dependencias. */
(function () {
  "use strict";

  var reduceMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasIO = "IntersectionObserver" in window;
  var data = window.PROTOM_LP;

  // Desliga a rede de seguranca do CSS (.js:not(.lp-ready) .rv): daqui pra frente o JS controla o reveal.
  document.documentElement.classList.add("lp-ready");

  // ---------- Utilitarios ----------
  var brl = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  var brlInt = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });
  function money(v) {
    return Number.isInteger(v) ? brlInt.format(v) : brl.format(v);
  }

  // Contagem numerica: anima do valor anterior ate o novo.
  function countTo(el, to, format, duration) {
    var from = parseFloat(el.getAttribute("data-current") || "0");
    el.setAttribute("data-current", String(to));
    if (reduceMotion || from === to) {
      el.textContent = format(to);
      return;
    }
    var start = null;
    var dur = duration || 700;
    function frame(ts) {
      if (start === null) start = ts;
      var p = Math.min(1, (ts - start) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      var v = from + (to - from) * eased;
      el.textContent = format(p === 1 ? to : Math.round(v * 100) / 100);
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function onVisible(el, cb, threshold) {
    if (!hasIO) return cb();
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            cb();
            io.disconnect();
          }
        });
      },
      { threshold: threshold || 0.2 }
    );
    io.observe(el);
  }

  // ---------- Topo: fundo solido ao rolar ----------
  var topbar = document.querySelector(".topbar");
  function onScrollTop() {
    topbar.classList.toggle("is-scrolled", window.scrollY > 24);
  }
  onScrollTop();
  window.addEventListener("scroll", onScrollTop, { passive: true });

  // ---------- Planos (renderizados a partir de data.js) ----------
  var cycle = "monthly";
  var plansEl = document.getElementById("plans");
  var tableEl = document.getElementById("compare-table");

  function featureLabel(id) {
    for (var i = 0; i < data.features.length; i++) {
      if (data.features[i].id === id) return data.features[i].label;
    }
    return id;
  }

  function renderPlans() {
    var html = "";
    data.plans.forEach(function (plan, idx) {
      var prev = data.plans[idx - 1];
      var list = prev
        ? plan.features.filter(function (f) {
            return prev.features.indexOf(f) === -1;
          })
        : plan.features;
      var listHead = prev ? "Tudo do " + prev.name + ", mais:" : "Inclui:";
      var featured = plan.featured;

      html +=
        '<article class="plan rv' + (featured ? " plan--featured" : "") + '" data-plan="' + plan.id + '">' +
        (plan.badge ? '<p class="plan__badge">' + plan.badge + "</p>" : "") +
        '<h3 class="plan__name">' + plan.name + "</h3>" +
        '<p class="plan__pitch">' + plan.pitch + "</p>" +
        '<p class="plan__price"><span class="plan__cur">R$</span>' +
        '<span class="plan__value" data-price>' + money(plan.monthly) + "</span>" +
        '<span class="plan__per" data-per>/mês</span></p>' +
        '<p class="plan__sub" data-sub></p>' +
        '<a class="btn' + (featured ? "" : " btn--outline-dark") + '" href="' + data.ctaHref + '">Começar ' +
        data.trialDays + " dias grátis</a>" +
        '<p class="plan__trial">Sem cartão durante o beta</p>' +
        '<p class="plan__list-head">' + listHead + "</p>" +
        "<ul>" +
        list.map(function (f) {
          return "<li>" + featureLabel(f) + "</li>";
        }).join("") +
        "</ul></article>";
    });
    plansEl.innerHTML = html;

    // Tabela comparativa
    var head =
      "<thead><tr><th scope=\"col\">Recurso</th>" +
      data.plans.map(function (p) {
        return (
          '<th scope="col"' + (p.featured ? ' class="col-featured"' : "") + ">" + p.name +
          '<small data-head="' + p.id + '">R$ ' + money(p.monthly) + "/mês</small></th>"
        );
      }).join("") +
      "</tr></thead>";
    var body =
      "<tbody>" +
      data.features.map(function (f) {
        return (
          '<tr><th scope="row">' + f.label + "</th>" +
          data.plans.map(function (p) {
            var has = p.features.indexOf(f.id) !== -1;
            return (
              "<td" + (p.featured ? ' class="col-featured"' : "") + ">" +
              (has
                ? '<span class="yes" role="img" aria-label="Incluso"></span>'
                : '<span class="no" role="img" aria-label="Não incluso"></span>') +
              "</td>"
            );
          }).join("") +
          "</tr>"
        );
      }).join("") +
      "</tbody>";
    tableEl.innerHTML = head + body;
  }

  function updatePrices() {
    data.plans.forEach(function (plan) {
      var card = plansEl.querySelector('[data-plan="' + plan.id + '"]');
      var priceEl = card.querySelector("[data-price]");
      var perEl = card.querySelector("[data-per]");
      var subEl = card.querySelector("[data-sub]");
      var headEl = tableEl.querySelector('[data-head="' + plan.id + '"]');
      if (cycle === "yearly") {
        var perMonth = plan.yearly / 12;
        var saving = Math.round((1 - plan.yearly / (plan.monthly * 12)) * 100);
        countTo(priceEl, plan.yearly, money);
        perEl.textContent = "/ano";
        headEl.textContent = "R$ " + money(plan.yearly) + "/ano";
        subEl.innerHTML =
          "equivale a R$ " + brl.format(perMonth) + "/mês · <b>economize " + saving + "%</b>";
      } else {
        countTo(priceEl, plan.monthly, money);
        perEl.textContent = "/mês";
        headEl.textContent = "R$ " + money(plan.monthly) + "/mês";
        subEl.innerHTML = "ou R$ " + money(plan.yearly) + " no plano anual";
      }
    });
  }

  if (data && plansEl && tableEl) {
    renderPlans();
    plansEl.querySelectorAll("[data-price]").forEach(function (el, i) {
      el.setAttribute("data-current", String(data.plans[i].monthly));
    });
    updatePrices();

    var cycleEl = document.querySelector(".cycle");
    var pill = cycleEl.querySelector(".cycle__pill");
    var cycleBtns = cycleEl.querySelectorAll("button[data-cycle]");

    function placePill() {
      var active = cycleEl.querySelector('button[aria-pressed="true"]');
      pill.style.width = active.offsetWidth + "px";
      pill.style.transform = "translateX(" + active.offsetLeft + "px)";
    }
    cycleBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (btn.getAttribute("data-cycle") === cycle) return;
        cycle = btn.getAttribute("data-cycle");
        cycleBtns.forEach(function (b) {
          b.setAttribute("aria-pressed", b === btn ? "true" : "false");
        });
        placePill();
        updatePrices();
      });
    });
    placePill();
    window.addEventListener("resize", placePill);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(placePill);
  }

  // ---------- Reveal ao rolar (com cascata entre irmaos) ----------
  var revealEls = document.querySelectorAll(".rv");
  if (reduceMotion || !hasIO) {
    revealEls.forEach(function (el) {
      el.classList.add("in");
    });
  } else {
    revealEls.forEach(function (el) {
      var siblings = Array.prototype.filter.call(el.parentElement.children, function (c) {
        return c.classList.contains("rv");
      });
      var idx = siblings.indexOf(el);
      if (idx > 0) el.style.setProperty("--d", (idx * 0.07).toFixed(2) + "s");
    });
    var revealIO = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            revealIO.unobserve(e.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) {
      revealIO.observe(el);
    });
  }

  // ---------- Hero: cartoes flutuantes + parallax da marca d'agua ----------
  var device = document.querySelector(".hero__device");
  if (device) {
    requestAnimationFrame(function () {
      device.classList.add("is-in");
    });
  }

  var parallaxEls = document.querySelectorAll("[data-parallax]");
  if (!reduceMotion && parallaxEls.length) {
    var ticking = false;
    var applyParallax = function () {
      var y = window.scrollY;
      parallaxEls.forEach(function (el) {
        var f = parseFloat(el.getAttribute("data-parallax"));
        // comeca na posicao real (0) e so se move ao rolar, com curso limitado
        el.style.transform = "translate3d(0," + Math.min(y * f, 60) + "px,0)";
      });
      ticking = false;
    };
    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(applyParallax);
        }
      },
      { passive: true }
    );
  }

  // ---------- Celular: cenas em loop, so visivel e com aba em primeiro plano ----------
  var phone = document.getElementById("phone");
  if (phone) {
    var scenes = phone.querySelectorAll(".scene");
    var stepBtns = document.querySelectorAll(".scene-steps button");
    var current = 0;
    var timer = null;
    var inView = false;
    var INTERVAL = 3200;

    var show = function (i) {
      current = i;
      scenes.forEach(function (s, k) {
        s.classList.toggle("is-active", k === i);
      });
      stepBtns.forEach(function (b, k) {
        b.classList.toggle("is-active", k === i);
        b.setAttribute("aria-pressed", k === i ? "true" : "false");
      });
    };
    var stop = function () {
      clearInterval(timer);
      timer = null;
    };
    var start = function () {
      if (reduceMotion || timer || !inView || document.hidden) return;
      timer = setInterval(function () {
        show((current + 1) % scenes.length);
      }, INTERVAL);
    };

    stepBtns.forEach(function (b) {
      b.addEventListener("click", function () {
        show(parseInt(b.getAttribute("data-goto"), 10));
        stop();
        start(); // reinicia a contagem a partir da cena escolhida
      });
    });

    if (hasIO) {
      new IntersectionObserver(
        function (entries) {
          inView = entries[0].isIntersecting;
          if (inView) start();
          else stop();
        },
        { threshold: 0.2 }
      ).observe(phone);
    } else {
      inView = true;
      start();
    }
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop();
      else start();
    });
  }

  // ---------- Score grande: contagem ao entrar na tela ----------
  document.querySelectorAll("[data-count]").forEach(function (el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    if (reduceMotion) return;
    el.textContent = "0";
    onVisible(el, function () {
      countTo(el, target, function (v) {
        return String(Math.round(v));
      }, 900);
    }, 0.4);
  });

  // ---------- Trilha: linha que se desenha conforme rola ----------
  var trail = document.getElementById("trail");
  if (trail) {
    var svg = trail.querySelector(".trail__line");
    var line = svg.querySelector("polyline");
    var dots = trail.querySelectorAll(".trail__dot");
    var length = 0;

    var layoutTrail = function () {
      var box = trail.getBoundingClientRect();
      svg.setAttribute("viewBox", "0 0 " + box.width + " " + box.height);
      var pts = Array.prototype.map.call(dots, function (d) {
        var r = d.getBoundingClientRect();
        return (r.left - box.left + r.width / 2).toFixed(1) + "," + (r.top - box.top + r.height / 2).toFixed(1);
      });
      line.setAttribute("points", pts.join(" "));
      length = line.getTotalLength ? line.getTotalLength() : 0;
      line.style.strokeDasharray = String(length);
      drawTrail();
    };
    var drawTrail = function () {
      if (reduceMotion) {
        line.style.strokeDashoffset = "0";
        return;
      }
      var r = trail.getBoundingClientRect();
      var vh = window.innerHeight;
      var p = (vh * 0.85 - r.top) / (r.height * 0.9);
      p = Math.max(0, Math.min(1, p));
      line.style.strokeDashoffset = String(length * (1 - p));
    };

    layoutTrail();
    window.addEventListener("resize", layoutTrail);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(layoutTrail);
    var trailTicking = false;
    window.addEventListener(
      "scroll",
      function () {
        if (!trailTicking) {
          trailTicking = true;
          requestAnimationFrame(function () {
            drawTrail();
            trailTicking = false;
          });
        }
      },
      { passive: true }
    );
  }

  // ---------- FAQ: uma pergunta aberta por vez ----------
  var faqItems = document.querySelectorAll("#faq details");
  faqItems.forEach(function (d) {
    d.addEventListener("toggle", function () {
      if (!d.open) return;
      faqItems.forEach(function (o) {
        if (o !== d) o.open = false;
      });
    });
  });

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
