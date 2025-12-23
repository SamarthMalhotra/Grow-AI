import { useNavigate, Link } from "react-router-dom";
import styles from "./Login.module.css";
import server from "./environment.js";
import { useState, useContext } from "react";
import { MyContext } from "./MyContext";
import { FadeLoader } from "react-spinners";
function Login() {
  const [email, setEmail] = useState("");
  const [contrast, setContrast] = useState(false);
  const navigate = useNavigate();
  const [password, setPassword] = useState("");

  const { setCheckAuth } = useContext(MyContext);
  function emailChange(event) {
    setEmail(event.target.value);
  }
  function passwordChange(event) {
    setPassword(event.target.value);
  }
  const handleSubmit = async (event) => {
    event.preventDefault();
    setContrast(true);
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
        setCheckAuth(false);
        const res = await response.json();
        localStorage.setItem("token", res.token);
        navigate("/");
        alert("Welcome on Grow AI");
      } else {
        const res = await response.json();
        if (res.message === "Incorrect Password") {
          alert(`Error: ${res.message}` + " Try Again");
          navigate("/auth/login");
        } else {
          alert(`Error: ${res.message}` + " Sign Up First");
          navigate("/auth/signup");
        }
      }
      setContrast(false);
      setEmail("");
      setPassword("");
    } catch (err) {
      alert(err.message);
      navigate("/");
    }
  };
  return (
    <>
      {contrast && (
        <div className={styles["loader"]}>
          <FadeLoader height={30}></FadeLoader>{" "}
        </div>
      )}
      {!contrast && (
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
                <button
                  type="submit"
                  className={contrast ? styles["contrast"] : ""}
                >
                  {" "}
                  Submit
                </button>
              </div>
              <div style={{ marginTop: "10px" }}>
                <span style={{ color: "black" }}>
                  New user can go for signup
                </span>
                <Link
                  to="/auth/signup"
                  style={{ color: "red", fontWeight: "bold" }}
                >
                  &nbsp;Signup
                </Link>
              </div>
            </form>
          </div>
        </>
      )}
    </>
  );
}
export default Login;
