import React, { useState ,useCallback,useRef} from 'react';
import { ToolbarProps, View } from 'react-big-calendar';
import moment from 'moment';
import { Button, } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import StaffDropdown from '@/components/staffdropdown';
// Assuming Button and Input are exported from the same location
import axios, { CancelTokenSource } from 'axios';
import debounce from 'lodash/debounce';
import { Input } from "@/components/ui/input";


interface CustomToolbarProps extends ToolbarProps {
  onView: (view: View) => void;
  setCurrentDate: (date: Date) => void;
  onApply: (selectedStaff: { id: number; name: string }[]) => void;
  staffMembers: { id: number; name: string }[]; // Added staffMembers to the props
}



const AppointmentPopup = ({ onClose }: { onClose: () => void }) => {
  // State and handlers for search term
  const [searchTerm, setSearchTerm] = useState('');
  // State and handlers for search results
  const [searchResults, setSearchResults] = useState<any[]>([]);
  // State and handlers for selected customer
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  // State and handlers for add customer dialog
  const [showAddCustomerDialog, setShowAddCustomerDialog] = useState(false);
  // State for search completed
  const [searchCompleted, setSearchCompleted] = useState(false);
  // State for customer exists
  const [customerExists, setCustomerExists] = useState(false);



  // Create an axios instance
  const axiosInstance = axios.create();
  let cancelTokenSource: CancelTokenSource | undefined;

  // Function to search for a customer
  const searchCustomer = useCallback(async () => {
    if (searchTerm.trim() !== '') {
      // Cancel the previous request
      if (cancelTokenSource) {
        cancelTokenSource.cancel();
      }

      // Create a new CancelToken
      cancelTokenSource = axios.CancelToken.source();

      try {
        const response = await axiosInstance.get(`http://127.0.0.1:8000/customers/?search=${searchTerm}`, {
          cancelToken: cancelTokenSource.token
        });
        setSearchCompleted(true); // Set search as completed
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
          setSearchResults([]); // Clear results on error
          setSearchCompleted(true); // Set search as completed
          setCustomerExists(false);
        }
      }
    } else {
      setSearchResults([]);
      setSearchCompleted(false); // Reset the search state
      setCustomerExists(false);
    }
  }, [searchTerm, axiosInstance]);

  // Debounce the search function
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
    setSearchTerm(customer.mobile.startsWith('0') ? customer.mobile.substring(1) : customer.mobile); // Adjust phone number format
    setSearchResults([]); // Clear the dropdown
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
      return (
        <div className="mt-2">
          <Button onClick={() => setShowAddCustomerDialog(true)}>
            Add Customer
          </Button>
        </div>
      );
    }
    return null; // Return null if none of the conditions are met
  };

  return (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          width: '600px', // Increased width from 500px to 600px
          height: 'auto', // You can specify a height or leave it as 'auto' to adjust based on content
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          padding: '20px',
          zIndex: 100,
          borderRadius: '10px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}>
      <h2>Add Appointment</h2>
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
          className="pr-20" // Add padding to the right of the input to make room for the button
        />
        <Button onClick={searchCustomer} className="absolute right-2 top-1/2 transform -translate-y-1/2 px-2 py-1 h-8">Search</Button>
        <div className="absolute w-full mt-1">
          {renderSearchResults()}
        </div>
      </div>
      {/* Close button */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Button onClick={onClose}>Close</Button>
      </div>
    </div>
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
    .filter(staff => staff !== undefined); // Ensure all selected staff members are found

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
