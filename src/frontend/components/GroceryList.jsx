import React from "react";
import { useState, useEffect } from "react";
import { addGroceryItem, getAllGroceries } from "../../backend/custom_classes/grocery";
import { UserAuth } from "../../backend/authContext";
import User from "../../backend/custom_classes/user";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

function GroceryList() {

    const [currentTrips, setCurrentTrips] = React.useState({});
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

    return (
        <body>
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
                    Object.values(currentTrips).map((trip) => {
                        return (
                            <TableBody key={trip.tripID} style={{ border: '5px solid red' }}>
                                <TableRow>
                                    <TableCell colSpan={5}><small>Grocery run initiated by {currentUser.displayName ? currentUser.displayName : currentUser.email} on {trip.date}</small></TableCell>

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
        </body>

    );
}

export default GroceryList;