import React from 'react';
import FontAwesome from  'react-fontawesome';

import moment from 'moment';
import 'moment/locale/nb';

class Timepicker extends React.Component {

  constructor(props) {

    super(props);
    this.handleChange = this.handleChange.bind(this);

    this.parseTime = this.parseTime.bind(this);
    this.state = this.parseTime(props.value);

    this.props = props;
  }

  parseTime(value) {
    let time = moment(value);

    let hours = time.format("HH");
    let minutes = time.format("mm");

    if (time.minutes() % 5 != 0) minutes = "00";

    return {hours, minutes};
  }

  componentWillReceiveProps(nextProps) {

    if (this.props.value != nextProps.value) {
      this.setState(
        this.parseTime(nextProps.value)
      );
    }
  }

  handleChange() {
    this.props.onChange(this.props.name, this.state.hours, this.state.minutes);
  }

  updateHours = (inc) => {
    let h = moment(this.state.hours, "HH");
    h.set('minutes', this.state.minutes);
    if (inc) {
      h = h.add(1,'hour');
    } else {
      h = h.subtract(1,'hour');
    }
    this.constrain(h);
  }

  updateMinutes = (inc) => {
    let m = moment(this.state.minutes, "mm");
    m.set('hours', this.state.hours);
    if (inc) {
      m = m.add(5,'minute');
    } else {
      m = m.subtract(5,'minute');
    }
    this.constrain(m);

  }

  constrain = (time) => {
    if (time.hours() < 8) {
      time = time.set('hours', 8).set('minutes', 0);
    } else if (time.hours() >= 18) {
      time = time.set('hours', 18).set('minutes', 0);
    }
    
    this.setState({
      hours: time.format('HH'),
      minutes: time.format('mm')
    }, () => {
      this.handleChange();
    });
  }


  render() {

    return (
      <div className='d-flex flex-row align-items-center'>
        <div className='d-flex flex-column align-items-center'>
          <a onClick={() => { this.updateHours(true) }}><FontAwesome name='plus'/></a>
          <input className='timepicker text-center' type='text' size='2' maxLength='2' value={this.state.hours} onChange={this.handleChange}/>
          <a onClick={() => { this.updateHours(false)} }><FontAwesome name='minus'/></a>
        </div>
        <strong className='mx-2'>:</strong>
        <div className='d-flex flex-column align-items-center'>
          <a onClick={() => { this.updateMinutes(true) }}><FontAwesome name='plus'/></a>
          <input className='timepicker text-center' type='text' size='2' maxLength='2' value={this.state.minutes} onChange={this.handleChange}/>
          <a onClick={() => { this.updateMinutes(false) }}><FontAwesome name='minus'/></a>
        </div>
      </div>
    );
  }
}



export { Timepicker };
