import { useEffect, useState } from "react";
import { getFridge, addGroceryToFridge, removeGroceryFromFridge, editGroceryInFridge, addTripToFridge, removeTripFromFridge, updateAllGroceries } from "../../backend/custom_classes/fridge";
import { getSpecificGrocery } from "../../backend/custom_classes/grocery";
import { UserAuth } from "../../backend/authContext";
import { GroupClass } from "../../backend/custom_classes/groupClass";
import { Link } from "react-router-dom";
import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from "@mui/material/Grid";


function Fridge() {

    const [checkedItems, setCheckedItems] = useState(new Set());
    const [showCheckBox, setShowCheckBox] = useState(false) //if we want to show checkbox for choosing grocery run
    const [fridgeItems, setFridgeItems] = useState([]); //list of all items in the fridge and information
    const [showEdit, setShowEdit] = useState({}) //if we want to edit a grocery item
    const [users, setUsers] = useState([]) //users associated with the fridge/group
    const [currentTrips, setCurrentTrips] = useState([]) //current trips planned
    const { currentUser } = UserAuth();
    useEffect(() => {

        async function setupFridge() {
            if (Object.keys(currentUser).includes("groupID")) {

                const { groupID } = currentUser
                if (groupID === null) {

                    return;
                }
                const curFridge = await getFridge(groupID)
                if (curFridge === null) {
                    return;
                }
                const curGroup = new GroupClass(groupID, curFridge.id)
                const groupData = await curGroup.data()
                const grocs = curFridge.data.groceries
                const editStates = {}
                const extendedGrocs = []


                //get all groceries
                for await (const doc of grocs) {
                    const name = doc.itemName
                    editStates[name] = false //at the beginning, don't edit
                    const grocDetail = await getSpecificGrocery(name);

                    const extendedGroc = { ...doc, id: grocDetail.id, price: grocDetail.data.price, priceUnit: grocDetail.data.priceUnit, groceryUnit: grocDetail.data.groceryUnit }
                    extendedGrocs.push(extendedGroc);
                }

                const allTrips = curFridge.data.trips;
                let allTripsInfo = []
                allTrips.forEach((element) => {
                    let curTripInfo = { userID: element.userID, date: element.date, toBuy: [], tripID: element.tripID }
                    const tripGrocs = element.toBuy;

                    for (const g in tripGrocs) {
                        const ind = extendedGrocs.findIndex((grocs) => grocs.itemName === g)
                        const groc = { ...extendedGrocs[ind] }
                        delete groc.currentQuantity;
                        groc["quantityToBuy"] = tripGrocs[g]

                        curTripInfo.toBuy.push(groc)
                        //          extendedGrocs.splice(ind, 1)

                    }
                    allTripsInfo.push(curTripInfo)
                })

                setCurrentTrips(allTripsInfo)
                setFridgeItems(extendedGrocs);
                setUsers(groupData.members);
                setShowEdit(editStates)

            }
        }
        setupFridge();
    }, [currentUser])

    function handleToggle(e) {
        e.preventDefault()
        const id = e.target.id.match("toggle-(.*)-edit")[1]
        const newEdit = { ...showEdit }
        newEdit[id] = true

        setShowEdit(newEdit)
    }
    async function handleEdit(e) {
        e.preventDefault()


        const itemName = e.target.id.match("edit-(.*)-form")[1]

        const newLimit = e.target.limit.value;
        const newQuantity = e.target.quantity.value
        const newStore = e.target.whereToBuy.value

        const updatedItem = await editGroceryInFridge(itemName, newLimit, newQuantity, newStore, currentUser.groupID)
        if (updatedItem) {
            const newGroceries = [...fridgeItems]
            const ind = newGroceries.findIndex(g => g.itemName === itemName)
            newGroceries[ind] = updatedItem
            setFridgeItems(newGroceries)
        }

        const newEdit = { ...showEdit }
        newEdit[itemName] = false
        setShowEdit(newEdit)

    }

    async function handleDelete(e) {
        e.preventDefault();

        await removeGroceryFromFridge(e.target.id, currentUser.groupID)

        const curItems = fridgeItems
        const updatedItems = curItems.filter(groc => groc.itemName !== e.target.id)
        const updatedEdit = { ...showEdit }
        delete updatedEdit[e.target.id]

        setFridgeItems(updatedItems)
        setShowEdit(updatedEdit)
    }
    async function handleSubmit(e) {
        e.preventDefault();

        //check if grocery already in the fridge, if yes, alert and return
        //otherwise, add into the fridge and change state
        const { groupID } = currentUser
        if (groupID === null) {
            alert('Not in a group yet. Please join a group first')

        }
        else {
            const newName = e.target.itemName.value
            const newGrocery = await addGroceryToFridge(e.target.itemName.value, e.target.limit.value, e.target.quantity.value, currentUser.groupID, e.target.whereToBuy.value);

            if (newGrocery) {
                let curItems = [...fridgeItems];
                curItems.push(newGrocery)
                setFridgeItems(curItems)

                const editState = { ...showEdit }
                editState[newName] = false
                setShowEdit(editState)
            }
        }
        e.target.itemName.value = '';
        e.target.limit.value = null;
        e.target.quantity.value = null;
        e.target.whereToBuy.value = null;
    }

    async function handleCheckedItems(e) {
        e.preventDefault()
        if (checkedItems.size === 0) {
            setShowCheckBox(false)
            return
        }

        let items = {}
        const len = e.target.length
        const elements = e.target.elements
        for (let i = 1; i < len; i++) {
            items[elements[i].getAttribute("name").match("quantityToBuy(.*)")[1]] = elements[i].value
        }

        const newTrip = await addTripToFridge(items, currentUser.groupID, currentUser.uid)
        setShowCheckBox(false)
        // needs to handle changing currentGroceries and trips
        const updatedTrips = [...currentTrips]
        let groceryInfo = []
        // const groceries = [...fridgeItems]

        for (const key in items) {
            const value = items[key]

            const ind = fridgeItems.findIndex((g) => g.itemName === key)
            const info = { ...fridgeItems[ind] }
            delete info.currentQuantity;
            info["quantityToBuy"] = value

            groceryInfo.push(info)
            // groceries.splice(ind, 1)
        }

        updatedTrips.push({ userID: currentUser.uid, date: newTrip.date, toBuy: groceryInfo, tripID: newTrip.tripID })
        // setFridgeItems(groceries)
        setCurrentTrips(updatedTrips)
        setCheckedItems(new Set())
    }

    async function handleCheckboxChange(e) {
        const newCheckedItems = new Set(checkedItems)
        if (e.target.checked) {
            newCheckedItems.add(e.target.name)
        }
        else {
            newCheckedItems.delete(e.target.name)
        }
        setCheckedItems(newCheckedItems)
    }

    async function handleCompleteTrip(trip) {
        const bought = trip.toBuy
        let groceryNames = new Map()

        bought.forEach((g) => {
            const itemName = g.itemName
            const toBuy = g.quantityToBuy
            groceryNames.set(itemName, toBuy)
        })

        const newGroceryInfo = [...fridgeItems]
        const forDB = []

        newGroceryInfo.forEach((gn) => {
            const itemName = gn.itemName
            if (groceryNames.has(itemName)) {
                //change the current amount of things

                const quantity = parseInt(gn.currentQuantity) + parseInt(groceryNames.get(itemName))
                gn.currentQuantity = (quantity).toString()
            }
            const copy = { ...gn }
            delete copy.id
            forDB.push(copy)
        })

        await updateAllGroceries(currentUser.groupID, forDB)
        setFridgeItems(newGroceryInfo)
        await handleCancelTrip(trip.tripID)

    }

    async function handleCancelTrip(tripID) {
        if (!await removeTripFromFridge(tripID, currentUser.groupID, currentUser.uid))
            return;

        const ind = currentTrips.findIndex((t) => t.tripID === tripID)
        // const newItems = [...fridgeItems]
        const curTrip = currentTrips[ind]
        // curTrip.toBuy.forEach((g) => {
        //     newItems.push(g)
        // })
        const newTrips = [...currentTrips]
        newTrips.splice(ind, 1)

        // setFridgeItems(newItems)
        setCurrentTrips(newTrips)
    }

    return (
        <div>
            {currentUser.groupID ? <div>Room ID: {currentUser.groupID}</div>
                : <div>You're not in a group yet. Join a group <Link to="/group">here</Link></div>}


            <ul>
                {users.map((usr, ind) => {
                    return <li key={usr}>User {ind + 1}: {usr}</li>;
                })}
            </ul>

            {
                // forms for editing each grocery item in the table 
                fridgeItems.map((groc) => {
                    return (
                        <div>
                            <form key={groc.itemName} method="post" id={`edit-${groc.itemName}-form`} onSubmit={handleEdit}>
                            </form>
                        </div>
                    )
                })
            }
            {
                // handles submitting check groceries
                <form method="post" id="submit-checked-groceries"
                    name="submitCheckedGroceries"
                    onSubmit={handleCheckedItems}></form>
            }

            {
                showCheckBox ?
                    <div>Check items you'll purchase and click done to save.
                        <br></br>
                        <Button variant="outlined" type="submit" form="submit-checked-groceries">Done</Button>
                    </div> :
                    <form style={{ marginBottom: '3%' }} method="post" onSubmit={(e) => { e.preventDefault(); setShowCheckBox(true) }}>
                        <Button variant="outlined" type="submit">Plan grocery trip</Button>
                    </form>
            }
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            {showCheckBox ? <TableCell>Select</TableCell> : null}
                            <TableCell>Item</TableCell>
                            <TableCell>Stock</TableCell>
                            <TableCell>Limit</TableCell>
                            <TableCell>Where to buy</TableCell>
                            <TableCell>Estimated Cost</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    {
                        //this part renders all the grocery runs scheduled
                        currentTrips.map((trip) => {
                            return (
                                <TableBody key={trip.tripID} style={{ border: '5px solid red' }}>
                                    <TableRow>
                                        <TableCell colSpan={showCheckBox ? 6 : 5}><small>Grocery run initiated by {trip.userID} on {trip.date}</small></TableCell>
                                        <TableCell><Button size="medium" variant="outlined" onClick={() => handleCancelTrip(trip.tripID)}>Cancel trip</Button>
                                            <Button size="medium" variant="outlined" onClick={() => handleCompleteTrip(trip)}>Complete trip</Button></TableCell>
                                    </TableRow>
                                    {
                                        trip.toBuy.map((groc) => {

                                            return <TableRow>
                                                {showCheckBox ? <TableCell></TableCell> : null}
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
                        //this part lists all the items currently in a fridge
                        fridgeItems.map((groc) => {
                            const showEditCur = showEdit[groc.itemName]
                            const showGroceryTripInputCur = checkedItems.has(groc.itemName)
                            return (
                                <TableBody>
                                    <TableRow key={groc.id}>
                                        {showCheckBox ? <TableCell > <input type="checkbox" name={`${groc.itemName}`} onChange={handleCheckboxChange} /> </TableCell> : null}

                                        <TableCell>{groc.itemName}</TableCell>


                                        <TableCell>{showEditCur ?
                                            <input type="number" id="quantity" name="quantity" form={`edit-${groc.itemName}-form`}
                                                defaultValue={groc.currentQuantity}></input>
                                            : groc.currentQuantity}</TableCell>

                                        <TableCell>{showEditCur ?
                                            <input type="number" id="limit" name="limit" form={`edit-${groc.itemName}-form`}
                                                defaultValue={groc.maxQuantity}></input>
                                            : groc.maxQuantity}</TableCell>
                                        <TableCell>{showEditCur ?
                                            <input type="text" id="whereToBuy" name="whereToBuy" form={`edit-${groc.itemName}-form`}
                                                defaultValue={groc.whereToBuy}></input>
                                            : groc.whereToBuy}</TableCell>



                                        <TableCell>{groc.price >= 0 ?
                                            `${groc.price} ${groc.priceUnit} per ${groc.groceryUnit}` :
                                            "N/A"}</TableCell>

                                        <TableCell >
                                            <form id={groc.itemName} method="post" onSubmit={handleDelete}>
                                                <Button size="small" variant="outlined" type="submit">Delete</Button>
                                            </form>
                                            {
                                                !showEditCur ?
                                                    <form method="post" id={`toggle-${groc.itemName}-edit`} onSubmit={handleToggle}>
                                                        <Button size="small" variant="outlined" type="submit" >Edit</Button>
                                                    </form> :
                                                    <Button size="small" variant="outlined" type="submit" form={`edit-${groc.itemName}-form`}>Submit</Button>

                                            }
                                        </TableCell>
                                    </TableRow>
                                    {
                                        showGroceryTripInputCur ?
                                            <TableRow>
                                                <TableCell></TableCell>
                                                <TableCell>{groc.itemName}</TableCell>
                                                <TableCell>
                                                    <TextField title="Please enter a number " fullWidth
                                                        label="Quantity to Buy" required size="small"
                                                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', form: "submit-checked-groceries" }}
                                                        id={`quantityToBuy${groc.itemName}`} name={`quantityToBuy${groc.itemName}`}
                                                    ></TextField>
                                                </TableCell>
                                                <TableCell>{groc.maxQuantity}</TableCell>
                                                <TableCell>{groc.whereToBuy}</TableCell>
                                                <TableCell>{groc.price >= 0 ?
                                                    `${groc.price} ${groc.priceUnit} per ${groc.groceryUnit}` :
                                                    "N/A"}</TableCell>
                                            </TableRow> :
                                            null
                                    }
                                </TableBody>
                            )

                        })
                    }
                </Table>
            </TableContainer>

            {/* This part is the form for adding groceries */}
            <Box
                sx={{
                    mt: '15px',
                    mb: '15px'
                }}>

                <form method="post" onSubmit={handleSubmit}>
                    <Grid container style={{ border: 'none', width: '100%' }} spacing={1} >

                        <Grid item xs={6} md={6}>
                            <TextField fullWidth label="Grocery Name" required size="small" id="itemName" name="itemName"></TextField>
                        </Grid>
                        <Grid item xs={6} md={6}>
                            <TextField title="Please enter a number " fullWidth label="Stock Limit" required size="small" inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} id="limit" name="limit"></TextField>
                        </Grid>

                        <Grid item xs={6} md={6}>
                            <TextField fullWidth title="Please enter a number " label="Quantity in stock" required size="small" inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} id="quantity" name="quantity"></TextField>
                        </Grid>
                        <Grid item xs={6} md={6}>
                            <TextField fullWidth label="Store" size="small" id="whereToBuy" name="whereToBuy"></TextField>
                        </Grid>

                        <Grid item xs={12} >
                            <Button fullWidth variant="outlined" type="submit ">Add</Button>
                        </Grid>

                    </Grid>
                </form>
            </Box>
        </div>
    );
}

export default Fridge;