import { action, computed, makeObservable, observable, runInAction } from 'mobx';

function getApple () {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 300)
  })
}

class AppleStore {
  constructor() {
    makeObservable(this, {
      appleList: observable,
      appleId: observable,
      isPicking: observable,
      buttonText: observable,
      pickApple: action.bound,
      eatApple: action.bound,
      status: computed
    });
  }
  appleList = [
    {
      id: 0,
      weight: 233,
      isEaten: false
    }
  ];
  isPicking = false;
  buttonText = '摘苹果';
  appleId = 0;

  get status () {
    let status = {
      hasAppleCount: 0,
      hasAppleWeight: 0,
      eatenAppleCount: 0,
      eatenAppleWeight: 0
    };
    this.appleList.forEach(apple => {
      if (apple.isEaten) {
        status.eatenAppleCount++;
        status.eatenAppleWeight += apple.weight;
      } else {
        status.hasAppleCount++;
        status.hasAppleWeight += apple.weight;
      }
    });
    return status;
  }

  async pickApple () {
    if (this.isPicking) {
      return
    }

    this.isPicking = true;
    this.buttonText = '正在摘...'

    await getApple()

    runInAction(() => {
      const weight = Math.floor(200 + Math.random() * 50);
      this.appleList.push({
        id: ++this.appleId,
        weight,
        isEaten: false
      });
      this.buttonText = '摘苹果';
      this.isPicking = false;
    });
  }

  eatApple (appleId) {
    this.appleList.forEach((apple) => {
      if (apple.id === appleId) {
        apple.isEaten = true;
      }
    })
  }
}

export default AppleStore;