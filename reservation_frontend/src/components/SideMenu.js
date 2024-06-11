// src/components/SideMenu.js
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import HomeIcon from "@mui/icons-material/Home";
import EventNoteIcon from "@mui/icons-material/EventNote";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

const SideMenu = () => {
	const { user, setUser } = useContext(UserContext);
	const navigate = useNavigate();

	const handleLogout = () => {
		localStorage.clear();
		setUser(null);
		navigate("/");
	};

	if (!user) return null;

	return (
		<div className="flex flex-col items-center w-64 bg-gray-800 text-white min-h-screen p-4">
			<div className="flex flex-col items-center mb-8">
				<img
					src={user.picture || "https://via.placeholder.com/150"}
					alt="User"
					className="w-24 h-24 rounded-full mb-4"
				/>
				<h2 className="text-lg font-semibold">{user.username}</h2>
			</div>
			<nav className="flex flex-col w-full">
				<Link
					to="/home"
					className="flex items-center py-2 px-4 hover:bg-gray-700 rounded"
				>
					<HomeIcon className="mr-3" />
					Home
				</Link>
				<Link
					to="/appointments"
					className="flex items-center py-2 px-4 hover:bg-gray-700 rounded"
				>
					<EventNoteIcon className="mr-3" />
					My Appointments
				</Link>
				<Link
					to="/account"
					className="flex items-center py-2 px-4 hover:bg-gray-700 rounded"
				>
					<AccountCircleIcon className="mr-3" />
					Account
				</Link>
				<button
					onClick={handleLogout}
					className="flex items-center py-2 px-4 hover:bg-gray-700 rounded mt-auto"
				>
					<ExitToAppIcon className="mr-3" />
					Logout
				</button>
			</nav>
		</div>
	);
};

export default SideMenu;
