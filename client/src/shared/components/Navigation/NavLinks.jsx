import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import "./NavLinks.css";
import { AuthContext } from "../context/auth-context";
import Button from "../FormElements/Button";

const NavLinks = () => {
  const auth = useContext(AuthContext);
  const myplaceURL = `/${auth.userId}/places`;

  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/" exact>
          All User
        </NavLink>
      </li>
      {auth.isLoggedIn && (
        <li>
          <NavLink to={myplaceURL}>My Place</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/places/new">Add Place</NavLink>
        </li>
      )}
      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/auth">Authentication</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <Button onClick={auth.logout}>LogOut</Button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
