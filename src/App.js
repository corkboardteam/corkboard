import logo from './frontend/media/logo.svg';
import './frontend/styles/App.css';
import db from './backend/config'

function App() {
  return (
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

export default App;
