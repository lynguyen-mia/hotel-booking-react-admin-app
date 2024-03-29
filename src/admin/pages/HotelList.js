import { useState } from "react";
import { getToken, authorizeToken } from "../../utils/authorizeToken";
import { useLoaderData, Link, useNavigate } from "react-router-dom";
import AddHotel from "./AddHotel";
const token = getToken();

const HotelList = () => {
  const navigate = useNavigate();
  const hotelList = useLoaderData();
  const [hotelInfo, setHotelInfo] = useState({});
  // console.log(hotelList);

  async function onDeleteHotel(e, hotelId) {
    e.preventDefault();
    const confirm = window.confirm("Do you want to delete this hotel?");
    if (confirm) {
      const res = await fetch(
        "https://hotel-booking-node-app.onrender.com/delete-hotel",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token
          },
          body: JSON.stringify({ id: hotelId })
        }
      );

      if (!res.ok) {
        window.alert("Couldn't delete the hotel. This is a booked one.");
        return;
      }
      return navigate("/hotel-list");
    } else {
      return;
    }
  }

  async function onEditHotel(e, hotelId) {
    e.preventDefault();
    const res = await fetch(
      "https://hotel-booking-node-app.onrender.com/fetch-hotel",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify({ id: hotelId })
      }
    );

    if (!res.ok) {
      console.log("Couldn't populate form");
    }
    const hotelInfo = await res.json();
    setHotelInfo(hotelInfo);
  }

  function doneEditing() {
    return navigate("/hotel-list");
  }

  return (
    <div className="container">
      <div className="card card-body shadow-sm py-4 bg-body">
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="fs-5 fw-normal">Hotel List</h2>
          <Link to="/add-hotel">
            <button className="btn btn-outline-success">Add New</button>
          </Link>
        </div>

        <div className="table-responsive mt-3">
          {hotelList && hotelList.length === 0 && (
            <p className="text-center fs-6">No hotel found.</p>
          )}
          {hotelList && hotelList.length > 0 && (
            <table
              className="table table-bordered align-middle pb-4"
              style={{ fontSize: "13px" }}
            >
              <caption className="pt-4 text-end">
                Total {hotelList.length} hotels
              </caption>
              <thead>
                <tr>
                  <td>
                    <input type="checkbox" name="checkbox" />
                  </td>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Title</th>
                  <th>City</th>
                  <th>Delete</th>
                  <th>Edit</th>
                </tr>
              </thead>
              <tbody>
                {hotelList.map((hotel) => {
                  return (
                    <tr key={hotel._id}>
                      <td>
                        <input type="checkbox" name="checkbox" />
                      </td>
                      <td>{hotel._id}</td>
                      <td>{hotel.name}</td>
                      <td>{hotel.type}</td>
                      <td>{hotel.title}</td>
                      <td>{hotel.city}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={(e) => onDeleteHotel(e, hotel._id)}
                        >
                          Delete
                        </button>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          data-bs-toggle="modal"
                          data-bs-target="#hotelEdit"
                          onClick={(e) => onEditHotel(e, hotel._id)}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Hotel Editing modal */}
      <div
        className="modal fade"
        id="hotelEdit"
        tabIndex="-1"
        aria-labelledby="hotelEdit"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Hotel</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <AddHotel hotelData={hotelInfo} finishEditing={doneEditing} />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelList;

export async function loader() {
  // Check token: users without token can't access
  authorizeToken();

  // Fetch all hotels
  const res = await fetch(
    "https://hotel-booking-node-app.onrender.com/hotel-list",
    {
      headers: { Authorization: "Bearer " + token }
    }
  );

  if (!res.ok) {
    console.log("Couldn't fetch hotel list.");
  }

  const hotelList = await res.json();
  return hotelList;
}
