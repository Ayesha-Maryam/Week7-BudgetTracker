import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "./Authentication.css";
import image from "./image.png";
import axios from "axios";

export default function SignUp({ login }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [budgetLimit, setBudgetLimit] = useState("");
  const handleSubmit = async(e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Incorrect Password");
    } 
    else {
      try
      {
        const response=await axios.get(`http://localhost:8080/budgetUser`, {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        })
        if(!response)
        {
          throw new Error("Error in geting data")
        }
        const existingUser = await response.data.find((u) => u.email === email);
      if (existingUser) {
        toast.error("User already exist. Please Sign in!");
        return;
        
      }

      }
      catch(error)
      {
        alert(error)
      }
      try{
        const response= await axios.post(`http://localhost:8080/budgetUser`,{
          firstName,
          lastName,
          email,
          password,
          confirmPassword,
          budgetLimit,
          entries: [],
        })
        if(!response)
        {
          throw new Error("Cannot Post Data")
        }
        login(response.data)
      }
      catch(error)
      {
        console.log(error)
      }
      
    }
  };
  return (
    <div className="container">
      <div className="signup">
        <div className="left-container">
          <h3>Start your journey with us</h3>
          <img src={image} />
        </div>
        <div className="right-container">
          <div className="form-content">
            <h3>Sign up</h3>
            <Link to="/signin">Already have an account?</Link>
            <form onSubmit={handleSubmit}>
              <div className="inputs">
                <input
                  value={firstName}
                  placeholder="First Name"
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
                <br />
                <input
                  value={lastName}
                  placeholder="Last Name"
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
                <br />
                <input
                  value={email}
                  type="email"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <br />
                <input
                  value={password}
                  type="password"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <br />
                <input
                  value={confirmPassword}
                  type="password"
                  placeholder="Confirm Password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <br />
                <input
                  value={budgetLimit}
                  type="number"
                  placeholder="Budget Limit"
                  min="1"
                  onChange={(e) => setBudgetLimit(e.target.value)}
                  required
                />
                <br />
              </div>
              <button className="btn" type="submit">
                Submit
              </button>
            </form>
            <ToastContainer />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SignIn({ login }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = async(e) => {
    e.preventDefault();
    try
      {
        const response=await axios.get(`http://localhost:8080/budgetUser`)
        if(!response)
        {
          throw new Error("Error in geting data")
        }
        const user =await(response.data).find(
      (u) => u.email === email && u.password === password
    );
    if (user) {
      login(user);
      toast.success("Login Successful");
    } else {
      toast.error("Invalid Email or Password");
    }
  }
  catch(error)
  {
    console.log(error)
  };
}
  return (
    <div className="container">
      <div className="signup">
        <div className="left-container">
          <h3>Start your journey with us</h3>
          <img src={image} />
        </div>
        <div className="right-container">
          <div className="form-content">
            <h3>Sign In</h3>
            <form onSubmit={handleSubmit}>
              <div className="inputs-signin">
                <input
                  placeholder="Enter Email"
                  value={email}
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  placeholder="Enter Password"
                  value={password}
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button className="btn" type="submit">
                Submit
              </button>
            </form>
            <ToastContainer />
          </div>
        </div>
      </div>
    </div>
  );
}
