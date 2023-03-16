import { doc, setDoc, getDocs, collection, query, where, arrayUnion, updateDoc } from 'firebase/firestore';
import { db } from '../firebase'


class Calendar {
    constructor(groupName, users, groceries, trips) {
        this.groupName = groupName; //should be a string containing username
        this.users = users; //should be an array of userIDs
        this.groceries = groceries; //should be an array of grocery IDs mapping to current quantity and max limit
        this.trips = trips

    }
}

const CalendarConverter = {
    toFirestore: (Calendar) => {
        return {
            groupName: Calendar.groupName,
            users: Calendar.users,
            groceries: Calendar.groceries,
            trips: Calendar.trips
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new Calendar(data.groupName, data.users, data.groceries, data.trips)
    }
};

async function addNewCalendar(groupName, user) {
    //when initializing Calendar, we should add the creater of the Calendar group to the user array
    //there shouldn't be any groceries yet
    const newCalendar = new Calendar(groupName, [user], [], []);

    //tbd: do we want to have firebase autogenerate userIDs or let users define their own
    //or do we want to use the groupName as a Calendar's id value
    const ref = doc(collection(db, "Calendars")).withConverter(CalendarConverter);
    await setDoc(ref, newCalendar);
    return ref.id
}

async function getCalendar(groupName) {
    const CalendarRef = collection(db, "Calendars");

    if (groupName == null) {
        alert("not in a group yet :(")
        return null

    }
    const q = query(CalendarRef, where("groupName", "==", groupName))

    const querySnapshot = await getDocs(q.withConverter(CalendarConverter));

    if (querySnapshot.length === 0) {
        alert("Hi! you're not in a group yet/ your group doesnt have a Calendar")
        return null;
    }

    let Calendar = []

    querySnapshot.forEach((doc) => {
        Calendar.push({ data: doc.data(), id: doc.id })
    })

    return Calendar[0];

}


async function addTripToCalendar(items, groupID, userID, date = "default date") {
    const Calendar = await getCalendar(groupID)


    const newTripRef = doc(collection(db, "trips"))
    const newTrip = {
        userID: userID,
        date: date,
        toBuy: items,
        tripID: newTripRef.id
    }
    console.log(newTrip)
    await updateDoc(doc(db, "Calendars", Calendar.id), {
        trips: arrayUnion(newTrip)
    })

    return newTrip

}

async function removeTripFromCalendar(tripID, groupID, uid) {
    console.log(tripID)
    const Calendar = await getCalendar(groupID)
    const trips = Calendar.data.trips
    const deletedTrip = trips.filter((t) => t.tripID === tripID && t.userID === uid)

    const newTrips = trips.filter((t) => t.tripID !== tripID)
    console.log(newTrips)
    await updateDoc(doc(db, "Calendars", Calendar.id), {
        trips: newTrips
    })
    return true;
}




export {
    Calendar,
    CalendarConverter,
    addNewCalendar,
    getCalendar,
    addTripToCalendar,
    removeTripFromCalendar
}