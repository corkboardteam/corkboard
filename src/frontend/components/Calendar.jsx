import '../styles/Calendar.css';
import React, { useState, useEffect } from "react";
import User from "../../backend/custom_classes/user";
import { UserAuth } from "../../backend/authContext";
import Dialog from '@mui/material/Dialog';
import DialogActions from "@mui/material/DialogActions";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';


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
    const [withinRange, setWithinRange] = useState([]);
    const { currentUser } = UserAuth();
    const [dateToUsers, setDateToUsers] = useState({});
    const [openDialog, setOpenDialig] = React.useState(false);
    const [shopWith, setShopWith] = useState([])
    const [usersWithTrips, setUsersWithTrips] = useState([])

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
        let usersOnDate = [];
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
                if (dateToUsers[dateString]) {
                    usersOnDate = dateToUsers[dateString];
                  }
            }
        });
        liTag += `<li class="${isToday} ${isHighlighted}" onClick="${handleDateClick}">${i}</li>`;

        // liTag += `<li class="${isToday} ${isHighlighted}" data-date="${i}">
        //           <div class="date">${i}</div>
        //           <div class="user-list">
        //             ${usersOnDate
        //               .map(
        //                 (user) =>
        //                   `<div class="user" data-email="${user.email}">${user.displayName}</div>`
        //               )
        //               .join("")}
        //           </div>
        //        </li>`;
        //liTag += `<li class="${isToday} ${isHighlighted}">${i}</li>`;
        //liTag += `<li class="${isToday}">${i}</li>`;
        }

        for (let i = lastDayofMonth; i < 6; i++) {
        liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`;
        }
        currentDate.innerText = `${months[currMonth]} ${currYear}`;
        daysTag.innerHTML = liTag;
        const usersInCalendar = document.querySelectorAll(".user");
        usersInCalendar.forEach((user) => {
            user.addEventListener("click", (e) => {
            alert(`User email: ${e.currentTarget.dataset.email}`);
            });
        });
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
        const startDate = new Date(currDate.getTime() - 45 * 24 * 60 * 60 * 1000);
        const endDate = new Date(currDate.getTime() + 45 * 24 * 60 * 60 * 1000);
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
        //withinRange = withinRange.filter((u) => u.email !== currentUser.email)

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

    const handleDateClick = (event) => {
        const clickedDate = new Date(currYear, currMonth, parseInt(event.target.innerText));
        const formattedDate = clickedDate.toLocaleDateString('en-US');
        handleFindPeopleToShopWith(formattedDate);
        // Get the list of users for the clicked date
        const usersOnDate = [];
        Object.entries(dateToUsers).forEach(([key, value]) => {
          const dateParts = key.split('/');
          const year = parseInt(dateParts[2], 10);
          const month = parseInt(dateParts[0], 10) - 1; // January is 0
          const day = parseInt(dateParts[1], 10);
          const date = new Date(year, month, day);
          if (
            date.getFullYear() === currYear &&
            date.getMonth() === currMonth &&
            date.getDate() === parseInt(event.target.innerText)
          ) {
            usersOnDate.push(...value);
          }
        });
      
        // If there are users for the clicked date, show a dialog box with their details
        if (usersOnDate.length > 0) {
          const userRows = usersOnDate.map(user => (
            <TableRow key={user.email}>
              <TableCell>{user.displayName}</TableCell>
              <TableCell>{user.email}</TableCell>
            </TableRow>
          ));
      
          setOpenDialig(true);
          setUsersWithTrips(userRows);
        }
      }
      

    async function handleFindPeopleToShopWith(date) {
        console.log(date)
        const usr = new User(currentUser)
        const allUsers = await usr.getAllUsers()
        console.log(allUsers)

        let usersWithSameDate = []
        allUsers.forEach((usr) => {
            if (usr.trips) {
                for (const trip in usr.trips) {
                    if (usr.trips[trip].date === date)
                        usersWithSameDate.push({ displayName: usr.displayName, email: usr.email })
                }
            }
        })
        usersWithSameDate = usersWithSameDate.filter((u) => u.email !== currentUser.email)
        const uniq = new Set()
        let uniqUsers = []
        usersWithSameDate.forEach((user) => {
            if (!uniq.has(user.email)) {
                uniq.add(user.email)
                uniqUsers.push(user)
            }
        })

        setShopWith(uniqUsers)
        setOpenDialig(true)
    }
    function handleCloseDialog() {
        setOpenDialig(false)
        // setShopWith([])
    }

    return (
        <div className="calendar-container">
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
            <ul className="days" onClick={handleDateClick}></ul>
          </div>
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            {
              shopWith.length === 0 ?
                <div className="dialog-div">Sorry, we couldn't find anyone else going grocery shopping on this date</div> :
                <div className="dialog-div">
                  We found the following users who are going grocery shopping on this date!
                  Shoot them an email :)
                  <ul>
                    {
                      shopWith.map((usr) => {
                        return (
                          <li key={usr.email}>
                            {usr.displayName ? `${usr.displayName}: ` : null} {usr.email}
                          </li>
                        )
                      })
                    }
                  </ul>
                </div>
            }
            <DialogActions>
              <Button variant="outlined" onClick={handleCloseDialog}>Close</Button>
            </DialogActions>
          </Dialog>
        </div>
      );
      
      
}

export default Calendar;
