import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Landing from "./components/layout/Landing";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Navbar />
          <Landing />
          <Footer />
        </div>
      </Router>
    );
  }
}

export default App;
