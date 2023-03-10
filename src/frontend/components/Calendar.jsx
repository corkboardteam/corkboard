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

// import React, { useState } from 'react';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';

// function Calendar() {
//   const [selectedDate, setSelectedDate] = useState(null);

//   const handleDateChange = (date) => {
//     setSelectedDate(date);
//   };

//   return (
//     <div>
//       <DatePicker
//         selected={selectedDate}
//         onChange={handleDateChange}
//         dateFormat="MM/dd/yyyy"
//       />
//       {selectedDate && (
//         <p>You selected {selectedDate.toLocaleDateString()}</p>
//       )}
//     </div>
//   );
// }


//import { useState } from 'react';
// import '../styles/Calendar.css'; // Import the CSS file

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';


// function Calendar() {
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [calendarEvents, setCalendarEvents] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       const authResponse = await axios.post('https://accounts.zoho.com/oauth/v2/token', {
//         grant_type: 'refresh_token',
//         client_id: 'YOUR_CLIENT_ID',
//         client_secret: 'YOUR_CLIENT_SECRET',
//         refresh_token: 'YOUR_REFRESH_TOKEN'
//       });

//       const authToken = authResponse.data.access_token;

//       const calendarResponse = await axios.get('https://calendar.zoho.com/api/v1/calendars/YOUR_CALENDAR_ID/events', {
//         headers: {
//           Authorization: `Zoho-oauthtoken ${authToken}`
//         }
//       });

//       const events = calendarResponse.data.data.map(event => {
//         const startDate = new Date(event.start_time);
//         const endDate = new Date(event.end_time);

//         return {
//           title: event.title,
//           start: startDate,
//           end: endDate,
//           color: event.color
//         };
//       });

//       setCalendarEvents(events);
//     };

//     fetchData();
//   }, []);

//   const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

//   const getDaysInMonth = (year, month) => {
//     return new Date(year, month + 1, 0).getDate();
//   };

//   const getFirstDayOfMonth = (year, month) => {
//     return new Date(year, month, 1).getDay();
//   };

//   const getEvents = async () => {
//     const month = selectedDate.getMonth() + 1;
//     const year = selectedDate.getFullYear();
//     const url = `https://calendar.zoho.com/api/v1/events?calendar_id=${CALENDAR_ID}&year=${year}&month=${month}`;
//     const headers = { Authorization: `Zoho-oauthtoken ${ACCESS_TOKEN}` };
  
//     try {
//       const response = await axios.get(url, { headers });
//       return response.data.data;
//     } catch (error) {
//       console.error(error);
//       return [];
//     }
//   };

//   async function renderCalendar() { 
//     const month = selectedDate.getMonth();
//     const year = selectedDate.getFullYear();
  
//     const firstDayOfMonth = new Date(year, month, 1);
//     const lastDayOfMonth = new Date(year, month + 1, 0);
//     const daysInMonth = lastDayOfMonth.getDate();
  
//     const startDay = firstDayOfMonth.getDay();
//     const endDay = lastDayOfMonth.getDay();
  
//     const calendarCells = [];
//     for (let i = 1; i <= daysInMonth; i++) {
//       const classNames = ["cell"];
//       if (i === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear()) {
//         classNames.push("selected");
//       }
//       if (i === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()) {
//         classNames.push("today");
//       }
  
//       const eventsForDay = await getEvents();
//         const eventsForDayFiltered = eventsForDay.filter(event => {
//         const eventStart = new Date(event.start);
//         return eventStart.getDate() === i && eventStart.getMonth() === month - 1 && eventStart.getFullYear() === year;
//         });
  
//       calendarCells.push(
//         <td className={classNames.join(" ")} key={`day-${i}`} onClick={() => setSelectedDate(new Date(year, month, i))}>
//           <div className="day">{i}</div>
//           {eventsForDay.map(event => (
//             <div className="event" key={event.id} style={{ backgroundColor: event.color }}>
//               {event.title}
//             </div>
//           ))}
//         </td>
//       );
//     }
  
//     const rows = [];
//     let cells = [];
  
//     calendarCells.forEach((day, index) => {
//       if (index % 7 !== 0) {
//         cells.push(day);
//       } else {
//         rows.push(cells);
//         cells = [];
//         cells.push(day);
//       }
//       if (index === calendarCells.length - 1) {
//         rows.push(cells);
//       }
//     });
  
//     const tableRows = rows.map((row, index) => <tr key={`row-${index}`}>{row}</tr>);
  
//     return (
//       <table className="calendar">
//         <thead>
//           <tr>
//             <th>Sun</th>
//             <th>Mon</th>
//             <th>Tue</th>
//             <th>Wed</th>
//             <th>Thu</th>
//             <th>Fri</th>
//             <th>Sat</th>
//           </tr>
//         </thead>
//         <tbody>{tableRows}</tbody>
//       </table>
//     );
//   };
  

//   return (
//     <div className="public-calendar">
//       {renderCalendar()}
//     </div>
//   );
// };

// export default Calendar;


// //export default Calendar;

import React, { useState } from "react";
import moment from "moment";
import '../styles/Calendar.css';

const groupColors = ["#FFA07A", "#87CEFA", "#98FB98", "#FFD700"];

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const handleEventClick = (event) => {
    // Do something when an event is clicked
  };

  const handleDayClick = (day) => {
    const newEvent = {
      day,
      group: selectedGroup,
      title: prompt("Enter event title"),
    };
    setEvents([...events, newEvent]);
  };

  return (
    <div className="calendar">
      <div className="groups">
        <div
          className={`group ${selectedGroup === null ? "selected" : ""}`}
          onClick={() => setSelectedGroup(null)}
        >
          All
        </div>
        {groupColors.map((color, i) => (
          <div
            key={i}
            className={`group ${selectedGroup === i ? "selected" : ""}`}
            style={{ backgroundColor: color }}
            onClick={() => setSelectedGroup(i)}
          >
            Group {i + 1}
          </div>
        ))}
      </div>
      <div className="days">
        {moment.weekdaysShort().map((day) => (
          <div key={day} className="day-label">
            {day}
          </div>
        ))}
        {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
          const eventsForDay = events.filter((event) => event.day === day);
          const groupsForDay = [...new Set(eventsForDay.map((e) => e.group))];
          return (
            <div
              key={day}
              className={`day ${selectedGroup !== null && !groupsForDay.includes(selectedGroup) ? "hidden" : ""}`}
              onClick={() => handleDayClick(day)}
            >
              <div className="day-number">{day}</div>
              {eventsForDay.map((event, i) => (
                <div
                  key={i}
                  className="event"
                  style={{ backgroundColor: groupColors[event.group] }}
                  onClick={() => handleEventClick(event)}
                >
                  {event.title}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
