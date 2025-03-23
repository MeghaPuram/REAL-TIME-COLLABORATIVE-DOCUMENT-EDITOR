import "./components/init";
import { BrowserRouter as Router, Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import './App.css';
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";

import TextEditor from "./components/TextEditor";


function App() {
  return (

    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route exact path="/Home" element={<Home />} />
          <Route exact path="/TextEditor" element={<TextEditor />} />
          <Route path="*" element={<Navigate to="/Login" />} />
        </Routes>
      </div>

    </BrowserRouter>

  )
}

export default App
