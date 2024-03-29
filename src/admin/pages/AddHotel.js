import { useEffect, useRef, useState } from "react";
import { getToken, authorizeToken } from "../../utils/authorizeToken";
const token = getToken();

const AddHotel = (props) => {
  const nameRef = useRef();
  const typeRef = useRef();
  const cityRef = useRef();
  const addressRef = useRef();
  const distanceRef = useRef();
  const titleRef = useRef();
  const descRef = useRef();
  const cheapestPriceRef = useRef();
  const photosRef = useRef();
  const featuredRef = useRef();
  const [allRoomTypes, setAllRoomTypes] = useState([]);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getAllRoomTypes() {
      try {
        // Get all room types
        setIsLoading(true);
        const res = await fetch(
          "https://hotel-booking-node-app.onrender.com/room-list",
          {
            headers: {
              Authorization: "Bearer " + token
            }
          }
        );

        if (!res.ok) {
          console.log("Couldn't fetch rooms.");
        }
        const allRooms = await res.json();
        setAllRoomTypes(allRooms);
        setIsLoading(false);

        // Edit hotel case: set previously chosen fields
        if (props.hotelData) {
          nameRef.current.value = props.hotelData.name;
          typeRef.current.value = props.hotelData.type;
          cityRef.current.value = props.hotelData.city;
          addressRef.current.value = props.hotelData.address;
          distanceRef.current.value = props.hotelData.distance;
          titleRef.current.value = props.hotelData.title;
          descRef.current.value = props.hotelData.desc;
          cheapestPriceRef.current.value = props.hotelData?.cheapestPrice;
          photosRef.current.value = props.hotelData.photos?.join("\n");
          featuredRef.current.value = props.hotelData.featured;
          setSelectedRooms(props.hotelData.rooms); // a list of room ids
        }
      } catch (err) {
        console.log(err);
      }
    }
    getAllRoomTypes();
  }, [props.hotelData]);

  function onSelectRooms(e) {
    const options = [...e.target.options]
      .filter((opt) => opt.selected)
      .map((opt) => opt.value);
    setSelectedRooms(options);
  }

  function resetForm() {
    nameRef.current.value = "";
    typeRef.current.value = "";
    cityRef.current.value = "";
    addressRef.current.value = "";
    distanceRef.current.value = "";
    titleRef.current.value = "";
    descRef.current.value = "";
    cheapestPriceRef.current.value = "";
    photosRef.current.value = "";
    featuredRef.current.value = "No";
    setSelectedRooms([]);
  }

  async function onAddHotel(e) {
    e.preventDefault();
    const name = nameRef.current.value;
    const type = typeRef.current.value;
    const city = cityRef.current.value;
    const address = addressRef.current.value;
    const distance = distanceRef.current.value;
    const title = titleRef.current.value;
    const desc = descRef.current.value;
    const cheapestPrice = cheapestPriceRef.current.value;
    // \s+ one or more whitespace characters (including space, tab, and newline)]
    const photos = [...photosRef.current.value.split(/\s+/)];
    const featured = featuredRef.current.value;
    const rooms = selectedRooms || [];

    // Check if no field is missing
    // prettier-ignore
    if (!name || !type || !city || !address || !distance || !title || !desc|| !cheapestPrice || !photos || !featured || !rooms) {
      window.alert("Please fill out all fields.");
      return null;
    }

    // prettier-ignore
    const newHotel = {name, type, city, address, distance, title, desc, cheapestPrice, photos, featured, rooms};
    // console.log(newHotel);

    // ADD NEW HOTEL CASE
    let method = "POST";
    let hotel = { hotel: newHotel };
    if (props.hotelData) {
      // UPDATE HOTEL CASE
      method = "PUT";
      hotel = { hotel: newHotel, hotelId: props.hotelData._id };
    }

    const res = await fetch(
      "https://hotel-booking-node-app.onrender.com/add-hotel",
      {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify(hotel)
      }
    );

    if (!res.ok) {
      window.alert(
        `${
          method === "POST"
            ? "Couldn't add a new hotel."
            : "Couldn't update hotel."
        }`
      );
    }
    if (method === "POST") {
      window.alert("Hotel added.");
      resetForm();
      return;
    }
    props.finishEditing();
  }

  return (
    <div className="container">
      <div className="card card-body shadow-sm bg-body mb-3">
        <h2 className="fs-5 fw-normal">Add A New Hotel</h2>
      </div>
      <form>
        <div className="card card-body shadow-sm py-4 bg-body">
          <div className="row gy-3 gx-5">
            <div className="col-md-6">
              <label htmlFor="name" className="form-label">
                Name*
              </label>
              <input
                type="text"
                className="form-control border-0 border-bottom"
                id="name"
                name="name"
                placeholder="My Hotel"
                ref={nameRef}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="type" className="form-label">
                Type*
              </label>
              <input
                type="text"
                className="form-control border-0 border-bottom"
                id="type"
                name="type"
                placeholder="Type"
                ref={typeRef}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="city" className="form-label">
                City*
              </label>
              <input
                type="text"
                className="form-control border-0 border-bottom"
                id="city"
                name="city"
                placeholder="New York"
                ref={cityRef}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="address" className="form-label">
                Address*
              </label>
              <input
                type="text"
                className="form-control border-0 border-bottom"
                id="address"
                name="address"
                placeholder="elton st, 216"
                ref={addressRef}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="distance" className="form-label">
                Distance from City Center*
              </label>
              <input
                type="text"
                className="form-control border-0 border-bottom"
                id="distance"
                name="distance"
                placeholder="500"
                ref={distanceRef}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="title" className="form-label">
                Title*
              </label>
              <input
                type="text"
                className="form-control border-0 border-bottom"
                id="title"
                name="title"
                placeholder="The best Hotel"
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
                placeholder="Description"
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
                placeholder="100"
                ref={cheapestPriceRef}
              />
            </div>

            <div className="col-md-10">
              <label htmlFor="images" className="form-label">
                Images*
              </label>
              <textarea
                type="text"
                className="form-control"
                id="images"
                name="images"
                placeholder="Please put each image in a line"
                ref={photosRef}
                style={{ height: "100px" }}
              />
            </div>

            <div className="col-auto">
              <label htmlFor="featured" className="form-label">
                Featured*
              </label>
              <select
                className="form-select"
                id="featured"
                name="featured"
                ref={featuredRef}
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>

            <div className="col-md-12">
              <label htmlFor="rooms" className="form-label">
                Rooms*
              </label>
              {isLoading && <div>Loading...</div>}
              {!isLoading && allRoomTypes && allRoomTypes.length === 0 && (
                <div>No room was created. Please create new rooms.</div>
              )}
              <select
                name="rooms"
                id="rooms"
                className="form-select"
                onChange={(e) => onSelectRooms(e)}
                value={selectedRooms}
                multiple
              >
                {!isLoading &&
                  allRoomTypes &&
                  allRoomTypes.length > 0 &&
                  allRoomTypes.map((roomType) => {
                    return (
                      <option
                        key={roomType._id}
                        value={roomType._id}
                        label={roomType.title}
                      />
                    );
                  })}
              </select>
            </div>

            <div className="col-auto">
              <button
                className="btn btn-success px-5 mt-3"
                data-bs-dismiss="modal"
                onClick={(e) => onAddHotel(e)}
              >
                {props.hotelData ? "Save Changes" : "Send"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddHotel;

export async function loader() {
  // Check token: users without token can't access
  authorizeToken();
  return null;
}
