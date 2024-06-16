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

interface SelectOption {
  value: number | 'all';
  label: string;
}

interface StaffMember {
  id: number;
  first_name: string;
}

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
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedOption, setSelectedOption] = useState<SelectOption[]>([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/staff')
      .then(response => response.json())
      .then(staffData => {
        const allStaffOption = { value: 'all', label: 'All Staff' };
        const options = staffData.map((staff: any) => ({ value: staff.id, label: staff.first_name }));
        setStaffMembers([allStaffOption, ...options]);
        setSelectedOption([allStaffOption, ...options]); // Set all staff as selected by default
      })
      .catch(error => {
        console.error('Failed to fetch staff:', error);
        setError('Failed to load staff.');
        setLoading(false);
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

  const handleChange = (option: SelectOption[]) => {
    setSelectedOption(option);
  };

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
      toolbar: (props: any) => (
        <Toolbar 
          {...props} 
          onView={setCurrentView} 
          viewDate={viewDate} 
          setCurrentDate={setCurrentDate} 
          selectedOption={selectedOption} 
          options={staffMembers} 
          handleChange={handleChange} 
        />
      )
    },
    onNavigate: (date: Date) => {
      setViewDate(date);
      setCurrentView('day');
      setCurrentDate(date);
    },
    defaultDate: currentDate, // Use currentDate state as the defaultDate
    onView: (view: View) => setCurrentView(view),
    view: currentView,
    titleAccessor: () => ""
  };

  // Conditionally add resources for 'day' view only
// Conditionally add resources for 'day' view only
if (currentView === 'day') {
  calendarProps.resources = staffMembers.filter(member => member.value !== 'all');
  calendarProps.resourceIdAccessor = "value"; // Use "value" instead of "id"
  calendarProps.resourceTitleAccessor = "label"; // Use "label" instead of "first_name"
}

  return <BigCalendar key={currentDate.toString()} {...calendarProps} />;
};

export default AdvancedCalendar;