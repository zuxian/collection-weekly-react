import React, { Component } from 'react';
import './index.less';

export default class Header extends Component {
  render() {
    return (
      <header className="zoo-header">
        <h1 className="logo">
          <a href="/">收藏周刊</a>
          <span className="router-links">
            <a href="/">首页</a>
            <a href="/summary">数据看板</a>
            <a href="/todo">todo例子</a>
            <a href="/antd">antd组件</a>
            <a href="https://github.com/zuxian/collection-weekly-react" target="_blank" rel="noreferrer"><img src="../../../static/images/rss.png" alt="rss" className="rss" /></a>
          </span>
        </h1>
      </header>
    );
  }
}
