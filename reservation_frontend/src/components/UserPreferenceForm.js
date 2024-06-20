import React, { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import axios from "../api/axios";
import { TextField, Button } from "@mui/material";

const UserPreferencesForm = ({ onPreferencesSubmit }) => {
	const [preferences, setPreferences] = useState({
		capacity: "",
		date: "",
	});

	const handleChange = e => {
		const { name, value } = e.target;
		setPreferences(prev => ({ ...prev, [name]: value }));
	};

	const handleSubmit = e => {
		e.preventDefault();
		onPreferencesSubmit(preferences);
		setPreferences({
			capacity: "",
			date: "",
		});
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div>
				<TextField
					label="Preferred room capacity"
					type="number"
					name="capacity"
					value={preferences.capacity}
					onChange={handleChange}
					fullWidth
				/>
			</div>
			<div>
				<TextField
					label="Preferred Date"
					type="date"
					name="date"
					value={preferences.date}
					onChange={handleChange}
					InputLabelProps={{ shrink: true }}
					fullWidth
				/>
			</div>
			<Button type="submit" variant="contained" color="primary" fullWidth>
				Submit Preferences
			</Button>
		</form>
	);
};

export default UserPreferencesForm;
