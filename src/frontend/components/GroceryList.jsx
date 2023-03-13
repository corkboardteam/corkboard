import React from "react";
import { useState, useEffect } from "react";
import { addGroceryItem, getAllGroceries } from "../../backend/custom_classes/grocery";
import { UserAuth } from "../../backend/authContext";
import User from "../../backend/custom_classes/user";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from "@mui/material/DialogActions";
import DatePicker from 'react-datepicker';


function GroceryList() {

    const [currentTrips, setCurrentTrips] = React.useState({});
    const [openDialog, setOpenDialig] = React.useState(false);
    const [shopWith, setShopWith] = useState([])
    const [selectedStartDate, setSelectedStartDate] = useState("")
    const [selectedEndDate, setSelectedEndDate] = useState("")
    const [displayDateRange, setDisplayDateRange] = useState(false)
    const [usersInDateRange, setUsersInDateRange] = useState({})

    const { currentUser } = UserAuth();
    useEffect(() => {
        // async function checkGroceries() {
        //     const groceries = await getAllGroceries();
        //     setAllGroceries(groceries)
        // }
        // checkGroceries();
        async function getAllTrips() {
            const curUser = new User(currentUser)
            const userData = await curUser.data()
            const tripData = userData.trips
            //tripData.sort((trip1, trip2) => (new Date(trip1.date)) - (new Date(trip2.date)))
            console.log(tripData)

            setCurrentTrips(tripData)

        }

        getAllTrips()
    }, []) // [] makes sure useEffect only runs on mount, avoids infinitely reading from database

    // async function addGroceryToDB(e) {
    //     e.preventDefault()
    //     await addGroceryItem(e.target.itemName.value, e.target.price.value, e.target.storeName.value)
    //     const newGroceries = await getAllGroceries();
    //     setAllGroceries(newGroceries)

    //     e.target.itemName.value = '';
    //     e.target.price.value = '';
    //     e.target.storeName.value = '';
    // }
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

    function handleCloseDisplayDateRange() {
        setDisplayDateRange(false)
        setSelectedEndDate("")
        setSelectedStartDate("")
    }

    function handleStartDateChange(date) {
        setSelectedStartDate(date)
    }

    function handleEndDateChange(date) {
        setSelectedEndDate(date)
    }

    async function handleSetDateRange() {
        const usr = new User(currentUser)
        const allUsers = await usr.getAllUsers()
        const startDate = new Date(selectedStartDate)
        const endDate = new Date(selectedEndDate)
        let withinRange = []

        allUsers.forEach((usr) => {
            if (usr.trips) {
                for (const trip in usr.trips) {
                    const tripDate = new Date(usr.trips[trip].date)
                    if (tripDate.getTime() >= startDate.getTime() && tripDate.getTime() <= endDate.getTime())
                        withinRange.push({ displayName: usr.displayName, email: usr.email, date: usr.trips[trip].date })
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

        setUsersInDateRange(uniqUsersAll)

        setDisplayDateRange(true)

    }

    return (
        <body>
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                {
                    shopWith.length === 0 ?
                        <div className="dialog-div">Sorry, we couldn't find anyone else going grocery shopping on this date</div> :
                        <div className="dialog-div">
                            We found the following users who are going grocery shopping on the same date as you!
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


            <Dialog open={displayDateRange} onClose={handleCloseDisplayDateRange}>
                {
                    Object.keys(usersInDateRange).length === 0 ?
                        <div className="dialog-div">Sorry, we couldn't find anyone else going grocery shopping within this date range</div> :
                        <div className="dialog-div">
                            We found the following users going shopping between <b>{selectedStartDate ? `${new Date(selectedStartDate).toLocaleDateString('en-us',
                                { weekday: "long", year: "numeric", month: "short", day: "numeric" })}` : ""}</b> and <b>{selectedEndDate ? `${new Date(selectedEndDate).toLocaleDateString('en-us',
                                    { weekday: "long", year: "numeric", month: "short", day: "numeric" })}` : ""}</b>! Shoot them an email :)
                            <ul>
                                {
                                    Object.keys(usersInDateRange).
                                        sort((date1, date2) => (new Date(date1)) - (new Date(date2))).map((date) => {
                                            return (
                                                <li>On {date}:
                                                    <ul>
                                                        {
                                                            usersInDateRange[date].map((usr) => {
                                                                return (
                                                                    <li key={`${usr.email}${date}`}>
                                                                        {usr.displayName ? `${usr.displayName}: ` : null} {usr.email}
                                                                    </li>
                                                                )
                                                            })
                                                        }
                                                    </ul>
                                                </li>
                                            )
                                        })
                                }
                            </ul>

                        </div>
                }
                <DialogActions>
                    <Button variant="outlined" onClick={handleCloseDisplayDateRange}>Close</Button>
                </DialogActions>

            </Dialog>
            {/* modify the buttons below to include them in the table under the headers to add more rows instead */}
            {/* <form method="post" onSubmit={addGroceryToDB}>
                <label for="itemName">Item Name: </label>
                <input type="text" id="itemName" name="itemName"></input>
                <label for="price">Price: </label>
                <input type="text" id="price" name="price"></input>
                <label for="storeName">Store Name: </label>
                <input type="text" id="storeName" name="storeName"></input>
                <button type="submit">+</button>
    </form> */}
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Item</TableCell>
                        <TableCell>Quantity to Buy</TableCell>
                        <TableCell>Limit</TableCell>
                        <TableCell>Where to buy</TableCell>
                        <TableCell>Estimated Cost</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                {
                    //this part renders all the grocery runs scheduled
                    Object.values(currentTrips)
                        .sort((trip1, trip2) => (new Date(trip1.date)) - (new Date(trip2.date)))
                        .map((trip) => {
                            return (
                                <TableBody key={trip.tripID} style={{ border: '5px solid red' }}>
                                    <TableRow>
                                        <TableCell colSpan={5}><small>Grocery run initiated by {currentUser.displayName ? currentUser.displayName : currentUser.email} on {trip.date}</small></TableCell>
                                        <TableCell>
                                            <Button variant="outlined"
                                                onClick={() => handleFindPeopleToShopWith(trip.date)}>
                                                Find people to shop with!
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                    {
                                        trip.toBuy.map((groc) => {

                                            return <TableRow>

                                                <TableCell>{groc.itemName}</TableCell>
                                                <TableCell>To buy: {groc.quantityToBuy}</TableCell>
                                                <TableCell>{groc.maxQuantity}</TableCell>
                                                <TableCell>{groc.whereToBuy}</TableCell>
                                                <TableCell>{groc.price >= 0 ?
                                                    `${groc.price} ${groc.priceUnit} per ${groc.groceryUnit}` :
                                                    "N/A"}</TableCell>
                                            </TableRow>
                                        })
                                    }
                                </TableBody>
                            )
                        })
                }

                {
                    //     allGroceries.map((groc) => {
                    //         return (
                    //             <tr key={groc.id}>
                    //                 <td>{groc.data.itemName}</td>
                    //                 <td>{groc.data.price >= 0 ? `${groc.data.price} ${groc.data.priceUnit} per ${groc.data.groceryUnit}` : "N/A"}</td>
                    //             </tr>
                    //         )
                    //     })
                    // }
                }
            </Table>

            <div>
                Or, search for trips happening between a specific date range (inclusive)!
                <div>
                    Start date
                    <DatePicker
                        selected={selectedStartDate}
                        onChange={handleStartDateChange}
                        dateFormat="MM/dd/yyyy"
                        className="custom-datepicker"
                    />
                </div>
                <div>
                    End date
                    <DatePicker
                        selected={selectedEndDate}
                        onChange={handleEndDateChange}
                        dateFormat="MM/dd/yyyy"
                        className="custom-datepicker"
                    />
                </div>

                <Button onClick={handleSetDateRange}>Start Search!</Button>

            </div>
        </body>

    );
}

export default GroceryList;