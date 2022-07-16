import { action, makeObservable, observable, runInAction } from 'mobx';
import request from '@/utils/request';

const weeklyListUrl = '/api/weeks/list';

class HomeStore {
  constructor() {
    makeObservable(this, {
      cardList: observable,
      getListEffect: action.bound,
    });
  }
  cardList = []

  getListEffect() {
    request.get(weeklyListUrl).then((res) => {
      runInAction(() => {
        this.cardList= res.data
      })
    });
  }
}

export default HomeStore;