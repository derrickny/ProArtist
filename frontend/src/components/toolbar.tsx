import React, { useState, useCallback, useRef,useEffect } from 'react';
import { ToolbarProps, View } from 'react-big-calendar';
import moment from 'moment';
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import StaffDropdown from '@/components/staffdropdown';
import axios, { CancelTokenSource } from 'axios';
import debounce from 'lodash/debounce';
import { Input } from "@/components/ui/input";
import AddCustomer from '@/components/AddCustomer';
import AppointmentForm from '@/components/AppointmentForm';
import {CircleX} from "lucide-react";


interface CustomToolbarProps extends ToolbarProps {
  onView: (view: View) => void;
  setCurrentDate: (date: Date) => void;
  onApply: (selectedStaff: { id: number; name: string }[]) => void;
  staffMembers: { id: number; name: string }[];
}

const AppointmentPopup = ({ onClose }: { onClose: () => void }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [showAddCustomerDialog, setShowAddCustomerDialog] = useState(false);
  const [searchCompleted, setSearchCompleted] = useState(false);
  const [customerExists, setCustomerExists] = useState(false);
  const [showAddCustomerDrawer, setShowAddCustomerDrawer] = useState(false);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  const axiosInstance = axios.create();
  let cancelTokenSource: CancelTokenSource | undefined;

  const handleAddCustomer = async (customer: any) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/customers/', customer);
      console.log('Customer added successfully', response.data);
      setShowAddCustomerDrawer(false);
    } catch (error) {
      console.error('Error adding customer:', error);
    }
  };

  const searchCustomer = useCallback(async () => {
    if (searchTerm.trim() !== '') {
      if (cancelTokenSource) {
        cancelTokenSource.cancel();
      }

      cancelTokenSource = axios.CancelToken.source();

      try {
        const response = await axiosInstance.get(`http://127.0.0.1:8000/customers/?search=${searchTerm}`, {
          cancelToken: cancelTokenSource.token
        });
        setSearchCompleted(true);
        if (response.data.length > 0) {
          setSearchResults(response.data);
          setCustomerExists(true);
        } else {
          setSearchResults([]);
          setCustomerExists(false);
        }
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled', error.message);
        } else {
          console.error('Error searching for customer:', error);
          setSearchResults([]);
          setSearchCompleted(true);
          setCustomerExists(false);
        }
      }
    } else {
      setSearchResults([]);
      setSearchCompleted(false);
      setCustomerExists(false);
    }
  }, [searchTerm, axiosInstance]);

  const debouncedSearch = useCallback(() => {
    const debounced = debounce(searchCustomer, 500);
    debounced();
  }, [searchCustomer]);

  const handleSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchTerm(value);
    debouncedSearch();
  };

  const handleResultClick = (customer: any) => {
    setSelectedCustomer(customer);
    setSearchTerm(customer.mobile.startsWith('0') ? customer.mobile.substring(1) : customer.mobile);
    setSearchResults([]);
  };

  const renderSearchResults = () => {
    if (searchResults.length > 0) {
      return (
        <ul className="absolute bg-white border border-gray-300 w-30 mt-1 rounded-md z-10">
          {searchResults.map(customer => (
            <li key={customer.id} className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleResultClick(customer)}>
              {customer.mobile} - {customer.first_name} {customer.last_name}
            </li>
          ))}
        </ul>
      );
    } else if (searchTerm !== '' && searchCompleted && searchResults.length === 0 && !customerExists) {
          {return (
            <>
              <Button className="mt-3"onClick={() => setShowAddCustomerDrawer(true)}>Add Customer</Button>
              {showAddCustomerDrawer && (
                <AddCustomer
                  showAddCustomerDrawer={showAddCustomerDrawer}
                  setShowAddCustomerDrawer={setShowAddCustomerDrawer}
                  onAdd={handleAddCustomer} // Ensure handleAddCustomer matches the expected signature
        
                />
              )}
            </>
          );}
    }
    return null;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose(); // Close the popup
      }
    };

    // Attach the event listener
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);


  const toggleAppointmentForm = () => {
    setShowAppointmentForm(!showAppointmentForm);
  };

return (
<>
<div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999, // Ensure this is below the modal's z-index to keep the modal on top
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }}>
    <div style={{
      position: 'fixed', // Ensure it's fixed relative to the viewport
      top: '50%',
      left: '50%',
      width: '600px',
      maxHeight: '500px',
      transform: 'translate(-50%, -50%)', // Correctly center the modal
      backgroundColor: 'white',
      padding: '20px',
      zIndex: 1000,
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      overflowY: 'auto',
    }}>
<div style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer' }} onClick={onClose}>
  <CircleX /> {/* Using CircleXIcon from Lucid React */}
</div>
      <h2 className='mb-3 font-bold text-lg'>Add Appointment</h2>
      <div className="relative w-80">
        <Input
          id="searchTerm"
          value={searchTerm}
          onChange={handleSearchTermChange}
          onKeyPress={(event) => {
            if (event.key === 'Enter') {
              searchCustomer();
            }
          }}
          placeholder="Search by phone number/name/id"
          className="pr-20"
        />
        <Button onClick={searchCustomer} className="absolute right-2 top-1/2 transform -translate-y-1/2 px-2 py-1 h-8">Search</Button>
        <div className="absolute w-full mt-1">
          {renderSearchResults()}
        </div>
      </div>
      <AppointmentForm />
    </div>
  </div>
</>
);
};

const Toolbar: React.FC<CustomToolbarProps> = ({ onView, setCurrentDate, onApply, staffMembers }) => {
  const navigateToDay = (day: Date) => {
    onView('day');
    setCurrentDate(day);
  };

  const datesToShow = Array.from({ length: 6 }, (_, i) => moment().add(i, 'days'));

  const [isHovered, setIsHovered] = useState(false);
  const [selectedStaffIds, setSelectedStaffIds] = useState<number[]>([]);

  const handleStaffSelection = (selectedStaffIds: number[]) => {
    setSelectedStaffIds(selectedStaffIds);
  };

  const handleApply = () => {
    const selectedStaff = selectedStaffIds
      .map(id => staffMembers.find(staff => staff.id === id))
      .filter(staff => staff !== undefined);

    onApply(selectedStaff as { id: number; name: string }[]);
  };

const [showPopup, setShowPopup] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: '10px', overflow: "visible" }}>
      <div style={{ display: 'flex', marginRight: 'auto' }}>
        <div style={{ position: 'relative', display: 'inline-block', marginRight: '10px' }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
              <Button onClick={() => setShowPopup(true)}>
              <CirclePlus />
            </Button>
            {/* Conditionally render the AppointmentPopup */}
            {showPopup && <AppointmentPopup onClose={() => setShowPopup(false)} />}
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
            selectedStaffIds={selectedStaffIds}
            onSelectionChange={handleStaffSelection}
            onApply={handleApply} // Pass the apply function
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
