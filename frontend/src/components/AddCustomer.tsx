import React, { useState } from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import '@/components/styles.css';

interface AddCustomerProps {
  showAddCustomerDrawer: boolean;
  setShowAddCustomerDrawer: (show: boolean) => void;
  onAdd: (customer: {
    first_name: string;
    last_name: string;
    email: string;
    mobile: string;
    location: string;
  }) => void;
}

const AddCustomer: React.FC<AddCustomerProps> = ({ showAddCustomerDrawer, setShowAddCustomerDrawer, onAdd }) => {
  const [newCustomer, setNewCustomer] = useState({
    first_name: '',
    last_name: '',
    email: '',
    mobile: '',
    location: '',
  });

  const addCustomer = () => {
    onAdd(newCustomer);
    setNewCustomer({
      first_name: '',
      last_name: '',
      email: '',
      mobile: '',
      location: '',
    }); // Reset form after adding
    setShowAddCustomerDrawer(false);
  };

  return (
    <div>
      <SwipeableDrawer
        anchor="right"
        open={showAddCustomerDrawer}
        onClose={() => setShowAddCustomerDrawer(false)}
        onOpen={() => setShowAddCustomerDrawer(true)}
      >
        <Box sx={{ width: 300 }} role="presentation">
          <div className="p-4 mt-20">
          <div className="mb-4">
            <h2 className='font-bold text-xl'>Add New Customer</h2>
            </div>
            <div className="mb-4">
              <label htmlFor="first_name">First Name</label>
              <Input
                type="text"
                id="first_name"
                name="first_name"
                value={newCustomer.first_name}
                onChange={(e) => setNewCustomer({ ...newCustomer, first_name: e.target.value })}
                placeholder="First Name"
                className="mt-1 block w-full"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="last_name">Last Name</label>
              <Input
                type="text"
                id="last_name"
                name="last_name"
                value={newCustomer.last_name}
                onChange={(e) => setNewCustomer({ ...newCustomer, last_name: e.target.value })}
                placeholder="Last Name"
                className="mt-1 block w-full"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email">Email</label>
              <Input
                type="email"
                id="email"
                name="email"
                value={newCustomer.email}
                onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                placeholder="Email"
                className="mt-1 block w-full"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="mobile">Mobile</label>
              <Input
                type="tel"
                id="mobile"
                name="mobile"
                value={newCustomer.mobile}
                onChange={(e) => setNewCustomer({ ...newCustomer, mobile: e.target.value })}
                placeholder="Mobile"
                className="mt-1 block w-full"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="location">Location</label>
              <select
                id="location"
                name="location"
                value={newCustomer.location}
                onChange={(e) => setNewCustomer({ ...newCustomer, location: e.target.value })}
                className="mt-1 block w-full"
              >
                <option value="Mancave Nsk">Mancave Nsk</option>
                <option value="Mancave Kitengela">Mancave Kitengela</option>
              </select>
            </div>
            <div className="mb-4">
            <Button variant="default" className="ml-4" onClick={addCustomer}>Save</Button>
            <Button variant="secondary" className="border border-gray-300 ml-4" onClick={() => setShowAddCustomerDrawer(false)}>Cancel</Button>
            </div>
          </div>
        </Box>
      </SwipeableDrawer>
    </div>
  );
};

export default AddCustomer;