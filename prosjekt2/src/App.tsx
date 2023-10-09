import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Root from "./Root";
import Results from "./Routes/Results";
import ComboBox from "./Components/ComboBox";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/:id" element={<Results />} />
      </Routes>
    </div>
  );
}

export default App;
