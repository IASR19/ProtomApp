// Função serverless da Vercel: toda rota /api/* cai aqui (ver rewrites no vercel.json)
// e é atendida pela API NestJS compilada em apps/api/dist.
module.exports = require('../apps/api/dist/serverless').default;
