const CracoLessPlugin = require('craco-less');
const path = require("path");
const resolve = dir => path.resolve(__dirname, dir);


module.exports = {
  babel: {
    plugins: [
      // 按需引进antd
      [
        "import",
        {
          "libraryName": "antd",
          "libraryDirectory": "es",
          "style": true //设置为true即是less 用css可以写"css", 下面是lessLoaderOptions所以用less
        }
      ],
      // ["@babel/plugin-proposal-decorators", { "legacy": true }],
      // ["@babel/plugin-proposal-class-properties", { "loose" : true }]
      // ["@babel/plugin-proposal-class-properties", { "loose" : true }],
      // ["babel-plugin-transform-decorators-legacy", { legacy: true }]
    ]
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          // 自定义主题
          lessOptions: {
            modifyVars: { '@primary-color': 'red' },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
  webpack: {
    alias: {
      "@": resolve("src/"),
      // "components": resolve("src/components")
    }
  }
};

