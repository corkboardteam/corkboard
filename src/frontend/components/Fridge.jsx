import { useEffect, useState } from "react";
import { getFridge } from "../../backend/custom_classes/fridge";
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
    return (
        <div>
            <div>Room 1</div>
            <ul>
                {users.map((usr, ind) => {
                    return <li>User {ind + 1}: {usr}</li>;
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
        </div>
    );
}

export default Fridge;