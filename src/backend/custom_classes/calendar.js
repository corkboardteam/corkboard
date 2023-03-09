import axios from 'axios';

class Calendar {
    constructor(calendarId) {
        this.calendarId = calendarId;
    }
}

class Event {
    constructor(eventId) {
        this.eventId = eventId;
    }
}

export function addEventToPrivateCalendar(eventData, accessToken) {
    return axios.post(`https://calendar.zoho.com/api/v1/calendars/8b6b8aa9114b4de8a22f1136e648ee70?calendarData={"name":"New Calendar","color":"#101010","textcolor":"#FFFFFF","include_infreebusy":"true","timezone":"Asia/calcutta","description":"New Calendar","private":"enable","visibility":"true","public":"freebusy","reminders":[{"action":"email","minutes":15}]}`, {
        headers: {
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json'
        }
    });
}

export function getPrivateCalendarEvents(accessToken) {
    return axios.get('http://calendar.zoho.com/api/v1/calendars', {
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
    return axios.get(`https://www.googleapis.com/calendar/v3/calendars/${Calendar.calendarId}/events/${Event.eventId}`, {
        headers: {
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json'
        }
    });
}
