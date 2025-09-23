import React from "react";
import { Link } from "react-router-dom";
// optional custom styling

const Logo = ({ mobile }) => {
  return (
    <Link to="/">
      <img
        src={mobile ? "/retrologo-mobile.png" : "/retrologo.png"}
        alt="Logo"
        className={mobile ? "uc-logo-mobile" : "uc-logo"}
      />
    </Link>
  );
};

export default Logo;
