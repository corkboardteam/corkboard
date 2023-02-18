import React from 'react';
import { Link } from 'react-router-dom'
import { Form, Button, Card, Alert } from 'react-bootstrap'


function Dashboard() {
  return (
    <div className="w-100 text-center mt-2">
        Go to Grocery List <Link to="/grocerylist">Grocery List</Link>
        <body>
          <table>
            <tr>
              <th>Item</th>
              <th>Stock</th>
              <th>Limit</th>
              <th>Where to buy</th>
            </tr>
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
      </div>
  );
}

export default Dashboard;