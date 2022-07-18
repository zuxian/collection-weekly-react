import React, { createContext, useContext } from 'react'
import AppleStore from './AppleStore'
import HomeStore from './HomeStore'
import SummaryStore from './SummaryStore'

class Store {
  constructor() {
    this.appleStore = new AppleStore()
    this.homeStore = new HomeStore()
    this.summaryStore = new SummaryStore()
  }
}

const StoreContext = createContext();

const StoreProvider = ({store, children}) => {
  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  )
}

const useStore = () => {
  return useContext(StoreContext)
}

export {
  Store,
  StoreProvider,
  useStore
}