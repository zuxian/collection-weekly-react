import { combineReducers } from 'redux';
import { reducer as homeReducer } from '../views/Home/store/index.js';
import { reducer as detailReducer } from '../views/Detail/store/index.js';
import { reducer as summaryReducer } from '../views/Summary/store/index.js';

const reducer = combineReducers({
  homeStore: homeReducer,
  detailStore: detailReducer,
  summaryStore: summaryReducer,
});

export default reducer;