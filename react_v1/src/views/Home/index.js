import React, { Component } from 'react';
import Card from './components/Card';
import styles from './index.less';
import { actionCreators } from './store/index.js';
import { connect } from "react-redux";

class Home extends Component {
  fetchData = () => {
    this.props.getListEffect()
  }

  componentDidMount() {
    this.fetchData();
    const { cardList=[] } = this.props || {};
    if (!cardList.length) {
    }
  }

  render() {
    const { cardList=[] } = this.props || {};
    if (!cardList.length) return null;
    const reverseList = cardList.slice().reverse();
    return (
      <div className="card-wrapper">
        <h2 className="hidden-title">Weekly List</h2>
        <ol className="weekly__list" reversed>
          {reverseList.map(card => (
            <Card
              data={card}
              key={card.id}
              staticContext={this.props.staticContext}
            />
          ))}
        </ol>
      </div>
    );
  }
}

export default connect((state) => state.homeStore, actionCreators)(Home);