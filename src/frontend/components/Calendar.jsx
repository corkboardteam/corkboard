import '../styles/Calendar.css';
import React, { useState, useEffect } from "react";
import User from "../../backend/custom_classes/user";
import { UserAuth } from "../../backend/authContext";
import { getCalendar, addGroceryToCalendar, addTripToCalendar, removeTripFromCalendar } from "../../backend/custom_classes/calendar";


const Calendar = () => {
    const [currDate, setCurrDate] = useState(new Date());
    const [currYear, setCurrYear] = useState(currDate.getFullYear());
    const [currMonth, setCurrMonth] = useState(currDate.getMonth());
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    const [trips, setTrips] = useState([]);
    const { currentUser } = UserAuth();

    useEffect(() => {
        getHighlightedDates().then((highlightedDates) => {
            renderCalendar(highlightedDates);
        });
        // const highlightedDates = [];
        // highlightedDates.push(getHighlightedDates());
        // renderCalendar(highlightedDates);
    }, [currYear, currMonth, currDate]);


    const renderCalendar = (highlightedDates) => {
        const daysTag = document.querySelector(".days");
        const currentDate = document.querySelector(".current-date");
        let firstDayofMonth = new Date(currYear, currMonth, 1).getDay();
        let lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate();
        let lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay();
        let lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate();
        let liTag = "";

        for (let i = firstDayofMonth; i > 0; i--) {
        liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
        }

        for (let i = 1; i <= lastDateofMonth; i++) {
        let isToday =
            i === currDate.getDate() &&
            currMonth === new Date().getMonth() &&
            currYear === new Date().getFullYear()
            ? "active"
            : "";
        //const currentDateStr = `${currYear}-${currMonth + 1}-${i}`;
        let isHighlighted = "";
        highlightedDates.forEach((dateString) => {
            const dateParts = dateString.split("/");
            const year = parseInt(dateParts[2], 10);
            const month = parseInt(dateParts[0], 10) - 1; // January is 0
            const day = parseInt(dateParts[1], 10);
            const date = new Date(year, month, day);
            if (
                date.getFullYear() === currYear &&
                date.getMonth() === currMonth &&
                date.getDate() === i
            ) {
                isHighlighted = "highlighted";
            }
        });
        liTag += `<li class="${isToday} ${isHighlighted}">${i}</li>`;
        //liTag += `<li class="${isToday}">${i}</li>`;
        }

        for (let i = lastDayofMonth; i < 6; i++) {
        liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`;
        }
        currentDate.innerText = `${months[currMonth]} ${currYear}`;
        daysTag.innerHTML = liTag;
    };

    

    const handlePrevNextClick = (event) => {
        const prevNextIcon = event.target.closest(".icons span");
        const id = prevNextIcon.id;
        setCurrMonth((prevMonth) => {
        let nextMonth = id === "prev" ? prevMonth - 1 : prevMonth + 1;
        if (nextMonth < 0 || nextMonth > 11) {
            setCurrYear((prevYear) => {
            let nextYear = id === "prev" ? prevYear - 1 : prevYear + 1;
            setCurrDate(new Date(nextYear, nextMonth, currDate.getDate()));
            return nextYear;
            });
            return nextMonth < 0 ? 11 : 0;
        }
        setCurrDate(new Date(currYear, nextMonth, currDate.getDate()));
        return nextMonth;
        });
    };

    async function getHighlightedDates() {
        const usr = new User(currentUser);
        const allUsers = await usr.getAllUsers();
        const startDate = new Date(currDate.getTime() - 30 * 24 * 60 * 60 * 1000);
        const endDate = new Date(currDate.getTime() + 30 * 24 * 60 * 60 * 1000);
        let withinRange = [];
        let tripDates = [];

        allUsers.forEach((usr) => {
            if (usr.trips) {
                for (const trip in usr.trips) {
                    const tripDate = new Date(usr.trips[trip].date)
                    if (tripDate.getTime() >= startDate.getTime() && tripDate.getTime() <= endDate.getTime())
                        withinRange.push({ displayName: usr.displayName, email: usr.email, date: usr.trips[trip].date })
                        tripDates.push(usr.trips[trip].date)
                }
            }
        })
        withinRange = withinRange.filter((u) => u.email !== currentUser.email)

        let dateToUsers = {}

        withinRange.forEach((trip) => {
            if (dateToUsers.hasOwnProperty(trip.date)) {
                dateToUsers[trip.date].push({ displayName: trip.displayName, email: trip.email })
            }
            else {
                dateToUsers[trip.date] = []
                dateToUsers[trip.date].push({ displayName: trip.displayName, email: trip.email })
            }
        })

        console.log(dateToUsers)
        const uniqUsersAll = { ...dateToUsers }

        Object.keys(dateToUsers).forEach((key) => {
            const uniq = new Set()
            let uniqUsers = []
            dateToUsers[key].forEach((user) => {
                if (!uniq.has(user.email)) {
                    uniq.add(user.email)
                    uniqUsers.push(user)
                }
            })
            uniqUsersAll[key] = uniqUsers
        })

        console.log(uniqUsersAll)
        return tripDates

    }

    // const handleDateClick = (event) => {
    //     const [clkDate, setClkDate] = useState(new Date());

    // }

    return (
        <div className="wrapper">
        <header>
            <p className="current-date"></p>
            <div className="icons">
            <span
                id="prev"
                className="material-symbols-rounded"
                onClick={handlePrevNextClick}
            >
                {"<"}
            </span>
            <span
                id="next"
                className="material-symbols-rounded"
                onClick={handlePrevNextClick}
            >
                {">"}
            </span>
            </div>
        </header>
        <div className="calendar">
            <ul className="weeks">
            <li>Sun</li>
            <li>Mon</li>
            <li>Tue</li>
            <li>Wed</li>
            <li>Thu</li>
            <li>Fri</li>
            <li>Sat</li>
            </ul>
            <ul className="days"></ul>
        </div>
        </div>
    );
}

export default Calendar;
