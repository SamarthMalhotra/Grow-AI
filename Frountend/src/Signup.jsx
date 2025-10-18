import { useState } from "react";
import { useNavigate } from "react-router-dom";
import server from "./environment.js";
import styles from "./Signup.module.css";
function Signup() {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const userFieldChange = (event) => {
    setUserName(event.target.value);
  };
  const emailChange = (event) => {
    setEmail(event.target.value);
  };
  const passwordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
      }),
    };
    setEmail("");
    setPassword("");
    setUserName("");
    try {
      const response = await fetch(`${server}/api/auth/signup`, options);
      if (response.ok) {
        let data = await response.json();
        // Example frontend response handler
        localStorage.setItem("token", data.token);
        // navigate to home
        navigate("/");
      } else {
        let data = await response.json();
        console.log(data);
        navigate("/auth/signup");
        alert(`Sorry Try Again  ${data.message}`);
      }
      // Code is Remaining
    } catch (err) {
      console.log(`Error : ${err}`);
    }
  };
  return (
    <>
      <div className={styles["bigbox"]}>
        <form className={styles["box"]} onSubmit={handleSubmit}>
          <h2 style={{ color: "black" }}>Sign Up</h2>

          <div className={styles["inputBox"]}>
            {" "}
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              placeholder="Username"
              id="username"
              value={username}
              onChange={userFieldChange}
              required
            ></input>
          </div>
          <br />
          <div className={styles["inputBox"]}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              placeholder="enter correct email"
              id="email"
              value={email}
              onChange={emailChange}
              required
            ></input>
          </div>
          <br />
          <div className={styles["inputBox"]}>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              placeholder="Password"
              id="password"
              value={password}
              onChange={passwordChange}
              required
            ></input>
          </div>
          <br />
          <div className={styles["submitButt"]}>
            <button type="submit"> Submit</button>
          </div>
        </form>
      </div>
    </>
  );
}

export default Signup;
