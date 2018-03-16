import React from 'react';
import PropTypes from 'prop-types';
import {Timepicker} from './Timepicker.jsx';

const propTypes = {
  start: PropTypes.object.isRequired,
  end: PropTypes.object.isRequired,
  value: PropTypes.string,
  onRemove: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

const defaultProps = {
  value: '',
};


class Modal extends React.Component {

  constructor (props) {
    super();

    this.interval = {start:props.start, end:props.end, value:props.value};
    let eh = this.interval.end.get('hours');
    let em = this.interval.end.get('minutes');

    this.interval.end = this.interval.start.clone();
    this.interval.end.set({hours:eh, minutes:em});

    console.log (this.interval);
  }

  handleRemove = () => {
    this.props.onRemove();
  }

  handleSave = () => {

    const { start, end, value }  = this.interval;

    this.props.onSave({
      start,
      end,
      value
    });
  }

  renderText = () => {
    const {
      start,
      end,
    } = this.interval;

    if (start.isSame(end, 'day')) {
      return (<span>{`${start.format('Do MMM., HH:mm')} - ${end.format('HH:mm')}`}</span>);
    }
    return (<span>{`${start.format('Do MMM.')} - ${end.format('Do MMM.')}, ${start.format('HH:mm')} - ${end.format('HH:mm')}`}</span>);
  }

  update = (name, hours, minutes) => {

    let ob = (name == 'start') ? this.interval.start : this.interval.end;
    ob.set('hours', hours).set('minutes', minutes);
    if (name == 'start') {
      this.interval.start = ob;
    } else {
      this.interval.end = ob;
    }
  }

  render() {
    const {
      value,
    } = this.interval;
    return (
      <div className="customModal">
        <div className="customModal__text">{this.renderText()}</div>
        <div className='d-flex flex-row justify-content-center'>
          <div className='p-4 text-center'>
            <strong>Fra</strong>
            <Timepicker name='start' value={this.interval.start} onChange={this.update}/>
          </div>
          <div className='p-4 text-center'>
            <strong>Til</strong>
            <Timepicker name='end' value={this.interval.end} onChange={this.update}/>
          </div>
        </div>
        <button className="btn btn-info" onClick={this.handleRemove}>Delete</button>
        <button className="btn btn-info customModal__button_float_right" onClick={this.handleSave}>Save</button>
      </div>
    );
  }
}

Modal.propTypes = propTypes;
Modal.defaultProps = defaultProps;
export default Modal;
