import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import HomeIcon from "@mui/icons-material/Home";
import EventNoteIcon from "@mui/icons-material/EventNote";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

const Navbar = () => {
	const { user, setUser } = useContext(UserContext);
	const navigate = useNavigate();

	const handleLogout = () => {
		localStorage.clear();
		setUser(null);
		navigate("/");
	};

	if (!user) return null;

	return (
		<div className="flex items-center w-full bg-blue-600 text-white p-4">
			<div className="flex items-center mr-auto">
				<img
					src={
						user.picture ||
						"https://cdn-icons-png.flaticon.com/512/3247/3247933.png"
					}
					alt="User"
					className="w-12 h-12 rounded-full mr-4"
				/>
				<h2 className="text-lg font-semibold">{user.username}</h2>
			</div>
			<nav className="flex space-x-4">
				<Link
					to="/home"
					className="flex items-center py-2 px-4 hover:bg-blue-700 rounded"
				>
					<HomeIcon className="mr-2" />
					Home
				</Link>
				<Link
					to="/appointments"
					className="flex items-center py-2 px-4 hover:bg-blue-700 rounded"
				>
					<EventNoteIcon className="mr-2" />
					My Appointments
				</Link>
				<Link
					to="/account"
					className="flex items-center py-2 px-4 hover:bg-blue-700 rounded"
				>
					<AccountCircleIcon className="mr-2" />
					Account
				</Link>
				<button
					onClick={handleLogout}
					className="flex items-center py-2 px-4 hover:bg-blue-700 rounded"
				>
					<ExitToAppIcon className="mr-2" />
					Logout
				</button>
			</nav>
		</div>
	);
};

export default Navbar;
