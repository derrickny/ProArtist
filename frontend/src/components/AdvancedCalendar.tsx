import React from 'react';
import moment from 'moment';
import Calendar from '@/components/calender';  // Ensure the path is correct

// Type definitions
export type APIAppointment = {
  id: number;
  customer_name: string;
  user_name: string;
  location_name: string;
  service_name: string;
  status: string;
  date: string;
  time: string;
};

type CalendarEvent = {
  id: number;
  title: string;
  start: Date;
  end: Date;
  status: string;
};

type Props = {
  events: APIAppointment[];
};

// Component for displaying events in a calendar
const AdvancedCalendar: React.FC<Props> = ({ events }) => {
  const appointments: CalendarEvent[] = events.map(event => ({
    id: event.id,
    title: `${event.customer_name} - ${event.service_name}`,
    start: new Date(moment(`${event.date} ${event.time}`).format('YYYY-MM-DD HH:mm:ss')),
    end: new Date(moment(`${event.date} ${event.time}`).add(1, 'hour').format('YYYY-MM-DD HH:mm:ss')),  // Assuming 1 hour duration
    status: event.status,
  }));

  // Custom components for displaying events based on their status
  const components = {
    event: (props: any) => {
      const { status, title } = props.event;
      switch (status) {
        case "Scheduled":
          return <div style={{ background: "yellow", color: "white", height: "100%" }}>{title}</div>;
        case "Completed":
          return <div style={{ background: "lightgreen", color: "white", height: "100%" }}>{title}</div>;
        default:
          return null;
      }
    },
  };

  return <Calendar events={appointments} components={components} />;
};

export default AdvancedCalendar;