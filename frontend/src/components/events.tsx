import React from 'react';
import { EventProps } from 'react-big-calendar';
import moment from 'moment';

// Define the types for the event's properties
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

// Create and export the EventComponent
const EventComponent: React.FC<EventProps<APIAppointment>> = ({ event }) => {
  return (
    <div style={{ padding: '10px', backgroundColor: '#f9f9f9', border: '1px solid #ddd', borderRadius: '5px' }}>
      <div style={{ marginBottom: '5px', fontWeight: 'bold' }}>{event.customer_name} - {event.service_name}</div>
      <div style={{ marginBottom: '5px', fontStyle: 'italic' }}>{event.location_name}</div>
      <div style={{ marginBottom: '5px' }}>{moment(event.start).format('HH:mm')} - {moment(event.end).format('HH:mm')}</div>
      <div style={{ color: event.status === 'completed' ? 'green' : 'red' }}>{event.status} by {event.user_name}</div>
    </div>
  );
};

export default EventComponent;