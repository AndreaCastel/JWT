import { useState } from "react";
import "./App.css";
import { PWDRequisite } from "./PWDRequisite";

function App() {
  const [password, setPassword] = useState("");
  const [pwdRequiste, setPWDRequiste] = useState(true);

  const handleOnChange = (e) => {setPassword(e.target.value);};
  const handleOnFocus = () => {setPWDRequiste(true);};
  const handleOnBlur = () => {setPWDRequiste(false);};
  
  return (
    <div className="App">
      <div>
        <h2>Password Strength Validator</h2>
      </div>
      <div>
        <label htmlFor="password">Password :</label>
        <input id="password" type="text" value={password} onChange={handleOnChange} onFocus={handleOnFocus} onBlur={handleOnBlur}/>
      </div>
      {pwdRequiste ? <PWDRequisite/> : null}
    </div>
  );
}

export default App;
