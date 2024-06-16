import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from "lucide-react";

interface StaffMember {
  id: number;
  first_name: string;
}

interface StaffDropdownProps {
  staffMembers: StaffMember[];
  onSelectionChange: (selectedStaffIds: number[]) => void;
}

const StaffDropdown: React.FC<StaffDropdownProps> = ({ onSelectionChange }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<number[]>([]);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/staff')
      .then(response => response.json())
      .then(staffData => {
        const options = staffData.map((staff: any) => ({ id: staff.id, first_name: staff.first_name }));
        setStaffMembers(options);
        setSelectedStaff(options.map((staff: StaffMember) => staff.id)); // Set all staff as selected by default
        if (typeof onSelectionChange === 'function') {
          onSelectionChange(options.map((staff: StaffMember) => staff.id)); // Notify parent component
        }
      })
      .catch(error => {
        console.error('Failed to fetch staff:', error);
        setError('Failed to load staff.');
        setLoading(false);
      });
  }, [onSelectionChange]);

  const toggleDropdown = useCallback(() => {
    setDropdownVisible(prev => !prev);
  }, []);

  const handleCheckboxChange = useCallback((staffId: number) => {
    const updatedSelectedStaff = selectedStaff.includes(staffId)
      ? selectedStaff.filter(id => id !== staffId)
      : [...selectedStaff, staffId];

    setSelectedStaff(updatedSelectedStaff);
    onSelectionChange(updatedSelectedStaff);
  }, [selectedStaff, onSelectionChange]);

  const applyChanges = useCallback(() => {
    console.log('Selected Staff:', selectedStaff);
    setDropdownVisible(false);
  }, [selectedStaff]);

const getSelectedStaffNames = () => {
  // Check if the number of selected staff is equal to the total number of staff members
  if (selectedStaff.length === staffMembers.length) {
    return "All staff"; // Return "All staff" when all members are selected
  } else {
    // Return the names of the selected staff members
    return staffMembers
      .filter(staff => selectedStaff.includes(staff.id))
      .map(staff => staff.first_name)
      .join(', ');
  }
};

  if (error) return <div>{error}</div>;

  return (
<div style={{ position: 'relative', display: 'inline-block' }}>
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      border: '1px solid #ccc',
      padding: '8px',
      cursor: 'pointer',
      borderRadius: '15px',
      height: '40px',
    }}
    onClick={toggleDropdown}
  >
    <input
      type="text"
      value={selectedStaff.length > 0 ? getSelectedStaffNames() : "Select staff"}
      readOnly
      style={{
        cursor: 'pointer',
        flexGrow: 1,
        border: 'none', // Remove input border
        outline: 'none', // Remove focus outline
        width: '120px' // Ensure input width fills the container
      }}
    />
    {dropdownVisible ? <ChevronUp /> : <ChevronDown />}
  </div>
  {dropdownVisible && (
    <div style={{ position: 'absolute', width: '100%', border: '1px solid #ccc', padding: '10px', backgroundColor: 'white', zIndex: 1000, borderRadius: '15px' }}>
        {staffMembers && staffMembers.length > 0 ? (
        staffMembers.map((staff: StaffMember) => (
          <div key={staff.id} style={{ marginBottom: '8px' }}> {/* Add some space between each staff member */}
            <input
              type="checkbox"
              id={`staff-${staff.id}`}
              checked={selectedStaff.includes(staff.id)}
              onChange={() => handleCheckboxChange(staff.id)}
            />
            <label htmlFor={`staff-${staff.id}`} style={{ marginLeft: '8px' }}>{staff.first_name}</label>
          </div>
        ))
        ) : (
        <p>No staff members available.</p>
        )}
      <Button style={{ borderRadius: '15px' }} onClick={applyChanges}>Apply</Button>
    </div>
  )}
</div>
  );
};

export default StaffDropdown;