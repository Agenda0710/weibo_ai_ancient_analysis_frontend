const {defineConfig} = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    devServer: {
        port: 7070,
        proxy: {
            '/api': {
                target: 'http://122.51.213.186:8000',  // 这是正确的后端地址
                pathRewrite: {'^/api': ''},
                changeOrigin: true,
                secure: false,
                ws: true,
                headers: {
                    'Connection': 'keep-alive'  // 保持连接
                }
            }
        }
    }
})
