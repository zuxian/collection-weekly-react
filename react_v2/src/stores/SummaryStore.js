import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import request from '@/utils/request';

const weeklySummaryUrl = '/api/summary/overview';

class SummaryStore {
  constructor() {
    makeObservable(this, {
      overview: observable,
      getSummaryEffect: action.bound,
    });
  }
  overview = {}

  getSummaryEffect() {
    return request.get(weeklySummaryUrl).then((res) => {
      runInAction(() => {
        this.overview = res.data
      })
      return res
    });
  }
}

export default SummaryStore;
