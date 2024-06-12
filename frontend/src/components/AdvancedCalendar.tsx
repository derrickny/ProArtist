'use client';

import React, { useEffect, useState } from 'react';
import { Calendar as BigCalendar, momentLocalizer, View, EventProps, DateLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import EventComponent from '@/components/events';
import Toolbar from '@/components/toolbar';
import CustomHeader from '@/components/CustomHeader';
import { ResourceHeaderProps } from 'react-big-calendar';
import EmptyDayHeader from '@/components/EmptyHeader';
import '@/components/styles.css';

const localizer = momentLocalizer(moment);

interface CalendarProps {
  localizer: DateLocalizer;
  events: any[];
  startAccessor: string;
  endAccessor: string;
  style: { height: string };
  components: {
    dayHeader: React.FC;
    resourceHeader: React.FC<ResourceHeaderProps<any>>;
    event: React.FC<EventProps<any>>;
    toolbar: (props: any) => JSX.Element;
  };
  onNavigate: (date: Date) => void;
  defaultDate: Date;
  onView: (view: View) => void;
  view: View;
  resources?: any[];
  resourceIdAccessor?: string;
  resourceTitleAccessor?: string;
  titleAccessor: () => string;
}

const AdvancedCalendar: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [staffMembers, setStaffMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewDate, setViewDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<View>('day');

  useEffect(() => {
    fetch('http://127.0.0.1:8000/staff')
      .then(response => response.json())
      .then(staffData => {
        setStaffMembers(staffData);
      });

    fetch('http://127.0.0.1:8000/appointments')
      .then(response => response.json())
      .then(data => {
        const mappedEvents = data.map((event: any) => ({
          ...event,
          start: new Date(`${event.date}T${event.time}`),
          end: new Date(new Date(`${event.date}T${event.time}`).getTime() + 60 * 60 * 1000),
          resourceId: event.user_id,
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

  const calendarProps: CalendarProps = {
    localizer,
    events,
    startAccessor: "start",
    endAccessor: "end",
    style: { height: '750px' },
    components: {
      dayHeader: EmptyDayHeader,
      resourceHeader: CustomHeader,
      event: EventComponent,
      toolbar: (props: any) => <Toolbar {...props} onView={setCurrentView} viewDate={viewDate} />
    },
    onNavigate: (date: Date) => setViewDate(date),
    defaultDate: new Date(),
    onView: (view: View) => setCurrentView(view),
    view: currentView,
    titleAccessor: () => ""
  };

  // Conditionally add resources for 'day' view only
  if (currentView === 'day') {
    calendarProps.resources = staffMembers;
    calendarProps.resourceIdAccessor = "id";
    calendarProps.resourceTitleAccessor = "first_name";
  }

  return <BigCalendar {...calendarProps} />;
};

export default AdvancedCalendar;