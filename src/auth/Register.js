import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import validation from "../utils/input-validation";

const Register = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const userNameRef = useRef();
  const fullNameRef = useRef();
  const phoneRef = useRef();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  async function onRegister(e) {
    e.preventDefault();
    setErrors({});

    const email = emailRef.current.value.trim().toLowerCase();
    const password = passwordRef.current.value.trim().toLowerCase();
    const username = userNameRef.current.value.trim().toLowerCase();
    const fullname = fullNameRef.current.value.trim().toLowerCase();
    const phone = phoneRef.current.value.trim();

    // Client-side validation
    const errors = validation(email, password);
    if (Object.keys(errors).length !== 0) {
      setErrors(errors);
      return;
    }

    // Send login data to database
    const loginData = { email, password, username, fullname, phone };
    const res = await fetch(
      "https://hotel-booking-node-app.onrender.com/admin-signup",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData)
      }
    );

    if (res.status === 401) {
      const err = await res.json();
      setErrors(err);
      return;
    }
    window.location.assign("/auth");
    return null;
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
          type="text"
          name="username"
          placeholder="Username*"
          className="border-light-subtle form-control"
          ref={userNameRef}
        />
        <input
          type="password"
          name="password"
          placeholder="Password* (must have at least 6 characters)"
          className="border-light-subtle form-control"
          ref={passwordRef}
        />
        <input
          type="text"
          name="fullname"
          placeholder="Fullname"
          className="border-light-subtle form-control"
          ref={fullNameRef}
        />
        <input
          type="number"
          name="phonenumer"
          placeholder="Phone number*"
          className="border-light-subtle form-control"
          ref={phoneRef}
        />

        <button
          className="btn btn-dark text-white pt-2 mt-3 w-100 rounded-1"
          onClick={onRegister}
        >
          Register
        </button>
      </form>
    </td>
  );
};
export default Register;
