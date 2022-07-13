import React, { Component } from 'react';
import Card from './components/Card';
import styles from './index.less';
import { WithStyles } from '@/components';
import { actionCreators } from './store/index.js';
import { connect } from "react-redux";

export default @connect(
  state => ({ homeStore: state.homeStore }),
  dispatch => ({
    getHomeList: () => dispatch(actionCreators.getListEffect()),
  })
)
@WithStyles(styles)
class Home extends Component {
  fetchData = () => {
    this.props.getHomeList()
  }

  componentDidMount() {
    this.fetchData();
    const { cardList=[] } = this.props.homeStore || {};
    if (!cardList.length) {
    }
  }

  render() {
    const { cardList=[] } = this.props.homeStore || {};
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

// export default connect((state) => state.homeStore, actionCreators)(Home);