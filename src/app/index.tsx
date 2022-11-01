import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Chess } from "./chess";
import { Ui2048 } from "./2048/2048";
import { Menu } from "./menu";

import "./main.css";

export const App = () => {
  return (
    <Router>
      <div className="App">
        <Menu />

        <Routes>
          <Route path="/chess" element={<Chess />} />
          <Route path="/2048" element={<Ui2048 />} />
        </Routes>
      </div>
    </Router>
  );
};
