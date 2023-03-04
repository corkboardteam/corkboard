import axios from 'axios';

class Event {
  constructor(calendarId, eventId) {
    this.calendarId = calendarId;
    this.eventId = eventId;
  }
}

export function addEventToPrivateCalendar(eventData, accessToken) {
  return axios.post('https://www.googleapis.com/calendar/v3/calendars/primary/events', eventData, {
    headers: {
      'Authorization': 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  });
}

export function getPrivateCalendarEvents(accessToken) {
  return axios.get('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
    headers: {
      'Authorization': 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    },
    params: {
      timeMin: new Date().toISOString()
    }
  });
}

export function getPublicCalendarEvents(event, accessToken) {
  const { calendarId, eventId } = event;
  return axios.get(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`, {
    headers: {
      'Authorization': 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  });
}
