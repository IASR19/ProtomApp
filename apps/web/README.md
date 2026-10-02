# 📱 ProtomApp — Mobile

> Aplicativo de saúde e alta performance para emagrecimento e recomposição corporal.  
> Plataforma iOS e Android construída com **Expo SDK 56 + TypeScript**.

---

## ✨ Visão Geral

O ProtomApp Mobile é a interface do paciente — um cockpit de saúde pessoal que centraliza protocolo médico, treino, nutrição, body scan e exames em uma experiência visual imersiva com tema **dark navy** e elementos de gamificação extrema.

---

## 🖥️ Telas (15 no total)

| #   | Tela                    | Descrição                                                                                  |
| --- | ----------------------- | ------------------------------------------------------------------------------------------ |
| 1   | **Disclaimer**          | Termos de uso e responsabilidade clínica                                                   |
| 2   | **Login**               | E-mail/senha + Apple e Google Sign-In                                                      |
| 3   | **Objetivo**            | Seleção de objetivo: emagrecimento, performance ou saúde                                   |
| 4   | **Biometria**           | Cadastro de idade, sexo, altura, peso e IMC dinâmico                                       |
| 5   | **Dashboard**           | Score metabólico, progresso de peso, alertas e acesso rápido                               |
| 6   | **Protocolo**           | Cockpit de alta performance: aderência SVG, fases do dia, stack medicamentoso e biohacking |
| 7   | **Upload de Exames**    | Envio de PDFs/imagens para análise clínica                                                 |
| 8   | **Evolução de Exames**  | Gráficos comparativos mês a mês                                                            |
| 9   | **Indicação de Treino** | Plano de treino com exercícios e cardio                                                    |
| 10  | **Workout 3D**          | Modo imersivo com scan laser animado e BPM em tempo real                                   |
| 11  | **Nutrição**            | Análise visual de refeição com macros                                                      |
| 12  | **Body Scan**           | Silhueta corporal com laser animado e comparativo de composição                            |
| 13  | **Prescrições**         | Cofre médico com receitas assinadas digitalmente (ICP-Brasil)                              |
| 14  | **Parceiros**           | Descontos em suplementos, farmácias e laboratórios                                         |
| 15  | **Perfil**              | Dados do usuário, plano Premium e configurações                                            |

---

## 🛠️ Stack Técnica

| Camada       | Tecnologia                                      |
| ------------ | ----------------------------------------------- |
| Framework    | [Expo SDK 56](https://expo.dev) + React Native  |
| Linguagem    | TypeScript (strict)                             |
| Navegação    | React Navigation v7 (Stack + Bottom Tabs)       |
| Animações    | React Native `Animated` API                     |
| Gráficos SVG | `react-native-svg` — rings de progresso e arcos |
| Gradientes   | `expo-linear-gradient`                          |
| Ícones       | `@expo/vector-icons` (Ionicons)                 |
| Tema         | Dark Navy personalizado (`#0A1628` base)        |

---

## 🎨 Sistema de Cores

```ts
bgPrimary: "#0A1628"; // fundo principal
bgSecondary: "#0F1E35"; // fundo secundário
bgCard: "#152040"; // cards
teal: "#00C9B1"; // cor de destaque principal
blue: "#3B82F6"; // informação
purple: "#8B5CF6"; // biohacking
warning: "#F59E0B"; // atenção
success: "#10B981"; // sucesso
danger: "#EF4444"; // alerta
```

---

## 🚀 Como Rodar

### Pré-requisitos

- Node.js 18+
- Xcode (iOS) ou Android Studio (Android)
- CocoaPods (iOS): `brew install cocoapods`

### Instalação

```bash
cd protomapp-mobile
npm install
```

### Executar no iOS (simulador)

```bash
npx expo run:ios
```

### Executar no Android (emulador)

```bash
npx expo run:android
```

### Verificar TypeScript

```bash
npx tsc --noEmit
```

---

## 📁 Estrutura do Projeto

```
protomapp-mobile/
├── src/
│   ├── mocks/          # Dados simulados para fase de validação
│   ├── navigation/     # Stack + BottomTabs
│   ├── screens/        # 15 telas do app
│   └── theme/          # colors.ts + styles.ts globais
├── App.tsx             # Entry point
└── app.json            # Configuração Expo
```

---

## 🔌 Integração com API

O app se conecta à [ProtomApp API](../protomapp-api) em `http://localhost:3001/api`.  
Na fase atual, todas as telas utilizam **dados mockados** para validação do fluxo e visual.

---

## 📌 Status do Projeto

- [x] Scaffold e dependências
- [x] Tema e sistema de design
- [x] 15 telas implementadas
- [x] Navegação completa (Stack + Tabs)
- [x] Dados mock para simulação
- [x] Build nativo iOS funcional
- [x] Animações de scan laser (Workout 3D + Body Scan)
- [x] Protocolo Cockpit com SVG ring e stacks
- [ ] Integração real com API
- [ ] Autenticação real (JWT)
- [ ] Push notifications

---

> **Aviso:** Este aplicativo é de caráter orientacional. Toda responsabilidade clínica é exclusiva do médico responsável.
