'use client';

import React, { useEffect, useState } from 'react';
import { APIAppointment } from '@/components/AdvancedCalendar';
import AdvancedCalendar from '@/components/AdvancedCalendar';
import PageTitle from '@/components/pageTitle';

const Appointments: React.FC = () => {
  const [appointments, setAppointments] = useState<APIAppointment[]>([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/appointments');
        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        console.error('Failed to fetch appointments:', error);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div>
      <PageTitle title="Appointments" className="mb-4" />
      <AdvancedCalendar events={appointments} />
    </div>
  );
};

export default Appointments;