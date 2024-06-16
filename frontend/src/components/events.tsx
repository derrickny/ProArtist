import React from 'react';
import { EventProps } from 'react-big-calendar';
import moment from 'moment';

type APIAppointment = {
  id: number;
  customer_name: string;
  user_name: string;
  location_name: string;
  service_name: string;
  status: string;
  date: string;
  time: string;
  start: Date;
  end: Date;
  service_duration: number;
};

const EventComponent: React.FC<EventProps<APIAppointment>> = ({ event }) => {
const statusClass = `rbc-event--${event.status.replace(/\s+/g, '')}`;  // Remove spaces from status
const end = moment(event.start).add(event.service_duration, 'minutes');


  return (
    <div className={`rbc-event rbc-event--${event.status}`} style={{
      padding: '10px',
      backgroundColor: '#f0f7ff',  // Lighter blue color for a more modern look
      border: 'none',
      borderRadius: '5px',
      color: '#333',  // Dark gray color for text
      fontSize: '0.8em',  // Smaller text size
      textAlign: 'left'  // Text aligned to the left
    }}>
      {/* Display start time, calculated end time, and service duration */}
      <div style={{ marginBottom: '5px' }}>
        {moment(event.start).format('h:mm A')} - {end.format('h:mm A')}
      </div>
      <div style={{ marginBottom: '5px', fontWeight: 'bold' }}>
        {event.customer_name}
      </div>
      <div style={{ marginBottom: '5px' }}>
        {event.service_name} ({event.service_duration} mins)
      </div>
    </div>
  );
};

export default EventComponent;