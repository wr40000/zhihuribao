const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
    app.use(
        createProxyMiddleware("/api", {
            target: "http://127.0.0.1:7100",
            // target: "139.159.253.241:7100",
            changeOrigin: true,
            ws: true,
            pathRewrite: { "^/api": "" }
        })
    );
};