import React, { useEffect, useState } from 'react';
import { Calendar as BigCalendar, momentLocalizer, View } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import EventComponent from '@/components/events';
import Toolbar from '@/components/toolbar';


const localizer = momentLocalizer(moment);

const AdvancedCalendar: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewDate, setViewDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<View>('day'); // Initialize the view state as 'week'

  useEffect(() => {
    fetch('http://127.0.0.1:8000/appointments')
      .then(response => response.json())
      .then(data => {
        const mappedEvents = data.map((event: any) => ({
          ...event,
          start: new Date(`${event.date}T${event.time}`),
          end: new Date(new Date(`${event.date}T${event.time}`).getTime() + 60 * 60 * 1000),
        }));
        setEvents(mappedEvents);
        setLoading(false);
      })
      .catch(error => {
        console.error('Failed to fetch appointments:', error);
        setError('Failed to load appointments.');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <BigCalendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      style={{ height: '750px' }}
      view={currentView}
      onView={setCurrentView}
      components={{
        event: EventComponent,
        toolbar: props => <Toolbar {...props} viewDate={viewDate} onView={setCurrentView} />
      }}
      onNavigate={date => setViewDate(date)}
      defaultDate={new Date()}
    />
  );
};

export default AdvancedCalendar;