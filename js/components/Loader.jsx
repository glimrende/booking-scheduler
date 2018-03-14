import React from 'react';
import Fontawesome from 'react-fontawesome';


class Loader extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.hidden) {
      return null;
    }
    return (
      <div className='d-flex w-100 h-100 justify-content-center align-items-center'>
        <Fontawesome className='fa-2x fa-spin' name='spinner'/>
      </div>
    );
  }
}


export { Loader }
