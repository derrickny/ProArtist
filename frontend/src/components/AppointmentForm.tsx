import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select, { SingleValue } from 'react-select';
import { Button } from "@/components/ui/button";

interface ServiceOption {
  id: string;
  description: string;
  name: string;
  duration: string; // 
  price: string; // 
}

interface SelectOption {
  value: string;
  label: string;
}

interface GroupedSelectOption {
  label: string;
  options: SelectOption[];
}

interface ServiceStaffSelection {
  service: SelectOption | null;
  staff: SelectOption | null;
}

const AppointmentForm = () => {
  const [staff, setStaff] = useState<SelectOption[]>([]);
  const [services, setServices] = useState<Array<GroupedSelectOption>>([]);
  const [selectedStaff, setSelectedStaff] = useState<SingleValue<SelectOption>>(null);
  const [selectedServiceStaff, setSelectedServiceStaff] = useState<ServiceStaffSelection[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/staff');
        const staffOptions: SelectOption[] = response.data.map((staffMember: any) => ({
          value: staffMember.id,
          label: staffMember.first_name
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
                // Corrected label format to "Gentlemen's Cut (45) - ksh 500"
                const label = `${service.name} (${service.duration} mins) - ksh ${service.price}`;
                const group = acc[service.description] || [];
                group.push({ value: service.id, label });
                acc[service.description] = group;
                return acc;
              }, {});

              const serviceOptions: GroupedSelectOption[] = Object.entries(groupedServices).map(([description, options]) => ({
                label: description,
                options: options,
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
    setSelectedServiceStaff([...selectedServiceStaff, { service: null, staff: null }]);
  };

  const handleServiceChange = (selectedOption: SingleValue<SelectOption>, index: number, type: 'service' | 'staff') => {
    const updatedServiceStaff = [...selectedServiceStaff];
    if (selectedOption) {
      if (type === 'service') {
        updatedServiceStaff[index].service = selectedOption;
      } else {
        updatedServiceStaff[index].staff = selectedOption;
      }
      setSelectedServiceStaff(updatedServiceStaff);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedStaff || selectedServiceStaff.length === 0) {
      console.error('Staff or service not selected');
      return;
    }

    const appointmentData = {
      staff_id: selectedStaff?.value,
      service_ids: selectedServiceStaff.map(serviceStaff => serviceStaff.service?.value).filter(value => value !== undefined),
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
    <form onSubmit={handleSubmit} className="flex flex-col item-left justify-left space-y-4">
        <div>
          <h2 className="text-m font-semibold mb-2 mt-14">Select Date and Time</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="p-2 border border-gray-300 rounded mt-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Time</label>
            <input
              type="time"
              value={selectedTime}
              onChange={e => setSelectedTime(e.target.value)}
              className="p-2 border border-gray-300 rounded mt-2"
            />
          </div>
        </div>
          <div className="flex flex-col gap-3 justify-left items-left">{/* Added this wrapper div with overflow-auto and a max height */}
            {selectedServiceStaff.map((serviceStaff, index) => (
              <div key={index} className="flex gap-3 justify-center items-center">
                <Select
                options={services}
                value={serviceStaff.service}
                onChange={(newValue: SingleValue<SelectOption>) => handleServiceChange(newValue, index, 'service')}
                placeholder="Service"
                className="mt-2 mb-2" // You can still use className for other styling purposes
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      width: '380px',
                    }),
                    menu: (provided) => ({
                      ...provided,
                      zIndex: 9999, // Ensure this is higher than the zIndex of other elements
                    }),
                  }}
                formatGroupLabel={(data) => (
                  <div className="text-center font-semibold">
                    {data.label}
                  </div>
                )}
              />
              <Select
                options={staff}
                value={serviceStaff.staff}
                onChange={(newValue: SingleValue<SelectOption>) => handleServiceChange(newValue, index, 'staff')}
                placeholder="Staff"
                className="w-full mt-2 mb-2"
                styles={{
                  menu: (provided) => ({
                    ...provided,
                    zIndex: 9999, // Ensure this is higher than the zIndex of other elements
                  }),
                }}
              />
              </div>
            ))}
          <Button type="button" onClick={handleAddService} className="mt-2 mb-2">Add Service</Button>
        </div>
      <Button type="submit" className="mt-2 mb-2">Book Appointment</Button>
    </form>
  );
};

export default AppointmentForm;