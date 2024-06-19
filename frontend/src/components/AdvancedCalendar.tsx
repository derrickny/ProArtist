'use client';

import React, { useEffect, useState } from 'react';
import { Calendar as BigCalendar, momentLocalizer, View, EventProps, DateLocalizer, ResourceHeaderProps } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import EventComponent from '@/components/events';
import Toolbar from '@/components/toolbar';
import CustomHeader from '@/components/CustomHeader';
import EmptyDayHeader from '@/components/EmptyHeader';
import '@/components/styles.css';

const localizer = momentLocalizer(moment);

interface SelectOption {
  value: number | 'all';
  label: string;
}

interface CalendarProps {
  localizer: DateLocalizer;
  events: any[];
  startAccessor: string;
  endAccessor: string;
  style: { height: string };
  components: {
    dayHeader: React.FC;
    resourceHeader: React.FC<ResourceHeaderProps>; // Corrected the type here
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
  const [appliedSelection, setAppliedSelection] = useState<SelectOption[]>([]); //
  
  useEffect(() => {
    fetch('http://127.0.0.1:8000/staff')
      .then(response => response.json())
      .then(staffData => {
        const options = staffData.map((staff: any) => ({ value: staff.id, label: staff.first_name }));
        setStaffMembers([...options]);
        setSelectedOption([...options]); // Initialize with all options
        setAppliedSelection([...options]); // Initialize appliedSelection with all options as well
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

  const handleChange = (selectedOptions: SelectOption[]) => {
    setSelectedOption(selectedOptions);
  };

  // Updated handleApply function to filter staff members based on selectedOption
  // and update the calendar's resources accordingly
const handleApply = () => {
  const selectedStaffIds = selectedOption.map(option => option.value);
  const filteredStaffMembers = staffMembers.filter(member => 
    selectedStaffIds.includes(member.value));
  setAppliedSelection(filteredStaffMembers);
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
      resourceHeader: CustomHeader, // No change needed here, assuming CustomHeader is correctly typed
      event: EventComponent,
      toolbar: (props: any) => (
        <Toolbar 
          {...props} 
          onView={setCurrentView} 
          viewDate={viewDate} 
          setCurrentDate={setCurrentDate} 
          selectedOption={selectedOption} 
          options={staffMembers} 
          handleChange={handleChange} // Now correctly references the handleChange function
          onApply={handleApply} 
        />
      ),
    },
    onNavigate: (date: Date) => {
      setViewDate(date);
      setCurrentView('day');
      setCurrentDate(date);
    },
    defaultDate: currentDate,
    onView: (view: View) => setCurrentView(view),
    view: currentView,
    titleAccessor: () => ""
  };

  if (currentView === 'day') {
    calendarProps.resources = staffMembers.filter(member => selectedOption.map(option => option.value).includes(member.value));
    // Ensure "All Staff" is not included in the resources
    // This assumes "All Staff" is not in staffMembers anymore, so no explicit check is needed here
    calendarProps.resourceIdAccessor = "value";
    calendarProps.resourceTitleAccessor = "label";
  }

  return <BigCalendar key={currentDate.toString()} {...calendarProps} />;
};

export default AdvancedCalendar;