import { useEffect, useState } from "react";
import { getToken, authorizeToken } from "../../utils/authorizeToken";
import { useLoaderData, Link, useNavigate } from "react-router-dom";
import AddRoom from "./AddRoom";
const token = getToken();

const RoomList = () => {
  const navigate = useNavigate();
  const [curPage, setCurPage] = useState(1);
  const [roomList, setRoomList] = useState([]);
  const [roomInfo, setRoomInfo] = useState([]);
  const allRoomList = useLoaderData();
  // Each page has 9 results
  const totalPage = Math.ceil(allRoomList.length / 9);

  useEffect(() => {
    // Show only 9 first room types
    setRoomList(allRoomList.slice((curPage - 1) * 9, (curPage - 1) * 9 + 9));
  }, [curPage, allRoomList]);

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

  async function onDeleteRoom(e, roomId) {
    e.preventDefault();
    const confirm = window.confirm("Do you want to delete this room?");
    if (confirm) {
      const res = await fetch(
        "https://hotel-booking-node-app.onrender.com/delete-room",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token
          },
          body: JSON.stringify({ id: roomId })
        }
      );

      if (!res.ok) {
        window.alert("Couldn't delete the room. This is a booked one.");
        return;
      }
      navigate("/room-list");
      return null;
    } else {
      return null;
    }
  }

  async function onEditRoom(e, roomId) {
    e.preventDefault();
    const res = await fetch(
      "https://hotel-booking-node-app.onrender.com/fetch-room",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify({ id: roomId })
      }
    );

    if (!res.ok) {
      console.log("Couldn't populate form");
    }
    const roomInfo = await res.json();
    setRoomInfo(roomInfo);
  }

  function doneEditing() {
    return navigate("/room-list");
  }

  return (
    <div className="container">
      <div className="card card-body shadow-sm py-4 bg-body">
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="fs-5 fw-normal">Room List</h2>
          <Link to="/add-room">
            <button className="btn btn-outline-success">Add New</button>
          </Link>
        </div>

        <div className="table-responsive mt-3">
          {allRoomList && allRoomList.length === 0 && (
            <p className="text-center fs-6">No room found.</p>
          )}
          {allRoomList && allRoomList.length > 0 && (
            <table
              className="table table-bordered align-middle pb-4"
              style={{ fontSize: "13px" }}
            >
              <thead>
                <tr>
                  <td>
                    <input type="checkbox" name="checkbox" />
                  </td>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th style={{ width: "100px" }}>Max People</th>
                  <th>Delete</th>
                  <th>Edit</th>
                </tr>
              </thead>
              <tbody>
                {roomList.map((room) => {
                  return (
                    <tr key={room._id}>
                      <td>
                        <input type="checkbox" name="checkbox" />
                      </td>
                      <td>{room._id}</td>
                      <td>{room.title}</td>
                      <td>{room.desc}</td>
                      <td>${room.price}</td>
                      <td style={{ width: "100px" }}>{room.maxPeople}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={(e) => onDeleteRoom(e, room._id)}
                        >
                          Delete
                        </button>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          data-bs-toggle="modal"
                          data-bs-target="#roomEdit"
                          onClick={(e) => onEditRoom(e, room._id)}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              {/* Pagination */}
              <caption>
                <div className="d-flex justify-content-end gap-3 mt-3 me-3">
                  <div>{allRoomList.length === 0 && <div>0 rooms</div>}</div>
                  <div>
                    {roomList.length > 0
                      ? `${(curPage - 1) * 9 + 1}-${
                          (curPage - 1) * 9 + roomList.length
                        } `
                      : `0-${roomList.length} `}
                    of {allRoomList.length}
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

        {/* Room Editing modal */}
        <div
          className="modal fade"
          id="roomEdit"
          tabIndex="-1"
          aria-labelledby="roomEdit"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Room</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <AddRoom roomData={roomInfo} finishEditing={doneEditing} />
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
    </div>
  );
};

export default RoomList;

export async function loader() {
  // Check token: users without token can't access
  authorizeToken();

  // Fetch all hotels
  const res = await fetch(
    "https://hotel-booking-node-app.onrender.com/room-list",
    {
      headers: { Authorization: "Bearer " + token }
    }
  );

  if (!res.ok) {
    console.log("Couldn't fetch hotel list.");
  }

  const roomList = await res.json();
  return roomList;
}
