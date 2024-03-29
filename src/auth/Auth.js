import { redirect } from "react-router-dom";
import { getToken } from "../utils/authorizeToken";
import Login from "./Login";
import Register from "./Register";
import { useState } from "react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="container-fluid mt-3">
      <table
        className="table"
        style={{ height: "100vh", backgroundColor: "transparent !important" }}
      >
        <tbody>
          <tr className="row">
            <td className="col col-2 border-2 border-top-0">
              <div
                className="fw-bold text-center fs-4"
                style={{ color: "#7950f2" }}
              >
                Admin Page
              </div>
            </td>
            <td className="col col-10 border-2 border-top-0 border-start-0"></td>
          </tr>

          <tr className="row h-100">
            <td className="col col-2 border-2 border-top-0 pt-4 d-flex flex-column align-items-center gap-3">
              <button
                className="btn text-white w-50"
                style={
                  isLogin
                    ? { backgroundColor: "#7950f2" }
                    : { backgroundColor: "#111" }
                }
                onClick={() => setIsLogin(true)}
              >
                Login
              </button>

              <button
                className="btn text-white w-50"
                style={
                  isLogin
                    ? { backgroundColor: "#111" }
                    : { backgroundColor: "#7950f2" }
                }
                onClick={() => setIsLogin(false)}
              >
                Register
              </button>
            </td>

            {isLogin ? <Login /> : <Register />}
          </tr>
        </tbody>
      </table>
    </div>
  );
};
export default Auth;

export function loader() {
  const token = getToken();
  if (token) {
    return redirect("/");
  }
  return null;
}
