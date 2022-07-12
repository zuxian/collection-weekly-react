#   搭建过程



```js
fatal: unable to access 'https://github.com/ant-design/create-react-app-antd.git/': OpenSSL SSL_read: Connection was reset, errno 10054

服务器的SSL证书灭有经过第三方机构的签署。也可能是网络不稳定，连接超时导致
修改设置，解除SSL验证
git config --global http.sslVerify "false"
git config --global https.sslVerify "false"

git push -f git@github.com:zuxian/collection-weekly-react.git  master:master
```

### 初始化脚手架

```js
create-react-app my-app
//  已经不支持全局安装 create-react-app，卸载 npm uninstall -g create-react-app
//  使用NPX安装
npx create-react-app my-app
```

- ==**react-app-rewired、customize-cra**==

 https://blog.csdn.net/qq_40629521/article/details/110517762\

通过react脚手架create-react-app创建了项目，但是发现了一个问题 如果没有执行eject命令的话 是没有其他配置文件的。这个时候就需要 用到 customize-cra 和 react-app-rewired插件。然后在根目录下新建一个名称为config-overrides.js的文件。在里面去进行所有的配置

`npm install react-app-rewired customize-cra --save-dev`

react-app-rewired的作用就是在不eject的情况下,覆盖create-react-app的配置，然后修改package.json中启动的配置。

```js
"scripts": {
    "start": "react-app-rewired start",
    "build": "react-app-rewired build",
    "test": "react-app-rewired test",
    "eject": "react-scripts eject"
},
```

在目录中创建一个config-overrides.js修改默认的一些配置

```js
module.exports =function override(config, env){
        return config;
};
```



另一种方案： **使用craco插件**

https://blog.csdn.net/sinat_36728518/article/details/106280722

craco start 遇到了npm update craco-less错误，用yarn 安装就没事了。。。？？？



###  按需引进ant  design

npm install babel-plugin-import --save-dev

修改config-overrides.js文件

```js
const { override, fixBabelImports } = require('customize-cra');
	module.exports = override(
	      fixBabelImports(
	      	'import', {
                 libraryName: 'antd',			
                 libraryDirectory: 'es',
                 style: 'css',
			 }
	),
);


// 按需引进，不需要全部引进样式，，全局样式不需要-注释掉
// @import '~antd/dist/antd.less';
```



- **==删除多余的文件==**

ServiceWorker.js文件：变成一个PWA（Progressive Web Application），在线上，只要访问过一次你的网站，下一次即使没有网络，这个应用依然可以被访问。
在移动端打开项目时，如果你用的是chrome或者firefox这样的高级浏览器，浏览器会给你的页面不太一样的显示，你的网页看起来会更像原生App，体验非常好。

manifest.json文件：在项目的public目录下，对网页做一些配置，当用户访问网页，生成一个网页的桌面快捷方式时，以这个文件中的内容作为图标和文字显示内容。配置好manifest.json, 使用registerServiceWorker.js，用户完全可以把你的网页快捷方式放到桌面上，因为你的网页此时支持离线访问，所以用起来和原生app的体验很接近。

打包后生效！！！！



###  增加路由

https://blog.csdn.net/FengZi_00/article/details/122127889

https://juejin.cn/post/7073405036025348110#heading-1


####  react-router-domV6新版本的坑！！！

https://blog.csdn.net/FengZi_00/article/details/122127889

react-router-dom从V5升级到V6后，有些使用做了一些改变：

1. `<Switch>`重命名为`<Routes>`。
2. `<Route>`的新特性变更。
3. 嵌套路由变得更简单。
4. 用`useNavigate`代替`useHistory`。
5. 新钩子`useRoutes`代替`react-router-config`。

```js
// v5
<Switch>
    <Route exact path="/"><Home /></Route>
    <Route path="/profile"><Profile /></Route>
	<Route path=":userId" component={Profile} />
	<Route path=":userId"
  		render={routeProps => (<Profile routeProps={routeProps} animate={true} />)} />
</Switch>
 
// v6
import { HashRouter, Route, Routes } from "react-router-dom";
 <div className="App">
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/test" element={<Test />} />
          <Route path=":userId" element={<Profile />} />
		  <Route path=":userId" element={<Profile animate={true} />} />
        </Routes>
      </HashRouter>
  </div>
```

- 获取路由参数

以前版本组件的`props`会包含一个`match对象`取到路径参数`this.props.match.params`。但最新的 6.x 版本无法从 props 获取参数。

并且针对类组件的 `withRouter` 高阶组件已被移除。因此对于类组件来说，获取参数有两种兼容方法：

1. 将类组件改写为函数组件
2. 自己写一个 HOC 来包裹类组件，用 `useParams` 获取参数后通过 props 传入原本的类组件

