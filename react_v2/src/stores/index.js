import React, { createContext, useContext } from 'react'
import AppleStore from './AppleStore'

class Store {
  constructor() {
    this.appleStore = new AppleStore()
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