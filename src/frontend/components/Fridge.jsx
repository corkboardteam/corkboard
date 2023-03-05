import { useEffect, useState } from "react";
import { getFridge, addGroceryToFridge, removeGroceryFromFridge, editGroceryInFridge } from "../../backend/custom_classes/fridge";
import { getSpecificGrocery } from "../../backend/custom_classes/grocery";
import { UserAuth } from "../../backend/authContext";
import { GroupClass } from "../../backend/custom_classes/groupClass";
import { Link } from "react-router-dom";

function Fridge() {

    const [fridgeItems, setFridgeItems] = useState([]);
    const [showEdit, setShowEdit] = useState({})
    const [users, setUsers] = useState([])
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
                for await (const doc of grocs) {

                    const name = doc.itemName
                    editStates[name] = false
                    const grocDetail = await getSpecificGrocery(name);


                    const extendedGroc = { ...doc, id: grocDetail.id, price: grocDetail.data.price, priceUnit: grocDetail.data.priceUnit, groceryUnit: grocDetail.data.groceryUnit }
                    extendedGrocs.push(extendedGroc);
                }
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
                fridgeItems.map((groc) => {
                    return (
                        <form method="post" id={`edit-${groc.itemName}-form`} onSubmit={handleEdit}>
                        </form>
                    )
                })
            }
            <table>
                <tr>
                    <th>Item</th>
                    <th>Stock</th>
                    <th>Limit</th>
                    <th>Where to buy</th>
                    <th>Estimated Cost</th>
                </tr>
                {
                    fridgeItems.map((groc) => {
                        const showEditCur = showEdit[groc.itemName]
                        return (
                            <tr key={groc.id}>
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
                <label for="quantity">Quantity to buy </label>
                <input type="number" id="quantity" name="quantity"></input>
                <label for="whereToBuy">Store</label>
                <input type="text" id="whereToBuy" name="whereToBuy"></input>
                <button type="submit">+</button>
            </form>
        </div>
    );
}

export default Fridge;