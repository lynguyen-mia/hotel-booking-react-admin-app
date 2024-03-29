import { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import convertDates from "../../utils/convert-dates";
import { getToken, authorizeToken } from "../../utils/authorizeToken";
const token = getToken();

const Transaction = () => {
  const [curPage, setCurPage] = useState(1);
  const [transactionList, setTransactionList] = useState([]);
  const allTransactions = useLoaderData();
  // Each page has 9 results
  const totalPage = Math.ceil(allTransactions.length / 9);

  useEffect(() => {
    // Show only 9 first transaction
    setTransactionList(
      allTransactions.slice((curPage - 1) * 9, (curPage - 1) * 9 + 9)
    );
  }, [curPage, allTransactions]);

  function prevHandler() {
    setCurPage((prevCurPage) => {
      if (prevCurPage > 1) {
        return prevCurPage - 1;
      } else {
        return prevCurPage;
      }
    });
  }

  function nextHandler() {
    setCurPage((prevCurPage) => {
      if (prevCurPage < totalPage) {
        return prevCurPage + 1;
      } else {
        return prevCurPage;
      }
    });
  }

  return (
    <div className="card card-body shadow-sm py-4 bg-body">
      <h2 className="fs-5 fw-normal">Transaction List</h2>
      <div className="table-responsive">
        {allTransactions && allTransactions.length === 0 && (
          <p className="text-center fs-6">No transaction found.</p>
        )}
        {allTransactions && allTransactions.length > 0 && (
          <table
            className="table table-bordered align-middle pb-4 mt-2"
            style={{ fontSize: "13px" }}
          >
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
              {transactionList.map((t) => {
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
            {/* Pagination */}
            <caption>
              <div className="d-flex justify-content-end gap-3 mt-3 me-3">
                <div>{allTransactions.length === 0 && <div>0 rooms</div>}</div>
                <div>
                  {transactionList.length > 0
                    ? `${(curPage - 1) * 9 + 1}-${
                        (curPage - 1) * 9 + transactionList.length
                      } `
                    : `0-${transactionList.length} `}
                  of {allTransactions.length}
                </div>
                <button
                  className="border-0 bg-transparent text-secondary ms-2"
                  hidden={curPage === 1 ? true : false}
                >
                  <i
                    className="fa-solid fa-chevron-left"
                    style={{ transform: "scale(1.25)", color: "#495057" }}
                    onClick={prevHandler}
                  />
                </button>
                <button
                  className="border-0 bg-transparent text-secondary"
                  hidden={curPage === totalPage ? true : false}
                >
                  <i
                    className="fa-solid fa-chevron-right"
                    style={{ transform: "scale(1.25)", color: "#495057" }}
                    onClick={nextHandler}
                  ></i>
                </button>
              </div>
            </caption>
          </table>
        )}
      </div>
    </div>
  );
};

export default Transaction;

export async function loader() {
  // Check token: users without token can't access
  authorizeToken();
  // Get info board data
  const res = await fetch(
    "https://hotel-booking-node-app.onrender.com/all-transactions",
    {
      headers: { Authorization: "Bearer " + token }
    }
  );

  if (!res.ok) {
    console.log("Couldn't get all transactions.");
  }

  const data = await res.json();
  return data;
}
