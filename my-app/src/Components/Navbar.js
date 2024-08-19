import React, { useState } from "react";
import "./Navbar.css";
import budget from "./budget.png";
import profile from './profile.png'
import { Link } from "react-router-dom";

export default function Navbar( {currentUser, logout}) {
  const [show, setShow]=useState(false)
  return (
    <>
      <div className="navbar">
        <div className="icon-name">
          <div>
          <img className="icon" src={budget} />
          </div>
          <div className="heading">
          <p>Budget Tracker</p>
          </div>
        </div>
        <div className="profile">
          <img className="profile-img" src={profile}
          onClick={()=>setShow(!show)}
          />
        </div>
      </div>
      {show && (
        <>
        <div className="box">
        <div className="box-item">
          <p>
            {currentUser ? ( <p >
              <p>{currentUser.email}</p>
              <p onClick={()=>
                logout(setShow,show)
              }>Logout</p>
              </p> ): 
            (<Link to="/signin" style={{ textDecoration: 'none', color: 'inherit' }} onClick={()=>setShow(!show)}> SignIn</Link>)}
          </p>
        </div>
        </div>
        </>
      )}
    </>
  );
}
