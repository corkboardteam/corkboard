import { useEffect, useState } from "react";
import { getFridge, addGroceryToFridge, removeGroceryFromFridge, editGroceryInFridge, addTripToFridge } from "../../backend/custom_classes/fridge";
import { getSpecificGrocery } from "../../backend/custom_classes/grocery";
import { UserAuth } from "../../backend/authContext";
import { GroupClass } from "../../backend/custom_classes/groupClass";
import { Link } from "react-router-dom";
import React from "react";



function Fridge() {
    let checkedItems = [];

    const [showCheckBox, setShowCheckBox] = useState(false)
    const [fridgeItems, setFridgeItems] = useState([]);
    const [showEdit, setShowEdit] = useState({})
    const [users, setUsers] = useState([])
    const [currentTrips, setCurrentTrips] = useState([])
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
                    //get grocery information from extendedGrocs and remove corresponding entry
                    let curTripInfo = { userID: element.userID, date: element.date, toBuy: [] }
                    const tripGrocs = element.toBuy;

                    tripGrocs.forEach((g) => {
                        const ind = extendedGrocs.findIndex((grocs) => grocs.itemName === g)
                        curTripInfo.toBuy.push(extendedGrocs[ind])
                        extendedGrocs.splice(ind, ind + 1)
                    })
                    allTripsInfo.push(curTripInfo)
                })

                setCurrentTrips(allTripsInfo)
                setFridgeItems(extendedGrocs);
                setUsers(groupData.members);
                setShowEdit(editStates)
                checkedItems = [];
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
        console.log(e)
        if (checkedItems.length === 0) {
            setShowCheckBox(false)
            return
        }

        await addTripToFridge(checkedItems, currentUser.groupID, currentUser.uid)
        setShowCheckBox(false)
        // needs to handle changing currentGroceries and trips
        const updatedTrips = [...currentTrips]
        let groceryInfo = []

        const groceries = [...fridgeItems]
        checkedItems.forEach((element) => {
            console.log(element)
            const ind = groceries.findIndex((g) => g.itemName === element)
            console.log(ind)
            groceryInfo.push(groceries[ind])
            groceries.splice(ind, ind + 1)
        })
        console.log(groceryInfo)
        console.log(groceries)
        updatedTrips.push({ userID: currentUser.uid, date: "place holder", toBuy: groceryInfo })
        setFridgeItems(groceries)
        setCurrentTrips(updatedTrips)
        checkedItems = []
    }

    async function handleCheckboxChange(e) {

        console.log(e.target.checked)
        if (e.target.checked) {
            console.log(e.target.name)
            checkedItems.push(e.target.name)
        }
        else {
            checkedItems = checkedItems.filter((groc) => groc !== e.target.name)
        }

        console.log(checkedItems)
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
                        <form key={groc.itemName} method="post" id={`edit-${groc.itemName}-form`} onSubmit={handleEdit}>
                        </form>
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
                        <button form="submit-checked-groceries">Done</button>
                    </div> :
                    <form method="post" onSubmit={(e) => { e.preventDefault(); setShowCheckBox(true) }}>
                        <button>Plan grocery trip</button>
                    </form>
            }
            <table>
                <tr>
                    {showCheckBox ? <th>Select</th> : null}
                    <th>Item</th>
                    <th>Stock</th>
                    <th>Limit</th>
                    <th>Where to buy</th>
                    <th>Estimated Cost</th>
                </tr>
                {
                    currentTrips.map((trip) => {
                        return (
                            <tbody style={{ border: '5px solid red' }}>
                                <tr><td colSpan={5}><small>Grocery run initiated by {trip.userID} on {trip.date}</small></td> </tr>
                                {
                                    trip.toBuy.map((groc) => {
                                        return <tr>
                                            {showCheckBox ? <td></td> : null}
                                            <td>{groc.itemName}</td>
                                            <td>{groc.currentQuantity}</td>
                                            <td>{groc.maxQuantity}</td>
                                            <td>{groc.whereToBuy}</td>
                                            <td>{groc.price >= 0 ?
                                                `${groc.price} ${groc.priceUnit} per ${groc.groceryUnit}` :
                                                "N/A"}</td>
                                        </tr>
                                    })
                                }
                            </tbody>
                        )
                    })
                }
                {
                    fridgeItems.map((groc) => {
                        const showEditCur = showEdit[groc.itemName]
                        return (
                            <tr key={groc.id}>
                                {showCheckBox ? <td> <input type="checkbox" name={`${groc.itemName}`} form="submit-checked-groceries" onChange={handleCheckboxChange} /> </td> : null}
                                <td>{groc.itemName}</td>


                                <td>{showEditCur ?
                                    <input type="number" id="quantity" name="quantity" form={`edit-${groc.itemName}-form`}
                                        defaultValue={groc.currentQuantity}></input>
                                    : groc.currentQuantity}</td>

                                <td>{showEditCur ?
                                    <input type="number" id="limit" name="limit" form={`edit-${groc.itemName}-form`}
                                        defaultValue={groc.maxQuantity}></input>
                                    : groc.maxQuantity}</td>
                                <td>{showEditCur ?
                                    <input type="text" id="whereToBuy" name="whereToBuy" form={`edit-${groc.itemName}-form`}
                                        defaultValue={groc.whereToBuy}></input>
                                    : groc.whereToBuy}</td>



                                <td>{groc.price >= 0 ?
                                    `${groc.price} ${groc.priceUnit} per ${groc.groceryUnit}` :
                                    "N/A"}</td>
                                <td></td>
                                <td>
                                    <form id={groc.itemName} method="post" onSubmit={handleDelete}>
                                        <button>Delete</button>
                                    </form>
                                    {
                                        !showEditCur ?
                                            <form method="post" id={`toggle-${groc.itemName}-edit`} onSubmit={handleToggle}>
                                                <button>Edit</button>
                                            </form> :
                                            <button form={`edit-${groc.itemName}-form`}>Submit</button>

                                    }
                                </td>
                            </tr>
                        )
                    })
                }
            </table>


            <form method="post" onSubmit={handleSubmit}>
                <label for="itemName">Grocery Name: </label>
                <input type="text" id="itemName" name="itemName"></input>
                <label for="limit">Stock Limit</label>
                <input type="number" id="limit" name="limit"></input>
                <label for="quantity">Quantity in stock </label>
                <input type="number" id="quantity" name="quantity"></input>
                <label for="whereToBuy">Store</label>
                <input type="text" id="whereToBuy" name="whereToBuy"></input>
                <button type="submit">+</button>
            </form>
        </div>
    );
}

export default Fridge;