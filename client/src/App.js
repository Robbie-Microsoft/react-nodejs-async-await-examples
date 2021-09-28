import logo from "./logo.svg";
import "./App.css";
import User from "./components/user/User";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <User />
        <img src={logo} className="App-logo" alt="logo" />
        <p>Edit <code>src/App.js</code> and save to reload.</p>
      </header>
    </div>
  );
}

export default App;