```js
//  utils/withRouter.js文件
import React from 'react';
import { useNavigate, useParams } from "react-router-dom";
export const WrapComps = (props)=> {
  let navigate = useNavigate();
  let params = useParams();
  let Element = props.el
  return <Element params={params} navigate={navigate} {...props} />
}

//  Layout文件
import { WrapComps } from '../utils/withRouter';
import Detail from '../views/Detail';
<Route path='/detail/:week'  element={<WrapComps el={ Detail } />} />
```

第二种写法：

```js
//  utils/withRouter.js文件
import React from 'react';
import { useLocation, useNavigate, useParams  } from "react-router-dom";
export function withRouter( Child ) {
    return ( props ) => {
      const location = useLocation();
      const navigate = useNavigate();
      const params = useParams()
      return <Child { ...props } navigate={ navigate } location={ location }  params={ params } />;
    }
}

// views/Detail文件
import { withRouter } from '../../utils/withRouter';
export default withRouter(connect((state) => state.detailStore, actionCreators)(Detail));
```






###  增加redux

安装redux、react-redux、redux-thunk



-  **react-redux**

**react-redux**负责状态管理，将react 组件划分为容器组件和展示组件，容器组件是react-redux提供的

展示组件：只是负责展示 UI，不涉及到逻辑的处理，数据来自父组件的props;
容器组件：负责逻辑、数据交互，将 state 里面的数据传递给展示组件进行 UI 呈现



 ==Provider --  所有组件拿到state==

react-redux提供了Provider组件。用这个Provider包裹根组件，将redux导出的state，作为参数往下面传

```js
import { Provider } from "react-redux";
import App from "./App";
import { store } from "./store"; // 这个store由redux导出

<Provider store={store}> <App /> </Provider>;
return
```

- connect---组件如何收到state变更信息？

它共有四个参数mapStateToProps, mapDispatchToProps, mergeProps以及options。

mapStateToProps 的作用是将store里的state（数据源）绑定到指定组件的props中
mapDispatchToProps 的作用是将store里的action（操作数据的方法）绑定到指定组件的props中

不需要手动的去用store.subscribe订阅render函数以达到更新页面

- 创建全局store

```js
// store/index.js

import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './reducers.js';

//  compose(fn1, fn2, fn3) (...args) = > fn1(fn2(fn3(...args)))
const composeEnhancers =
  process.env.NODE_ENV === 'development'
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose;
const middleware = [thunkMiddleware];

// createStore(reducer, [preloadedState], [enhancer])
const configureStore = createStore(rootReducer, composeEnhancers(applyMiddleware(...middleware)));
export default configureStore;
```

- 汇总所有的reducer

```js
// store/reducers.js
import { combineReducers } from 'redux';
import { reducer as homeReducer } from '../views/Home/store';
import { reducer as detailReducer } from '../views/Detail/store';
const reducer = combineReducers({
  homeStore: homeReducer,
  detailStore: detailReducer,
});
export default reducer;
```


局部

```js
// home的actionCreators.js
import request from '../../../utils/request';
export const getList = list => ({
  type: 'home/getList',
  payload: { list },
});
export const getListEffect = () => (dispatch) => {
  return request.get('/api/weeks/list').then((res) => {
    return dispatch(getList(res.data));
  });
};

// home的reducer.js
import { HOME_LIST } from './actionTypes';
const initState = { cardList: [] };
export default (state = initState, action) => {
  switch (action.type) {
  case HOME_LIST:
    return { ...state, cardList: [...action.payload.list] };
  default:
    return state;
  }
};

//  使用
import { actionCreators } from './store';
import { connect } from "react-redux";

export default connect((state) => state.homeStore, actionCreators)(Home);
```
类组件直接在this.props.getListEffect()调用方法，this.props.cardList拿states数据



##  用Hooks将类组件转为函数式组件

https://www.gingerdoc.com/tutorials/five-ways-to-convert-react-class-components-to-functional-components-with-react-hooks














---

---

---

---




# Use antd in create-react-app ✨

[Create React App](https://facebook.github.io/create-react-app/) + [Ant Design](https://ant.design).

## Step by Step Documentation

- 🇺🇸 English: https://ant.design/docs/react/use-with-create-react-app
- 🇨🇳 中文：https://ant.design/docs/react/use-with-create-react-app-cn

## Preview

```bash
$ npm install
$ npm start
```

or:

```bash
$ yarn
$ yarn start
```

## See more

- [antd](http://github.com/ant-design/ant-design/)
- [create-react-app](https://github.com/facebookincubator/create-react-app)
- [craco](https://github.com/gsoft-inc/craco)
- [craco-less](https://github.com/DocSpring/craco-less)

---

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
