import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from "lucide-react";

interface StaffMember {
  id: number;
  first_name: string;
}

interface StaffDropdownProps {
  selectedStaffIds: number[];
  onSelectionChange: (selectedStaffIds: number[]) => void;
  onApply: (selectedStaff: { id: number; name: string }[]) => void; // New prop
}

const StaffDropdown: React.FC<StaffDropdownProps> = ({ selectedStaffIds, onSelectionChange, onApply }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  // Initialize selectedIds with selectedStaffIds or an empty array if it's not provided
  const [selectedIds, setSelectedIds] = useState<number[]>(selectedStaffIds);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/staff')
      .then(response => response.json())
      .then((staffData: StaffMember[]) => { // Explicitly type staffData as an array of StaffMember
        const options = staffData.map((staff: StaffMember) => ({ id: staff.id, first_name: staff.first_name }));
        setStaffMembers(options);
        setSelectedIds(options.map(staff => staff.id));
        setLoading(false);
      })
      .catch(error => {
        console.error('Failed to fetch staff:', error);
        setError('Failed to load staff.');
        setLoading(false);
      });
  }, []);

  const toggleDropdown = useCallback(() => {
    setDropdownVisible(prev => !prev);
  }, []);

  const handleCheckboxChange = useCallback((staffId: number) => {
    const updatedSelectedIds = selectedIds.includes(staffId)
      ? selectedIds.filter(id => id !== staffId)
      : [...selectedIds, staffId];

    setSelectedIds(updatedSelectedIds); // Update local state
  }, [selectedIds]);

  const handleApplyClick = () => {
    const selectedStaff = staffMembers.filter(staff => selectedIds.includes(staff.id))
                                      .map(staff => ({ id: staff.id, name: staff.first_name }));
    onApply(selectedStaff); // Call the new prop callback
    onSelectionChange(selectedIds); // Keep existing functionality
  };

  const getSelectedStaffNames = () => {
    if (selectedIds.length === staffMembers.length) {
      return "All staff";
    } else {
      return staffMembers
        .filter(staff => selectedIds.includes(staff.id))
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
          value={selectedIds.length > 0 ? getSelectedStaffNames() : "Select staff"}
          readOnly
          style={{
            cursor: 'pointer',
            flexGrow: 1,
            border: 'none',
            outline: 'none',
            width: '120px'
          }}
        />
        {dropdownVisible ? <ChevronUp /> : <ChevronDown />}
      </div>
      {dropdownVisible && (
        <div style={{ position: 'absolute', width: '100%', border: '1px solid #ccc', padding: '10px', backgroundColor: 'white', zIndex: 1000, borderRadius: '15px' }}>
          {staffMembers.length > 0 ? (
            staffMembers.map((staff: StaffMember) => (
              <div key={staff.id} style={{ marginBottom: '8px' }}>
                <input
                  type="checkbox"
                  id={`staff-${staff.id}`}
                  checked={selectedIds.includes(staff.id)}
                  onChange={() => handleCheckboxChange(staff.id)}
                />
                <label htmlFor={`staff-${staff.id}`} style={{ marginLeft: '8px' }}>{staff.first_name}</label>
              </div>
            ))
          ) : (
            <p>No staff members available.</p>
          )}
          <Button style={{ borderRadius: '15px' }} onClick={handleApplyClick}>Apply</Button>
        </div>
      )}
    </div>
  );
};

export default StaffDropdown;
