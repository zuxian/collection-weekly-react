import React, { useEffect } from 'react';
import Card from './components/Card/index.js';
import styles from './index.less';
import { useStore } from '@/stores';
import { observer } from 'mobx-react-lite';

function Home () {
  const { homeStore } = useStore();
  const { getListEffect, cardList = [] } = homeStore;
  useEffect(() => { getListEffect() }, [])

  if (!cardList.length) return null;
  const reverseList = cardList.slice().reverse();
  return (
    <div className="card-wrapper">
      <h2 className="hidden-title">Weekly List</h2>
      <ol className="weekly__list" reversed>
        {reverseList.map(card => (
          <Card data={card} key={card.id} />
        ))}
      </ol>
    </div>
  );
}

export default observer(Home);
