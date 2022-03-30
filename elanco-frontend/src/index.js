import React from "react";
import ReactDOM from "react-dom";
import RebatePage from "./Components/RebatePage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./main.css";
import Account from "./Components/Account";
import Authentication from "./Components/Authentication";

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route exact path="/" element={<RebatePage />}></Route>
      <Route path="/account" element={<Account />}></Route>
      <Route path="/auth" element={<Authentication />}></Route>
    </Routes>
  </BrowserRouter>,
  document.getElementById("root")
);
