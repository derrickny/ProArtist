import React from 'react';
import { NavigateAction, ToolbarProps, View } from 'react-big-calendar';
import moment from 'moment';
import { Button } from "@/components/ui/button";

interface CustomToolbarProps extends ToolbarProps {
  viewDate: Date; // This will be the date currently viewed
  onView: (view: View) => void; // This will be used to change the view
}

const Toolbar: React.FC<CustomToolbarProps> = ({ onNavigate, viewDate, onView }) => {
  const navigateToDay = (day: Date) => {
    onView('day');
    onNavigate('DATE', day);
  };

  const datesToShow = Array.from({ length: 6 }, (_, i) => moment(viewDate).add(i, 'days'));

  return (
    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
      <div>
        {datesToShow.map((dateMoment, index) => (
          <Button
            key={index}
            onClick={() => navigateToDay(dateMoment.toDate())}
            style={{ margin: 5, padding: '5px 8px', fontSize: '14px' }}
          >
            <div style={{ marginBottom: '20px'}}>{dateMoment.format('D')}</div> {/* Add marginBottom here */}
            <div style={{ marginTop: '10px' }}> {/* Add marginTop here */}
              {moment().isSame(dateMoment, 'day') ? 'Today' : dateMoment.format('ddd')}
            </div>
          </Button>
        ))}
      </div>
      <div>
      <Button onClick={() => onView('week')} style={{ padding: '5px 8px', fontSize: '14px', marginRight: '10px' }}>Week</Button> {/* Add marginRight here */}
        <Button onClick={() => onView('day')} style={{ padding: '5px 8px', fontSize: '14px' }}>Day</Button>
      </div>
    </div>
  );
};

export default Toolbar;