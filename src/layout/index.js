import React, { Component } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Header, Footer } from '../components';
import Home from '../views/Home';
import Summary from '../views/Summary';
import './index.less';

class Layout extends Component {
  render() {
    return (
      <div className="zoo-basic-layout">   
        <Header />
        <main>
          <Routes>
            <Route path='/'  element={<Home />} />
            <Route path='/detail/:week'  element={<Home />} />
            <Route path='/summary'  element={<Summary />} />
          </Routes>
        </main>
        {/* <Footer /> */}
      </div>
    );
  }
}

export default Layout;
