import React from 'react';
// import { Provider } from 'react-redux';
// import { Provider } from 'mobx-react'
import { BrowserRouter } from 'react-router-dom';
import Layout from './layout';
// import store from "./store";
import { Store, StoreProvider } from './stores';

const store = new Store();

const createApp = () => {
  return (
    <StoreProvider store={store}>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </StoreProvider>
  );
};

export default createApp;
