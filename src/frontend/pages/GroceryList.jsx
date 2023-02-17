import { getAllGroceries } from "../../backend/custom_classes/grocery";
import React from "react";
import { useState, useEffect } from "react";
function GroceryList() {

    const [allGroceries, setAllGroceries] = React.useState([]);
    useEffect(() => {
        async function checkGroceries() {
            const groceries = await getAllGroceries();
            setAllGroceries(groceries);
        }

        checkGroceries();
    })
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
                                <td>{groc.data.storeName}</td>
                            </tr>
                        )
                    })
                }
                <tr>
                    <td>eggs</td>
                    <td>ten eggs</td>
                    <td>sixty eggs</td>
                    <td>Ralphs</td>
                </tr>
                <tr>
                    <td>oatmeal</td>
                    <td>zero</td>
                    <td>three canisters</td>
                    <td>Target</td>
                </tr>
                <tr>
                    <td>milk</td>
                    <td>one gallon</td>
                    <td>two gallons</td>
                    <td>Ralphs</td>
                </tr>
                <tr>
                    <td>spinach</td>
                    <td>one bag</td>
                    <td>three bags</td>
                    <td>Whole Foods</td>
                </tr>
            </table>
            <button>+</button>
        </body>
        /*
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Edit <code>src/App.js</code> and save to reload.
            </p>
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a>
          </header>
        </div>
        */
    );
}

export default GroceryList;