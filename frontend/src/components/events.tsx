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
    const statusClass = `rbc-event--${event.status.replace(/\s+/g, '')}`;  // Remove spaces from status

    return (
        <div className={`rbc-event ${statusClass}`} style={{
            padding: '10px',
            border: 'none',
            borderRadius: '5px',
            color: '#333',  // Dark gray color for text
            fontSize: '0.8em',  // Smaller text size
            textAlign: 'left'  // Text aligned to the left
        }}>
            <div className="rbc-event-content" style={{ marginBottom: '5px' }}>
                {moment(event.start).format('h:mm A')} - {moment(event.end).format('h:mm A')}
            </div>
            <div style={{ marginBottom: '5px', fontWeight: 'bold' }}>{event.customer_name}</div>
            <div style={{ marginBottom: '5px' }}>
                {event.service_name} ({moment(event.end).diff(moment(event.start), 'minutes')} mins)
            </div>
        </div>
    );
};

export default EventComponent;