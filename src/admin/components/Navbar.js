import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  function onLogout(e) {
    e.preventDefault();
    localStorage.removeItem("adminUser");
    localStorage.removeItem("adminToken");
    return navigate("/auth");
  }

  return (
    <div className="d-flex flex-column gap-3">
      <div className="d-flex flex-column gap-1">
        <div>MAIN</div>
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? "active-link" : undefined)}
        >
          <i className="bi bi-columns-gap me-1 ms-2"></i>
          <span>Dashboard</span>
        </NavLink>
      </div>

      <div className="d-flex flex-column gap-1">
        <div>LISTS</div>
        <NavLink
          to="/users"
          className={({ isActive }) => (isActive ? "active-link" : undefined)}
        >
          <i className="bi bi-person me-1 ms-2"></i>
          <span>Users</span>
        </NavLink>
        <NavLink
          to="/hotel-list"
          className={({ isActive }) => (isActive ? "active-link" : undefined)}
        >
          <i className="bi bi-shop me-1 ms-2"></i>
          <span>Hotels</span>
        </NavLink>
        <NavLink
          to="/room-list"
          className={({ isActive }) => (isActive ? "active-link" : undefined)}
        >
          <i className="bi bi-door-open me-1 ms-2"></i>
          <span>Rooms</span>
        </NavLink>
        <NavLink
          to="/transaction-list"
          className={({ isActive }) => (isActive ? "active-link" : undefined)}
        >
          <i className="bi bi-truck me-1 ms-2"></i>
          <span>Transactions</span>
        </NavLink>
      </div>

      <div className="d-flex flex-column gap-1">
        <div>NEW</div>
        <NavLink
          to="/add-hotel"
          className={({ isActive }) => (isActive ? "active-link" : undefined)}
        >
          <i className="bi bi-shop me-1 ms-2"></i>
          <span>New Hotel</span>
        </NavLink>
        <NavLink
          to="/add-room"
          className={({ isActive }) => (isActive ? "active-link" : undefined)}
        >
          <i className="bi bi-door-open me-1 ms-2"></i>
          <span>New Room</span>
        </NavLink>
      </div>

      <div className="d-flex flex-column gap-1">
        <div>USER</div>
        <NavLink
          to="/logout"
          className={({ isActive }) => (isActive ? "active-link" : undefined)}
          onClick={onLogout}
        >
          <i className="bi bi-box-arrow-right me-1 ms-2"></i>
          <span>Logout</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Navbar;
