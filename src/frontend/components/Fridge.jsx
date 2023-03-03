import { useEffect, useState } from "react";
import { getFridge, addGroceryToFridge, removeGroceryFromFridge } from "../../backend/custom_classes/fridge";
import { getSpecificGrocery } from "../../backend/custom_classes/grocery";
import { UserAuth } from "../../backend/authContext";
import { GroupClass } from "../../backend/custom_classes/groupClass";
import { Link } from "react-router-dom";

function Fridge() {

    const [fridgeItems, setFridgeItems] = useState([]);
    const [users, setUsers] = useState([])
    const { currentUser } = UserAuth();
    useEffect(() => {

        async function setupFridge() {
            if (Object.keys(currentUser).includes("groupID")) {

                const { groupID } = currentUser
                if (groupID === null) {
                    console.log('null')
                    return;
                }
                const curFridge = await getFridge(groupID)
                if (curFridge === null) {
                    console.log(null)
                    return;
                }
                const curGroup = new GroupClass(groupID, curFridge.id)

                const groupData = await curGroup.data()

                const grocs = curFridge.data.groceries

                const extendedGrocs = []
                for await (const doc of grocs) {

                    const name = doc.itemName
                    const grocDetail = await getSpecificGrocery(name);
                    console.log(grocDetail)

                    const extendedGroc = { ...doc, id: grocDetail.id, price: grocDetail.data.price, priceUnit: grocDetail.data.priceUnit, groceryUnit: grocDetail.data.groceryUnit }
                    extendedGrocs.push(extendedGroc);
                }
                setFridgeItems(extendedGrocs);
                setUsers(groupData.members);

            }
        }


        setupFridge();
    }, [currentUser])

    async function handleDelete(e) {
        e.preventDefault();
        console.log(e.target.id)
        await removeGroceryFromFridge(e.target.id, currentUser.groupID)

        const curItems = fridgeItems
        const updatedItems = curItems.filter(groc => groc.itemName !== e.target.id)
        console.log(updatedItems)
        setFridgeItems(updatedItems)
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
            const newGrocery = await addGroceryToFridge(e.target.itemName.value, e.target.limit.value, e.target.quantity.value, currentUser.groupID, e.target.whereToBuy.value);
            console.log(newGrocery)
            if (newGrocery) {
                let curItems = [...fridgeItems];
                curItems.push(newGrocery)
                setFridgeItems(curItems)

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

                        return (
                            <tr key={groc.id}>
                                <td>{groc.itemName}</td>
                                <td>{groc.currentQuantity}</td>
                                <td>{groc.maxQuantity}</td>
                                <td>{groc.whereToBuy}</td>
                                <td>{groc.price >= 0 ?
                                    `${groc.price} ${groc.priceUnit} per ${groc.groceryUnit}` :
                                    "N/A"}</td>
                                <td></td>
                                <td>
                                    <form id={groc.itemName} method="post" onSubmit={handleDelete}>
                                        <button>Delete</button>
                                    </form>
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