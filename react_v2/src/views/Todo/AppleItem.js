import React from 'react';
import { useStore } from '@/stores';


function AppleItem ({ appleItem }) {
  const { appleStore } = useStore();

  return (<div className="appleItem">
    <div className="apple"><img src="/apple.png" alt="" /></div>
    <div className="info">
      <div className="name">红苹果 - {appleItem.id}号</div>
      <div className="weight">{appleItem.weight}克</div>
    </div>
    <div className="btn-div">
      <button onClick={() => appleStore.eatApple(appleItem.id)}>吃掉</button>
    </div>
  </div>);
}

export default AppleItem;