import React from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';

BigCalendar.momentLocalizer(moment);

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    let myEventsList = [];

    return <div>
      <BigCalendar
        events={myEventsList}
        startAccessor='startDate'
        endAccessor='endDate'
        />
    </div>;
  }
}

export { App }
