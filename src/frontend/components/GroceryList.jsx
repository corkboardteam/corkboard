import React from "react";
import { useState, useEffect } from "react";
import { addGroceryItem, getAllGroceries } from "../../backend/custom_classes/grocery";

function GroceryList() {

    const [allGroceries, setAllGroceries] = React.useState([]);

    useEffect(() => {
        async function checkGroceries() {
            const groceries = await getAllGroceries();
            setAllGroceries(groceries)
        }
        checkGroceries();
    }, []) // [] makes sure useEffect only runs on mount, avoids infinitely reading from database

    async function addGroceryToDB(e) {
        e.preventDefault()
        await addGroceryItem(e.target.itemName.value, e.target.price.value, e.target.storeName.value)
        const newGroceries = await getAllGroceries();
        setAllGroceries(newGroceries)

        e.target.itemName.value = '';
        e.target.price.value = '';
        e.target.storeName.value = '';
    }

    return (
        <body>
            <table>
                <tr>
                    <th>Item</th>
                    <th>Stock</th>
                    <th>Limit</th>
                    <th>Where to buy</th>
                </tr>
                {
                    allGroceries.map((groc) => {
                        return (
                            <tr key={groc.id}>
                                <td>{groc.data.itemName}</td>
                                <td>{groc.data.price}</td>
                                <td>{groc.data.limit}</td>
                                <td>{groc.data.storeName}</td>
                            </tr>
                        )
                    })
                }
            </table>
            <form method="post" onSubmit={addGroceryToDB}>
                <label for="itemName">Item Name: </label>
                <input type="text" id="itemName" name="itemName"></input>
                <label for="price">Price: </label>
                <input type="text" id="price" name="price"></input>
                <label for="storeName">Store Name: </label>
                <input type="text" id="storeName" name="storeName"></input>
                <button type="submit">+</button>
            </form>
        </body>

    );
}

export default GroceryList;