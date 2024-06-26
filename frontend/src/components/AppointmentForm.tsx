import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select, { SingleValue, OptionsOrGroups, GroupBase } from 'react-select';

// Removed unused StaffOption interface

interface ServiceOption {
  id: string;
  description: string;
  // Assuming the missing property 'name' should be part of ServiceOption
  name: string; 
}

interface SelectOption {
  value: string;
  label: string;
}

interface GroupedSelectOption {
  label: string;
  options: SelectOption[];
}

const AppointmentForm = () => {
  const [staff, setStaff] = useState<SelectOption[]>([]);
  const [services, setServices] = useState<Array<SelectOption | GroupedSelectOption>>([]);
  const [selectedStaff, setSelectedStaff] = useState<SingleValue<SelectOption>>(null);
  const [selectedServices, setSelectedServices] = useState<SelectOption[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/staff');
        const staffOptions: SelectOption[] = response.data.map((staffMember: any) => ({
          value: staffMember.id,
          label: staffMember.first_name // Assuming first_name is correct and exists
        }));
        setStaff(staffOptions);
      } catch (error) {
        console.error('Error fetching staff:', error);
      }
    };

    const fetchServices = async () => {
        try {
          const response = await axios.get('http://127.0.0.1:8000/services');
          const groupedServices = response.data.reduce((acc: { [key: string]: SelectOption[] }, service: ServiceOption) => {
            const label = `${service.description}: ${service.name}`;
            const group = acc[service.description] || [];
            group.push({ value: service.id, label });
            acc[service.description] = group;
            return acc;
          }, {});
      
          const serviceOptions: GroupedSelectOption[] = Object.entries(groupedServices).map(([description, options]) => ({
            label: description,
            options: options.map((option: SelectOption) => ({ ...option, label: `${option.label} - ${description}` })),
          }));
      
          setServices(serviceOptions);
        } catch (error) {
          console.error('Error fetching services:', error);
        }
      };

    fetchStaff();
    fetchServices();
  }, []);

  const handleAddService = () => {
    // This logic might need to be updated to handle grouped services correctly
  };

  const handleServiceChange = (selectedOption: SingleValue<SelectOption>, index: number) => {
    const updatedServices = [...selectedServices];
    if (selectedOption) {
      updatedServices[index] = selectedOption;
      setSelectedServices(updatedServices);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedStaff || selectedServices.length === 0) {
      console.error('Staff or service not selected');
      return;
    }

    const appointmentData = {
      staff_id: selectedStaff.value,
      service_ids: selectedServices.map(service => service.value),
      date_time: `${selectedDate}T${selectedTime}:00`,
    };

    try {
      const response = await axios.post('http://127.0.0.1:8000/appointments', appointmentData);
      console.log('Appointment added successfully', response.data);
    } catch (error) {
      console.error('Error adding appointment:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex gap-3">
        <input
          type="date"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
        />
        <input
          type="time"
          value={selectedTime}
          onChange={e => setSelectedTime(e.target.value)}
        />
      </div>
      <div className="flex gap-3">
        <Select
          options={staff}
          onChange={(newValue: SingleValue<SelectOption>) => setSelectedStaff(newValue)}
          placeholder="Staff"
        />
        {selectedServices.map((service, index) => (
        <Select
            key={index}
            options={services.flatMap((group: GroupedSelectOption | SelectOption) => {
            if ('options' in group) {
                return group.options;
            }
            return [group]; // This case may not be necessary if all services are grouped, but it's here for completeness
            })}
            value={selectedServices.find(s => s.value === service.value)}
            onChange={(newValue: SingleValue<SelectOption>) => handleServiceChange(newValue, index)}
            placeholder="Service"
        />
        ))}
        <button type="button" onClick={handleAddService}>Add Service</button>
      </div>
      <button type="submit">Add Appointment</button>
    </form>
  );
};

export default AppointmentForm;