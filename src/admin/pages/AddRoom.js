import { useEffect, useRef, useState } from "react";
import { getToken, authorizeToken } from "../../utils/authorizeToken";
import { useNavigate } from "react-router-dom";
const token = getToken();

const AddRoom = (props) => {
  const navigate = useNavigate();
  const titleRef = useRef();
  const descRef = useRef();
  const priceRef = useRef();
  const maxPeopleRef = useRef();
  const roomRef = useRef();
  const [selectedHotel, setSelectedHotel] = useState();
  const [allHotels, setAllHotels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getAllHotels() {
      try {
        // Get all hotels
        setIsLoading(true);
        const res = await fetch(
          "https://hotel-booking-node-app.onrender.com/hotel-list",
          {
            headers: {
              Authorization: "Bearer " + token
            }
          }
        );

        if (!res.ok) {
          console.log("Couldn't fetch hotels.");
        }
        const allHotels = await res.json();
        setAllHotels(allHotels);
        setIsLoading(false);

        // Edit room case: set previously chosen fields
        if (props.roomData) {
          titleRef.current.value = props.roomData.title;
          descRef.current.value = props.roomData.desc;
          priceRef.current.value = props.roomData.price;
          maxPeopleRef.current.value = props.roomData.maxPeople;
          roomRef.current.value = props.roomData.roomNumbers.join(",");
          setSelectedHotel([]);
        }
      } catch (err) {}
    }
    getAllHotels();
  }, [props.roomData]);

  function onSelectHotel(e) {
    const options = [...e.target.options]
      .filter((opt) => opt.selected)
      .map((opt) => opt.value);
    setSelectedHotel(options[0]);
  }

  function resetForm() {
    titleRef.current.value = "";
    descRef.current.value = "";
    priceRef.current.value = "";
    maxPeopleRef.current.value = "";
    roomRef.current.value = "";
    setSelectedHotel([]);
  }

  async function onAddRoom(e) {
    try {
      e.preventDefault();
      const title = titleRef.current.value;
      const price = priceRef.current.value;
      const maxPeople = maxPeopleRef.current.value;
      const desc = descRef.current.value;
      const roomNumbers = [...roomRef.current.value.split(",")].map((str) =>
        Number(str.trim())
      );
      const hotel = selectedHotel;

      // Check if no field is missing
      // prettier-ignore
      if (!title || !desc|| !price || !roomNumbers || !maxPeople || !hotel) {
      window.alert("Please fill out all fields.");
      return null;
    }

      // prettier-ignore
      const newRoom = {title, price, maxPeople, desc, roomNumbers, hotel};
      // console.log(newRoom);

      // ADD NEW ROOM CASE
      let method = "POST";
      let room = { room: newRoom };

      if (props.roomData) {
        // UPDATE HOTEL CASE
        method = "PUT";
        room = { room: newRoom, roomId: props.roomData._id };
      }

      const res = await fetch(
        "https://hotel-booking-node-app.onrender.com/add-room",
        {
          method: method,
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token
          },
          body: JSON.stringify(room)
        }
      );

      if (!res.ok) {
        window.alert(
          `${
            method === "POST"
              ? "Couldn't add a new room."
              : "Couldn't update room."
          }`
        );
      }
      if (method === "POST") {
        window.alert("Room added.");
        resetForm();
        return;
      }
      props.finishEditing();
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="container">
      <div className="card card-body shadow-sm bg-body mb-3">
        <h2 className="fs-5 fw-normal">Add A New Room</h2>
      </div>
      <form>
        <div className="card card-body shadow-sm py-4 bg-body">
          <div className="row gy-3 gx-5">
            <div className="col-md-6">
              <label htmlFor="title" className="form-label">
                Title*
              </label>
              <input
                type="text"
                className="form-control border-0 border-bottom"
                id="title"
                name="title"
                placeholder="2 bed rooms"
                ref={titleRef}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="description" className="form-label">
                Description*
              </label>
              <input
                type="text"
                className="form-control border-0 border-bottom"
                id="description"
                name="description"
                placeholder="King size bed, 1 bathroom"
                ref={descRef}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="price" className="form-label">
                Price*
              </label>
              <input
                type="number"
                className="form-control border-0 border-bottom"
                id="price"
                name="price"
                min="0"
                placeholder="100"
                ref={priceRef}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="maxPeople" className="form-label">
                Max People*
              </label>
              <input
                type="number"
                className="form-control border-0 border-bottom"
                id="maxPeople"
                name="maxPeople"
                min="1"
                placeholder="2"
                ref={maxPeopleRef}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="rooms" className="form-label">
                Room Numbers*
              </label>
              <textarea
                type="text"
                className="form-control"
                id="rooms"
                name="rooms"
                placeholder="give comma between room numbers"
                ref={roomRef}
              />
            </div>

            <div className="col-md-6 d-flex flex-column">
              <label htmlFor="hotels" className="form-label">
                Choose a hotel*
              </label>
              {isLoading && <div>Loading...</div>}
              {!isLoading && allHotels && allHotels.length === 0 && (
                <div>No hotel was created. Please create new hotels.</div>
              )}
              <select
                name="hotels"
                id="hotels"
                className="btn border-secondary text-start"
                onChange={(e) => onSelectHotel(e)}
                value={selectedHotel}
              >
                <option label="Choose a hotel" hidden></option>
                {!isLoading &&
                  allHotels &&
                  allHotels.length > 0 &&
                  allHotels.map((hotel) => {
                    return (
                      <option
                        key={hotel._id}
                        value={hotel._id}
                        label={hotel.title}
                      ></option>
                    );
                  })}
              </select>
            </div>

            <div className="col-auto">
              <button
                className="btn btn-success px-5 mt-3"
                data-bs-dismiss="modal"
                onClick={(e) => onAddRoom(e)}
              >
                {props.roomData ? "Save Changes" : "Send"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddRoom;

export async function loader() {
  // Check token: users without token can't access
  authorizeToken();
  return null;
}
