import React, { createContext, useContext } from 'react'
import AppleStore from './AppleStore'
import HomeStore from './HomeStore'

class Store {
  constructor() {
    this.appleStore = new AppleStore()
    this.homeStore = new HomeStore()
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