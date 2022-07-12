import React, { Component } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Header } from '../components';
import Home from '../views/Home/index.js';
import Detail from '../views/Detail/index.js';
import Summary from '../views/Summary/index.js';
import Antd from '../views/Antd/index.js';
import { WrapComps } from '../utils/withRouter';
import './index.less';

class Layout extends Component {
  render() {
    return (
      <div className="zoo-basic-layout">   
        <Header />
        <main>
          <Routes>
            <Route path='/'  element={<Home />} />
            <Route path='/detail/:week'  element={<WrapComps el={Detail} />} />
            <Route path='/summary'  element={<Summary />} />
            <Route path='/antd'  element={<Antd />} />
          </Routes>
        </main>
      </div>
    );
  }
}

export default Layout;
