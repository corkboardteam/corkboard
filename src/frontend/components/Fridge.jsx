import { useEffect, useState } from "react";
import { getFridge, addGroceryToFridge } from "../../backend/custom_classes/fridge";
import { getSpecificGrocery } from "../../backend/custom_classes/grocery";
function Fridge() {

    const [fridgeItems, setFridgeItems] = useState([]);
    const [users, setUsers] = useState([])

    useEffect(() => {
        //this hardcodes the room number rn, change once user and fridge component integrated
        async function setupFridge() {
            const curFridge = await getFridge("room 1")

            const grocs = curFridge.data.groceries
            const extendedGrocs = []
            for await (const doc of grocs) {
                const name = doc.itemName
                const grocDetail = await getSpecificGrocery(name);

                const extendedGroc = { ...doc, whereToBuy: grocDetail.data.storeName, id: grocDetail.id }
                extendedGrocs.push(extendedGroc);
            }
            setFridgeItems(extendedGrocs);
            setUsers(curFridge.data.users);
        }

        setupFridge();
    }, [])

    async function handleSubmit(e) {
        e.preventDefault();

        //check if grocery already in the fridge, if yes, alert and return
        //otherwise, add into the fridge and change state
        const newGrocery = await addGroceryToFridge(e.target.itemName.value, e.target.limit.value, e.target.quantity.value, "room 1");

        if (newGrocery) {
            let curItems = [...fridgeItems];
            curItems.push(newGrocery)
            setFridgeItems(curItems)

        }
        e.target.itemName.value = '';
        e.target.limit.value = null;
        e.target.quantity.value = null;
    }

    return (
        <div>
            <div>Room 1</div>
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
                </tr>
                {
                    fridgeItems.map((groc) => {

                        return (
                            <tr key={groc.id}>
                                <td>{groc.itemName}</td>
                                <td>{groc.currentQuantity}</td>
                                <td>{groc.maxQuantity}</td>
                                <td>{groc.whereToBuy}</td>
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
                <button type="submit">+</button>
            </form>
        </div>
    );
}

export default Fridge;