import React from 'react';
import { ToolbarProps, View } from 'react-big-calendar';
import moment from 'moment';
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import { useState } from 'react';
import Select, { ActionMeta, MultiValue, components } from 'react-select';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
interface SelectOption {
  value: number | 'all';
  label: string;
}

interface CustomToolbarProps extends ToolbarProps {
  viewDate: Date;
  onView: (view: View) => void;
  setCurrentDate: (date: Date) => void;
  selectedOption: SelectOption[]; // Add this prop
  options: SelectOption[]; // Add this prop
  handleChange: (option: SelectOption[]) => void; // Add this prop
}

const { Option } = components;
const CheckboxOption = (props: any) => (
  <Option {...props}>
    <input type="checkbox" checked={props.isSelected} onChange={() => null} /> {props.label}
  </Option>
);

const Toolbar: React.FC<CustomToolbarProps> = ({ onView, viewDate, setCurrentDate, selectedOption, options, handleChange }) => {
  const navigateToDay = (day: Date) => {
    onView('day');
    setCurrentDate(day);
  };

  const datesToShow = Array.from({ length: 6 }, (_, i) => moment().add(i, 'days'));

  const [isHovered, setIsHovered] = useState(false);
  const handleSelectChange = (newValue: MultiValue<SelectOption>, actionMeta: ActionMeta<SelectOption>) => {
    if (newValue.some(option => option.value === 'all')) {
      // If "All Staff" is selected, select all options
      handleChange(options);
    } else {
      handleChange(newValue as SelectOption[]);
    }
  };
// ...
return (
  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: '10px' ,overflow:"visible"}}>
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
        <Select
        isMulti
        value={selectedOption}
        options={options}
        onChange={handleSelectChange}
        components={{ Option: CheckboxOption }}
        styles={{
          control: (provided) => ({
            ...provided,
            borderRadius: '10px'
          })
        }}
        />
        </div>
      {datesToShow.map((dateMoment, index) => (
        <Button
          key={index}
          onClick={() => navigateToDay(dateMoment.toDate())}
          style={{ margin: 2, padding: '5px 8px', fontSize: '14px' }} // Reduced margin here
        >
          <div style={{ marginBottom: '20px'}}>{dateMoment.format('D')}</div>
          <div style={{ marginTop: '10px' }}>
            {moment().isSame(dateMoment, 'day') ? 'Today' : dateMoment.format('ddd')}
          </div>
        </Button>
      ))}
    </div>
    <div>
      <Button onClick={() => onView('week')} style={{ padding: '5px 8px', fontSize: '14px', marginRight: '10px' }}>Week</Button> {/* Reduced margin here */}
      <Button onClick={() => onView('day')} style={{ padding: '5px 8px', fontSize: '14px' }}>Day</Button>
    </div>
  </div>
);
// ...
};

export default Toolbar;