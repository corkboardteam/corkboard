// import React, { useState, useEffect } from 'react';
// import FullCalendar from '@fullcalendar/react';
// import dayGridPlugin from '@fullcalendar/daygrid';
// import interactionPlugin from '@fullcalendar/interaction';
// import { addEventToPrivateCalendar, getPrivateCalendarEvents, getPublicCalendarEvents } from '../../backend/custom_classes/calendar';

// function Calendar() {
//     const [events, setEvents] = useState([]);
  
//     useEffect(() => {
//       async function fetchData() {
//         const accessToken = 'your-access-token-here';
//         const privateCalendarEvents = await getPrivateCalendarEvents(accessToken);
//         const publicCalendarEvents = await getPublicCalendarEvents(new Event('public-calendar-id', 'event-id'), accessToken);
//         setEvents([...privateCalendarEvents.data.items, publicCalendarEvents.data]);
//       }
//       fetchData();
//     }, []);
  
//     async function handleDateSelect(info) {
//       const accessToken = 'your-access-token-here';
//       const eventData = {
//         summary: 'New Event',
//         start: {
//           dateTime: info.start.toISOString()
//         },
//         end: {
//           dateTime: info.end.toISOString()
//         },
//         colorId: '9' // Set the color to blue
//       };
//       await addEventToPrivateCalendar(eventData, accessToken);
//       const privateCalendarEvents = await getPrivateCalendarEvents(accessToken);
//       const publicCalendarEvents = await getPublicCalendarEvents(new Event('public-calendar-id', 'event-id'), accessToken);
//       setEvents([...privateCalendarEvents.data.items, publicCalendarEvents.data]);
//     }

//   return (
//     <div>
//       <FullCalendar 
//         plugins={[ dayGridPlugin, interactionPlugin ]}
//         selectable={true}
//         select={handleDateSelect}
//         events={events}
//       />
//     </div>
//   );
// }

// export default Calendar;

import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function Calendar() {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <div>
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        dateFormat="dd/MM/yyyy"
      />
      {selectedDate && (
        <p>You selected {selectedDate.toLocaleDateString()}</p>
      )}
    </div>
  );
}

export default Calendar;