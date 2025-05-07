const {defineConfig} = require('@vue/cli-service');
module.exports = defineConfig({
    transpileDependencies: true,
    configureWebpack: {
        resolve: {
            fallback: {
                "https": require.resolve("https-browserify"),
                "http": require.resolve("stream-http"),
                "url": require.resolve("url/")
            }
        }
    },
    devServer: {
        port: 7070,
        proxy: {
            '/api': {
                target: 'http://localhost:8000',
                pathRewrite: {'^/api': ''},
                changeOrigin: true,
                secure: false,
            }
        }
    }
});
