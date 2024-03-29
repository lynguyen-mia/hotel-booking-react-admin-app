import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div>
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
              <td className="col col-10 border-2 border-top-0 border-start-0"></td>
            </tr>

            <tr className="row h-100">
              <td className="col col-2 border-2 border-top-0 border-bottom-0 pt-4 d-flex flex-column align-items-center gap-3">
                {/* Menu items here */}
              </td>
              <td className="col col-10">
                <h3 className="text-center my-5">Page Not Found.</h3>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default ErrorPage;
