const {defineConfig} = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    devServer: {
        port: 7070,
        proxy: {
            '/api': {
                target: 'http://122.51.213.186:8001',  // 这是正确的后端地址
                pathRewrite: {'^/api': ''},
                changeOrigin: true,
                secure: false,  // 如果是HTTP协议需要加这个
                ws: true,       // 如果需要websocket
                headers: {
                    'Connection': 'keep-alive'  // 保持连接
                }
            }
        }
    }
})
