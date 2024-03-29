import React, { Component } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Header, Footer } from '../components';
import Home from '../views/Home';
// import Detail from '../views/Detail';
import Summary from '../views/Summary';
import Antd from '../views/Antd';
import Todo from '../views/Todo';
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
            {/* <Route path='/detail/:week'  element={<WrapComps el={Detail} />} /> */}
            {/* <Route path='/summary'  element={<WrapComps el={Summary} />} /> */}
            <Route path='/summary'  element={<Summary />} />
            <Route path='/antd'  element={<Antd />} />
            <Route path='/todo'  element={<Todo />} />
          </Routes>
        </main>
        {/* <Footer /> */}
      </div>
    );
  }
}

export default Layout;
