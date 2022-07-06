import request from '../../../utils/request';
import { HOME_LIST } from './actionTypes';

const weeklyListUrl = '/api/weeks/list';

export const getList = list => ({
  type: HOME_LIST,
  payload: { list },
});

export const getListEffect = () => (dispatch) => {
  return request.get(weeklyListUrl).then((res) => {
    console.log('-----getListEffect-----', res)

    dispatch(getList(res.data));
  });
};
