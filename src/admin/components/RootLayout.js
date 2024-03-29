import { Link, Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const RootLayout = () => {
  // Get current logged-in user
  const adminUserJSON = localStorage.getItem("adminUser");
  const adminUser = JSON.parse(adminUserJSON);

  return (
    <div className="container-fluid mt-3">
      <table
        className="table"
        style={{ height: "100vh", backgroundColor: "transparent !important" }}
      >
        <tbody>
          <tr className="row">
            <td className="col col-2 border-2 border-top-0">
              <Link to="/">
                <div
                  className="fw-bold text-center fs-4"
                  style={{ color: "#7950f2" }}
                >
                  Admin Page
                </div>
              </Link>
            </td>
            <td className="col col-10 border-2 border-top-0 border-start-0 border-end-0 text-end pe-4">
              {adminUser && <div>{adminUser.email}</div>}
            </td>
          </tr>

          <tr className="row h-100">
            <td className="col col-2 border-2 border-top-0 border-bottom-0 pt-4 d-flex flex-column align-items-center gap-3">
              <Navbar />
            </td>
            <td className="col col-10">
              <Outlet />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default RootLayout;
