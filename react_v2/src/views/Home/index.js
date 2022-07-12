import React, { useEffect } from 'react';
import Card from './components/Card/index.js';
import styles from './index.less';
import { actionCreators } from './store';
import { connect } from "react-redux";


function Home (props) {
  useEffect(() => { props.getListEffect() }, [])

  const { cardList=[] } = props || {};
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

export default connect((state) => state.homeStore, actionCreators)(Home);