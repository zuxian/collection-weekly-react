// Redux Toolkit ---  configureStore
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
