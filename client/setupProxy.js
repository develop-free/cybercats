const {createProxyMiddleware} = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({      
      target: 'https://cyber-cats.ru/',
      changeOrigin: true,
    }),
  );
};
