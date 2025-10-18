import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import server from "./environment.js";
import { useState } from "react";
function Login() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [password, setPassword] = useState("");

  function emailChange(event) {
    setEmail(event.target.value);
  }
  function passwordChange(event) {
    setPassword(event.target.value);
  }
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const options = {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      };
      const response = await fetch(`${server}/api/auth/login`, options);
      if (response.ok) {
        const res = await response.json();
        localStorage.setItem("token", res.token);
        navigate("/");
        alert("Welcome on Grow AI");
      } else {
        const res = await response.json();
        alert(`Error: ${res.message}`);
        navigate("/auth/signup");
      }
    } catch (err) {
      alert(err.message);
    }
  };
  return (
    <>
      <div className={styles["bigbox"]}>
        <form onSubmit={handleSubmit}>
          <h2 style={{ color: "black" }}>Login</h2>
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
export default Login;
