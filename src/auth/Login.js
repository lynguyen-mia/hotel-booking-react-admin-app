import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import validation from "../utils/input-validation";

const Login = () => {
  const navigate = useNavigate();
  const emailRef = useRef();
  const passwordRef = useRef();
  const [errors, setErrors] = useState({});

  async function onLogin(e) {
    e.preventDefault();
    setErrors({});

    const email = emailRef.current.value.trim().toLowerCase();
    const password = passwordRef.current.value.trim().toLowerCase();
    const loginData = { email, password };

    // Client-side validation
    const errors = validation(email, password);
    if (Object.keys(errors).length !== 0) {
      setErrors(errors);
      return;
    }

    // Send login data to backend
    const res = await fetch(
      "https://hotel-booking-node-app.onrender.com/admin-login",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(loginData)
      }
    );

    if (res.status === 401) {
      const err = await res.json();
      setErrors(err);
      return;
    }
    const data = await res.json();

    // Save token to local storage
    localStorage.setItem("adminUser", JSON.stringify(data.adminUser));
    localStorage.setItem("adminToken", JSON.stringify(data.adminToken));
    // Force to reload
    return window.location.assign("/");
  }

  return (
    <td className="col col-10 d-flex flex-column text-center mt-5">
      {/* Show errors if any */}
      <ul className="ps-0 list-unstyled text-danger">
        {errors && Object.values(errors).map((err) => <li key={err}>{err}</li>)}
      </ul>

      <form
        className="container d-flex flex-column gap-2"
        style={{ width: "450px" }}
      >
        <input
          type="email"
          name="email"
          placeholder="Email*"
          className="border-light-subtle form-control"
          ref={emailRef}
        />
        <input
          type="password"
          name="password"
          placeholder="Password* (must have at least 6 characters)"
          className="border-light-subtle form-control"
          ref={passwordRef}
        />

        <button
          type="submit"
          className="btn btn-dark text-white pt-2 mt-3 w-100 rounded-1"
          onClick={onLogin}
        >
          Login
        </button>
      </form>
    </td>
  );
};
export default Login;
