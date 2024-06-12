// components/CustomHeader.tsx

import React from 'react';
import { ResourceHeaderProps } from 'react-big-calendar';

const CustomHeader: React.FC<ResourceHeaderProps<any>> = ({ label }) => {
  return (
    <div style={{ 
        width: '100%', 
        height: '100%', 
        textAlign: 'center', 
        fontWeight: 'bold',
        paddingTop: '10px', // Increase the padding at the top
        fontSize: '20px' // Increase the font size
    }}>
      {label}
    </div>
  );
};

export default CustomHeader;