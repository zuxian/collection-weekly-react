import React, { Component } from 'react';

export default styles => (DecoratedComponent) => {
  return class NewComponent extends Component {
    componentDidMount() {
      if (this.props.staticContext) {
        this.props.staticContext.css.push(styles._getCss());
      }
    }
    render() {
      return <DecoratedComponent {...this.props} />;
    }
  };
};
