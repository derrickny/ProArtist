

import React from 'react';
import AdvancedCalendar from '@/components/AdvancedCalendar';
import PageTitle from '@/components/pageTitle';

const Appointments: React.FC = () => {
  return (
    <div>
      <PageTitle title="Appointments" className="mb-4" />
      <AdvancedCalendar />
    </div>
  );
};

export default Appointments;