import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/stores';
import AppleItem from './AppleItem';


function getAppleItem (appleList) {
  const data = appleList.reduce((list, apple) => {
    if (!apple.isEaten) {
      list.push(<AppleItem appleItem={apple} key={apple.id}></AppleItem>);
    }
    return list;
  }, []);

  if (data.length > 0) {
    return data
  }

  return <div className="empty-tip" key="empty">苹果吃完了</div>
}

function AppleBasket () {
  const { appleStore } = useStore();
  const { isPicking, buttonText, appleList, pickApple, status } = appleStore;
  return (<div className="appleBusket">
    <div className="title">苹果篮子</div>

    <div className="stats">
      <div className="section">
        <div className="head">当前</div>
        <div className="content">
          {status.hasAppleCount}个苹果，{status.hasAppleWeight}克
        </div>
      </div>
      <div className="section">
        <div className="head">已吃掉</div>
        <div className="content">
          {status.eatenAppleCount}个苹果，{status.eatenAppleWeight}克
        </div>
      </div>
    </div>

    <div className="appleList">
      {getAppleItem(appleList)}
    </div>

    <div className="btn-div">
      <button
        className={isPicking ? 'disabled' : ''}
        onClick={pickApple}
      >{buttonText}</button>
    </div>
  </div>);
}

export default observer(AppleBasket);