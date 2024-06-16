import React from 'react';
import { ToolbarProps, View } from 'react-big-calendar';
import moment from 'moment';
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import { useState } from 'react';
import StaffDropdown from '@/components/staffdropdown'; // Removed StaffDropdownProps import

interface SelectOption {
  value: number | 'all';
  label: string;
}

interface StaffMember {
  id: number;
  first_name: string;
}



interface CustomToolbarProps extends ToolbarProps {
  viewDate: Date;
  onView: (view: View) => void;
  setCurrentDate: (date: Date) => void;
  staffMembers: StaffMember[];
  onSelectionChange: (selectedStaffIds: number[]) => void;
}

const Toolbar: React.FC<CustomToolbarProps> = ({ onView, viewDate, setCurrentDate, staffMembers, onSelectionChange }) => {
  const navigateToDay = (day: Date) => {
    onView('day');
    setCurrentDate(day);
  };

  const datesToShow = Array.from({ length: 6 }, (_, i) => moment().add(i, 'days'));

  const [isHovered, setIsHovered] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: '10px', overflow: "visible" }}>
      <div style={{ display: 'flex', marginRight: 'auto' }}>
        <div style={{ position: 'relative', display: 'inline-block', marginRight: '10px' }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Button onClick={() => {/* Add your logic for opening the appointment popup here */}}>
            <CirclePlus />
          </Button>
          <div style={{
            visibility: isHovered ? 'visible' : 'hidden',
            backgroundColor: 'white',
            color: 'black',
            textAlign: 'center',
            border: '1px solid #ccc',
            borderRadius: '16px',
            padding: '3px 0',
            position: 'absolute',
            zIndex: 1,
            bottom: '125%',
            left: '50%',
            marginLeft: '-60px',
            width: '100px',
            fontSize: '11px',
          }}>
            New Appointment
          </div>
        </div>
        <div style={{ marginRight: '10px', marginTop: '3px', overflow: 'visible', position: 'relative', zIndex: 1000 }}>
          <StaffDropdown
              staffMembers={staffMembers}
              onSelectionChange={onSelectionChange}
          />
        </div>
        {datesToShow.map((dateMoment, index) => (
          <Button
            key={index}
            onClick={() => navigateToDay(dateMoment.toDate())}
            style={{ margin: 2, padding: '5px 8px', fontSize: '14px' }}
          >
            <div style={{ marginBottom: '20px'}}>{dateMoment.format('D')}</div>
            <div style={{ marginTop: '10px' }}>
              {moment().isSame(dateMoment, 'day') ? 'Today' : dateMoment.format('ddd')}
            </div>
          </Button>
        ))}
      </div>
      <div>
        <Button onClick={() => onView('week')} style={{ padding: '5px 8px', fontSize: '14px', marginRight: '10px' }}>Week</Button>
        <Button onClick={() => onView('day')} style={{ padding: '5px 8px', fontSize: '14px' }}>Day</Button>
      </div>
    </div>
  );
};

export default Toolbar;