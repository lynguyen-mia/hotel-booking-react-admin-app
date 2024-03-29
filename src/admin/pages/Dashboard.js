import { useLoaderData } from "react-router-dom";
import convertDates from "../../utils/convert-dates";
import { getToken, authorizeToken } from "../../utils/authorizeToken";

const Dashboard = () => {
  const dashboardInfo = useLoaderData();
  return (
    <div className="container">
      {/* Info board */}
      <div className="d-flex gap-3 mt-2 mb-4">
        <div className="card card-body shadow-sm bg-body pt-2 position-relative">
          <div className="text-secondary fs-6 mb-1">Users</div>
          <div className="fs-5">{dashboardInfo.users || 0}</div>
          <i className="bi bi-person position-absolute bottom-0 end-0 pe-2 pb-1 fs-5"></i>
        </div>
        <div className="card card-body shadow-sm bg-body fs-5 pt-2 position-relative">
          <div className="text-secondary fs-6 mb-1">Orders</div>
          <div className="fs-5">{dashboardInfo.orders || 0}</div>
          <i className="bi bi-cart3 position-absolute bottom-0 end-0 pe-2 pb-1"></i>
        </div>
        <div className="card card-body shadow-sm bg-body fs-5 pt-2 position-relative">
          <div className="text-secondary fs-6 mb-1">Earnings</div>
          <div className="fs-5">${dashboardInfo.earning || 0}</div>
          <i className="bi bi-coin position-absolute bottom-0 end-0 pe-2 pb-1"></i>
        </div>
        <div className="card card-body shadow-sm bg-body fs-5 pt-2 position-relative">
          <div className="text-secondary fs-6 mb-1">Balance</div>
          <div className="fs-5">${dashboardInfo.balance?.toFixed(2) || 0}</div>
          <i className="bi bi-wallet position-absolute bottom-0 end-0 pe-2 pb-1"></i>
        </div>
      </div>

      {/* Latest transactions */}
      <div className="card card-body shadow-sm py-4 bg-body">
        <h2 className="fs-5 fw-normal">Latest Transactions</h2>
        <div className="table-responsive">
          {dashboardInfo && dashboardInfo.latestTransactions.length === 0 && (
            <p className="text-center fs-6">No transaction found.</p>
          )}
          {dashboardInfo && dashboardInfo.latestTransactions.length > 0 && (
            <table
              className="table table-bordered align-middle pb-4 mt-2"
              style={{ fontSize: "13px" }}
            >
              <caption className="pt-4 text-end">
                1-{dashboardInfo.latestTransactions.length} of{" "}
                {dashboardInfo.latestTransactions.length}
              </caption>
              <thead>
                <tr>
                  <td>
                    <input type="checkbox" name="checkbox" />
                  </td>
                  <th>ID</th>
                  <th>User</th>
                  <th>Hotel</th>
                  <th>Room</th>
                  <th>Date</th>
                  <th>Price</th>
                  <th>Payment Method</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {dashboardInfo.latestTransactions.map((t) => {
                  const rooms = [];
                  t.room.forEach((room) =>
                    rooms.push(room.roomNumbers.toString())
                  );
                  const roomNums = rooms.join(", ");
                  return (
                    <tr key={t._id}>
                      <td>
                        <input type="checkbox" name="checkbox" />
                      </td>
                      <td>{t._id}</td>
                      <td>{t.user?.username}</td>
                      <td>{t.hotel.name}</td>
                      <td>{roomNums}</td>
                      <td>{`${convertDates(
                        new Date(t.dateStart)
                      )} - ${convertDates(new Date(t.dateEnd))}`}</td>
                      <td>${t.price}</td>
                      <td>{t.payment}</td>
                      <td>
                        <span className="bg-success py-1 px-2 rounded-2 text-light">
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

export async function loader() {
  // Check token: users without token can't access
  authorizeToken();
  // Get info board data
  const token = getToken();
  const res = await fetch(
    "https://hotel-booking-node-app.onrender.com/get-board-info",
    {
      headers: { Authorization: "Bearer " + token }
    }
  );

  if (!res.ok) {
    console.log("Couldn't get board information.");
  }

  const data = await res.json();
  return data;
}
