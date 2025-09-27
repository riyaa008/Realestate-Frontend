import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CreateListing from "./Admin/CreateListing";
import Dashboard from "./Admin/Dashboard";
import ListingItem from "./Admin/ListingItem";
import Offers from "./Admin/Offers";
import AdminPanel from "./components/AdminPanel";
import Header from "./components/Header";
import AboutUs from "./Pages/AboutUs";
import Contact from "./Pages/Contact";
import Home from "./Pages/Home";
// import Profile from "./Pages/Profile";
import Login from "./Admin/Login";
import Search from "./Pages/Search";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";

// Corrected AdminLayout Component
const UserLayout = ({ children }) => {
  return (
    <React.Fragment>
      <Header />
      <div>{children}</div>
    </React.Fragment>
  );
};

const AdminLayout = ({ children }) => {
  return (
    <React.Fragment>
      <AdminPanel />
      <div>{children}</div>
    </React.Fragment>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Wrap Home in UserLayout */}
        <Route
          path="/"
          element={
            <UserLayout>
              <Home />
            </UserLayout>
          }
        />
        <Route
          path="/sign-in"
          element={
            <UserLayout>
              <SignIn />
            </UserLayout>
          }
        />
        <Route
          path="/sign-up"
          element={
            <UserLayout>
              <SignUp />
            </UserLayout>
          }
        />
        <Route
          path="/aboutus"
          element={
            <UserLayout>
              <AboutUs />
            </UserLayout>
          }
        />
        <Route
          path="/search"
          element={
            <UserLayout>
              <Search />
            </UserLayout>
          }
        />
        <Route
          path="/contact"
          element={
            <UserLayout>
              <Contact />
            </UserLayout>
          }
        />
        <Route
          path="/Login"
          element={
            <UserLayout>
              <Login />
            </UserLayout>
          }
        />
        <Route path="/adminpanel" element={<AdminPanel />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/ListingItem" element={<ListingItem />} />
        <Route path="/Offers" element={<Offers />} />
        <Route path="/CreateListing" element={<CreateListing />} />

        {/* <Route path="/profile" element={<Profile />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
