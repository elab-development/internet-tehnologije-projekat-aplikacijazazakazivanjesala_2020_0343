import React, { useState, useContext } from "react";
import { TextField, MenuItem, Button } from "@mui/material";
import axios from "../api/axios";
import { UserContext } from "../context/UserContext";

const ReservationFilter = ({ rooms, onFilter, onReset }) => {
	const user = JSON.parse(localStorage.getItem("user"));

	const [filters, setFilters] = useState({
		room_id: "",
		capacity: "",
		title: "",
		start_date: "",
		end_date: "",
		start_time: "",
		end_time: "",
	});

	const handleChange = (field, value) => {
		setFilters(prevFilters => ({
			...prevFilters,
			[field]: value,
		}));
	};
	console.log(filters);
	const handleFilter = async () => {
		try {
			const filtersWithValues = Object.fromEntries(
				Object.entries(filters).filter(([key, value]) => value !== "")
			);
			const response = await axios.get("/reservations/filter", {
				params: filtersWithValues,
				headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
			});
			onFilter(response.data);
		} catch (error) {
			console.error("Error fetching filtered reservations:", error);
		}
	};

	const handleReset = () => {
		setFilters({
			room_id: "",
			capacity: "",
			title: "",
			start_date: "",
			end_date: "",
			start_time: "",
			end_time: "",
		});
		onReset();
	};

	return (
		<div className="flex flex-wrap gap-4 mb-4">
			<TextField
				label="Title"
				value={filters.title}
				onChange={e => handleChange("title", e.target.value)}
				className="w-40"
			/>
			<TextField
				label="Room"
				select
				value={filters.room_id}
				onChange={e => handleChange("room_id", e.target.value)}
				className="w-40"
			>
				{rooms.map(room => (
					<MenuItem key={room.id} value={room.id}>
						{room.name}
					</MenuItem>
				))}
			</TextField>
			<TextField
				label="Capacity"
				type="number"
				value={filters.capacity}
				onChange={e => handleChange("capacity", e.target.value)}
				className="w-40"
			/>

			<TextField
				label="Start Date"
				type="date"
				value={filters.start_date}
				onChange={e => handleChange("start_date", e.target.value)}
				className="w-40"
				InputLabelProps={{
					shrink: true,
				}}
			/>
			<TextField
				label="End Date"
				type="date"
				value={filters.end_date}
				onChange={e => handleChange("end_date", e.target.value)}
				className="w-40"
				InputLabelProps={{
					shrink: true,
				}}
			/>
			<TextField
				label="Start Time"
				type="time"
				value={filters.start_time}
				onChange={e => handleChange("start_time", e.target.value)}
				className="w-40"
				InputLabelProps={{
					shrink: true,
				}}
			/>
			<TextField
				label="End Time"
				type="time"
				value={filters.end_time}
				onChange={e => handleChange("end_time", e.target.value)}
				className="w-40"
				InputLabelProps={{
					shrink: true,
				}}
			/>
			<Button variant="contained" color="primary" onClick={handleFilter}>
				Filter
			</Button>
			<Button variant="outlined" color="secondary" onClick={handleReset}>
				Reset
			</Button>
		</div>
	);
};

export default ReservationFilter;
