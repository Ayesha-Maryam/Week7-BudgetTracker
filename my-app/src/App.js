import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import SignUp, { SignIn } from "./Components/Authentication";
import ShowBudget from "./Components/ShowBudget";
import axios from "axios";
import Navbar from "./Components/Navbar";

function App() {
  const [users, setUsers] = useState(null);
  const [entries, setEntries] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUser() {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (currentUser) {
        try {
          const response = await axios.get(
            `http://localhost:8080/budgetUser/${currentUser._id}`,
            {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json",
            }
            
          );
          const _response = await axios.get(
            `http://localhost:8080/budgetEntries/${currentUser._id}`,
            {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json",
            }
          )
          if (!response) {
            throw new Error("Cannot fetch Current User Data");
          }
          setEntries(_response.data || []);
          setUsers(currentUser);
        } catch (error) {
          console.log(error);
        }
      }
    }
    fetchUser();
  }, []);

  const handleLogin = async (userData) => {
    console.log("User Data:", userData);
    localStorage.setItem("currentUser", JSON.stringify(userData));
    setUsers(userData);
    try {
      const response = await axios.get(
        `http://localhost:8080/budgetUser/${userData._id}`
      );
      if (!response) {
        throw new Error("Cannot fetch Data");
      }
      const _response= await axios.get(`http://localhost:8080/budgetEntries/${userData._id}`)
      if (!_response) {
        throw new Error("Cannot fetch Data");
      }
      setEntries(_response.data || []);
    } catch (error) {
      console.log(error);
    }

    navigate("/");
  };

  const logOut = (setShow, show) => {
    localStorage.removeItem("currentUser");
    setUsers(null);
    setEntries([]);
    setShow(!show);
    navigate("/signup");
  };

  const addBudget = async (entry) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/budgetEntries`,
        {
          name: entry.name,
          price:entry.price,
          date: entry.date,
          userId: users._id
        }
      );
      if (!response) {
        throw new Error("Cannot fetch Data");
      }
      const _response = await axios.post(
        `http://localhost:8080/budgetEntries/${users._id}`
      );
      setEntries(_response.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  

  return (
    <>
    <Navbar currentUser={users} logout={logOut}/>
      <Routes>
      <Route
          path="/"
          element={
            users ? (
              <>
                <ShowBudget
                  addBudget={addBudget}
                  users={users}
                  limit={users.budgetLimit}
                  entries={entries}
                  setEntries={setEntries}
                />
              </>
            ) : (
              <SignIn login={handleLogin} />
            )
          }
        />
        <Route path="/signin" element={<SignIn login={handleLogin} />} />
        <Route path="/signup" element={<SignUp login={handleLogin} />} />
        <Route path="/logout" element={logOut} />
        
      </Routes>
    </>
  );
}

export default App;
