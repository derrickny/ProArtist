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
};

const EventComponent: React.FC<EventProps<APIAppointment>> = ({ event }) => {
    return (
      <div style={{
        padding: '10px',
        backgroundColor: 'lightblue',
        border: 'none',  // Ensure there's no border unless desired
        borderRadius: '5px',
        color: 'black'  // Ensure text color is set if needed
      }}>
        <div style={{ marginBottom: '5px' }}>{moment(event.start).format('h:mm A')} - {moment(event.end).format('h:mm A')}</div>
        <div style={{ marginBottom: '5px', fontWeight: 'bold' }}>{event.customer_name}</div>
        <div style={{ marginBottom: '5px' }}>{event.service_name} ({moment(event.end).diff(moment(event.start), 'minutes')} mins)</div>
      </div>
    );
  };
  
  export default EventComponent;