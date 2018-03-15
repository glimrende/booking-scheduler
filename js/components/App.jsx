import React from 'react';
import moment from 'moment';
import axios from 'axios';

import Datepicker from 'react-datepicker';

import FontAwesome from 'react-fontawesome';
import WeekCalendar from 'react-week-calendar';
import { Loader } from './Loader.jsx';
import Select from 'react-select';

import 'react-select/dist/react-select.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-week-calendar/dist/style.css';

import Event from './Event.jsx';
import Modal from './Modal.jsx';

moment.locale('nb');

const host = (location.host !== 'localhost:8080') ? '' : 'http://localhost:8100';
const baseurl = host + '/admin/';



class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      intervals : [],
      loading: true,
      loadingProviders: true,
      showcalendar: false,
      date: moment(),
      serviceProvider: null,
      serviceProviders: []
    }
  }

  componentDidMount() {
    this.loadProviders();
  }

  loadProviders = async() => {
    this.setState({loadingProviders: true});
    let res = await axios.get(baseurl  + 'bookableTimeIntervals/getServiceProviders' , {withCredentials: true});
    let serviceProviders = [];
    for(var i=0; i<res.data.length; i++) {
      let provider = res.data[i];
      serviceProviders.push ({value : provider.id, label: provider.fullname});
    }
    this.setState({
        serviceProvider: serviceProviders[0],
        serviceProviders,
        loadingProviders: false
    },
    () => {
      this.loadIntervals();
    });

  }

  loadIntervals = async () => { 
    this.setState({intervals: [], loading: true});
    let res = await axios.get(baseurl + 'bookableTimeIntervals/' + this.state.serviceProvider.value + '/' + this.state.date.format("YYYY-MM-DD") , {withCredentials: true});

    let intervals = [];
    for(var i=0; i<res.data.length; i++) {
      let interval = res.data[i];
      intervals.push({
        value: ''+interval.id,
        start: moment(interval.start),
        end: moment(interval.end)
      });
    }
    this.setState({intervals, loading: false});

  }


  addInterval = (intervals) => {

    let interval = intervals[0];
    axios.post(baseurl + 'bookableTimeIntervals/' + this.state.serviceProvider.value + '/' , {interval}, {withCredentials: true}).then((res) => {
      intervals = this.state.intervals;
      interval.value = '' + res.data.id;
      intervals.push(interval);
      this.setState({intervals});
    });
  }


  findIntervalIndex = (id) =>  {
    let intervals = this.state.intervals;
    for (let i=0; i<intervals.length; i++) {
      let interval = intervals[i];
      if (interval.value === id) {
        return interval;
      }
    }
  }

  deleteInterval = (interval) => {
    let id = interval.value;

    axios.delete(baseurl + 'bookableTimeIntervals/' + this.state.serviceProvider.value + '/' + id + '/delete', {withCredentials: true}).then((res) => {

      let id = res.data.id;
      let intervals = this.state.intervals;
      for (let i=0; i<intervals.length; i++) {
        let interval = intervals[i];
          if(interval.value == id) {
          intervals.splice(i,1);
          break;
        }
      }
      this.setState({intervals});
    });
  }

  updateInterval = (interval) => {

    let index = this.findIntervalIndex(interval.value);
    let intervals = this.state.intervals;
    intervals[index] = interval;
    this.setState({
      intervals
    })

    return;
    axios.delete(baseurl + 1 + '/' + id, {interval}, {withCredentials: true}).then((res) => {
      console.log(res);
    });
  }

  browseWeek = (num=1) => {
    this.setState({
      date: this.state.date.add(num , 'weeks')
    })
    this.loadIntervals();
  }

  handleDateChange = (date) => {
    this.setState({date})
    this.loadIntervals();
    this.toggleCalendar();
  }

  toggleCalendar = (e) => {
    e && e.preventDefault()
    this.setState({showcalendar: !this.state.showcalendar})
  }

  selectProvider = (e) => {
    this.setState({
      serviceProvider: e,
    }, () => {
      this.loadIntervals();
    });
  }

  render() {


    if (this.state.loadingProviders) return <Loader/>

    let disabled = this.state.loading ? 'disabled' : null;
    return <div className='w-100'>

      <div className='d-flex w-25'>
      <Select
        className='w-100'
         name="form-field-name"
         value={this.state.serviceProvider.id}
         onChange={this.selectProvider}
         clearable={false}
         options={this.state.serviceProviders}
       />
      </div>
      <div className='d-flex justify-content-center'>
        <h1>{this.state.serviceProvider ? this.state.serviceProvider.label : null}</h1>
      </div>

      <div className='d-flex justify-content-between align-items-center p-4'>
        <a className={`btn btn-info ${disabled}`}  onClick={() => { disabled ? null : this.browseWeek(-1) }} href='#'>Forrige</a>
        Uke {this.state.date.week()}
        <span>
          <a className={`btn btn-info ${disabled}`}   onClick={() => { disabled ? null : this.browseWeek(1) }} href='#'>Neste</a>
          <a className={`btn btn-info ${disabled} ml-2`}   onClick={() => { disabled ? null : this.toggleCalendar(); }} href='#'><FontAwesome name='calendar'/></a>
          {
            this.state.showcalendar && (
            <Datepicker   selected={this.state.date}
                onChange={this.handleDateChange} withPortal inline/>)
          }

      </span>
      </div>

      {this.state.loading ?
        <Loader/>
      :
        <WeekCalendar
          firstDay={moment().day(1)}
          selectedIntervals={this.state.intervals}
          eventComponent={Event}
          modalComponent={Modal}
          onIntervalSelect={this.addInterval}
          onIntervalUpdate={this.updateInterval}
          onIntervalRemove={this.deleteInterval}
          startTime={moment({h:'08', m:'00'})}
          endTime={moment({h:'18', m:'00'})}
        />
      }
    </div>


  }
}

export { App }
