import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  start: PropTypes.object.isRequired,
  end: PropTypes.object.isRequired,
  value: PropTypes.string.isRequired,
};


class Event extends React.Component {
  render() {

    const {
      start,
      end,
      value,
    } = this.props;

    return (
      <div className="event">
        <strong>{`${start.format('HH:mm')} - ${end.format('HH:mm')}`}</strong>
      </div>
    );
  }
}

Event.propTypes = propTypes;
export default Event;
