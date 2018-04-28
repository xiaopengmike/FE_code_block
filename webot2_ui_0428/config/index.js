// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')
var nd_url='http://192.168.3.245:8882';
var t3_url = 'http://admin.t3.webot.ai'
var xw_url='http://192.168.3.237:8882';
var zx_url='http://192.168.3.196:8880';
// var zx_url='http://192.168.3.196:8882';
var dev_url='http://192.168.3.237:8882';
var test_url = 'http://admin.test.webot.ai';
//var test_url = "http://192.168.3.107:8080";
var t5_url = 'http://admin.t5.site.webot.ai';


function genConfig(proxy_url, env, port){
    env = env !== undefined ?  env : './dev.env';
    port = port !== undefined ?  port : 8091;
    return {
        env: require(env),
        port: port,
        autoOpenBrowser: true,
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        proxyTable: {
            '/chat_stat':{
                    target: proxy_url,
                    changeOrigin: true,
                    pathRewrite: {
                      '^/chat_stat': '/chat_stat'
                    }
                },
                '/chats':{
                    target: proxy_url,
                    changeOrigin: true,
                    pathRewrite: {
                      '^/chats': '/chats'
                    }
                },
                '/chat':{
                    target: proxy_url,
                    changeOrigin: true,
                    pathRewrite: {
                      '^/chat': '/chat'
                    }
                },
                '/captcha.gif':{
                    target: proxy_url,
                    changeOrigin: true,
                    pathRewrite: {
                      '^/captcha.gif': '/captcha.gif'
                    }
                },
                '/upload':{
                    target: proxy_url,
                    changeOrigin: true,
                    pathRewrite: {
                      '^/upload': '/upload'
                    }
                },
                '/captcha':{
                	target: proxy_url,
                    changeOrigin: true,
                    pathRewrite: {
                      '^/captcha': '/captcha'
                    }
                },
                '/api/statistic':{
                	//target: 'http://192.168.3.196:8880',
                  target: proxy_url,
                  changeOrigin: true,
                  pathRewrite: {
                    '^/api/statistic': '/api/statistic'
                  }
                },
                '/api':{
                    target: proxy_url,
                    changeOrigin: true,
                    pathRewrite: {
                      '^/api': '/api'
                    }
                },
                '/api2':{
                  target:'http://192.168.3.196:8880',
                  changeOrigin: true,
                            pathRewrite: {
                              '^/api2': '/api'
                            }
                }
        },
        // CSS Sourcemaps off by default because relative paths are "buggy"
        // with this option, according to the CSS-Loader README
        // (https://github.com/webpack/css-loader#sourcemaps)
        // In our experience, they generally work as expected,
        // just be aware of this issue when enabling this option.
        cssSourceMap: false
    }
}
module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  adtest: genConfig(test_url),
  dev: genConfig(dev_url),
  t3: genConfig(t3_url),
  t5: genConfig(t5_url),
  xw: genConfig(xw_url),
  zx: genConfig(zx_url),
  nd: genConfig(nd_url, undefined, 8090),
}
