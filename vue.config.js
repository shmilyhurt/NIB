let BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
module.exports = {
    configureWebpack: {
        plugins: [new BundleAnalyzerPlugin()],
    },
}

const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css'];
module.exports = {
    productionSourceMap: false,
    devServer: {
        disableHostCheck: true,
    },
    configureWebpack: {
        plugins: [
            new CompressionWebpackPlugin({
                filename: '[path].gz[query]',   // 提示compression-webpack-plugin@2.0.0的话filename改为asset
                algorithm: 'gzip',
                test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
                threshold: 10240, //内容超过10KB进行压缩
                minRatio: 0.8
            })
        ],
        // 把webpack的配置写在这里 会自动合并
        // 以下库使用cdn，不会被打包
        externals: {
            // 'ant-design-vue':"https://cdn.jsdelivr.net/npm/ant-design-vue@1.4.11/dist/antd.min.js",
            // 'Vue':'https://cdn.bootcss.com/vue/2.6.11/vue.min.js',
            // 'vue-router':'https://cdn.bootcss.com/vue-router/3.1.3/vue-router.min.js'
            // 'vue':'Vue',
            // 'vue-router':'VueRouter'
        }
    }
};