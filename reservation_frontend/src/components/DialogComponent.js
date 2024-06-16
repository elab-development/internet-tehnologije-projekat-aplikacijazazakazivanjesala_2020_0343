import React, { useState, useContext, useEffect } from "react";
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	Button,
	MenuItem,
} from "@mui/material";
import { UserContext } from "../context/UserContext";
import axios from "../api/axios";
import { notifySuccess, notifyError } from "../utils/Utils";
import moment from "moment";

const DialogComponent = ({
	open,
	onClose,
	onSuccess,
	rooms,
	reservation,
	update,
}) => {
	const user = JSON.parse(localStorage.getItem("user"));
	const [reservationData, setReservationData] = useState({
		user_id: user?.id,
		room_id: "",
		title: "",
		description: "",
		date: "",
		start_time: "",
		end_time: "",
		status: "pending",
	});
	useEffect(() => {
		if (update) {
			setReservationData({
				user_id: user?.id,
				room_id: reservation.room_id || "",
				title: reservation.title || "",
				description: reservation.description || "",
				date: reservation.date || "",
				start_time: reservation.start_time || "",
				end_time: reservation.end_time || "",
				status: reservation.status || "pending",
			});
		} else {
			setReservationData({
				user_id: user?.id,
				room_id: "",
				title: "",
				description: "",
				date: "",
				start_time: "",
				end_time: "",
				status: "pending",
			});
		}
	}, [reservation]);

	const handleReserve = async () => {
		try {
			if (update) {
				await axios.put(`/reservations/${reservation?.id}`, reservationData, {
					headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
				});
			} else {
				await axios.post(`/reservations`, reservationData, {
					headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
				});
			}
			notifySuccess(
				`Reservation ${update ? "updated" : "created"} successfully!`
			);
			onSuccess();
			onClose();
		} catch (error) {
			notifyError(error?.response?.data?.error);
		}
	};
	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle className="text-center">
				{update ? "Edit Reservation" : "Add New Reservation"}
			</DialogTitle>
			<DialogContent>
				<TextField
					autoFocus
					margin="dense"
					label="Title"
					type="text"
					fullWidth
					value={reservationData.title}
					onChange={e =>
						setReservationData({ ...reservationData, title: e.target.value })
					}
				/>
				<TextField
					margin="dense"
					label="Description"
					type="text"
					fullWidth
					value={reservationData.description}
					onChange={e =>
						setReservationData({
							...reservationData,
							description: e.target.value,
						})
					}
				/>
				<TextField
					margin="dense"
					placeholder=""
					type="date"
					fullWidth
					value={reservationData.date}
					onChange={e =>
						setReservationData({ ...reservationData, date: e.target.value })
					}
				/>
				<TextField
					margin="dense"
					type="time"
					fullWidth
					value={reservationData.start_time}
					onChange={e =>
						setReservationData({
							...reservationData,
							start_time: e.target.value + ":00",
						})
					}
				/>
				<TextField
					margin="dense"
					type="time"
					fullWidth
					value={reservationData.end_time}
					onChange={e =>
						setReservationData({
							...reservationData,
							end_time: e.target.value + ":00",
						})
					}
				/>
				<TextField
					margin="dense"
					label="Room"
					select
					fullWidth
					value={reservationData.room_id}
					onChange={e =>
						setReservationData({ ...reservationData, room_id: e.target.value })
					}
				>
					{rooms.map(room => (
						<MenuItem key={room.id} value={room.id}>
							{room.name}
						</MenuItem>
					))}
				</TextField>
			</DialogContent>
			<DialogActions className="">
				<Button onClick={onClose} color="secondary">
					Cancel
				</Button>
				<Button onClick={handleReserve} color="primary">
					{update ? "Update" : "Reserve"}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default DialogComponent;
