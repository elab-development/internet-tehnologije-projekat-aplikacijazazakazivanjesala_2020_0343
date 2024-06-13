import React, { useEffect, useState, useContext } from "react";
import axios from "../api/axios";
import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { UserContext } from "../context/UserContext";
import SideMenu from "../components/SideMenu";
import { Button } from "@mui/material";
import DialogComponent from "../components/DialogComponent";

const localizer = momentLocalizer(moment);

const Home = () => {
	const [events, setEvents] = useState([]);
	const [resources, setResources] = useState([]);
	const [rooms, setRooms] = useState([]);
	const { user } = useContext(UserContext);
	const [dialogOpen, setDialogOpen] = useState(false);

	const handleDialogOpen = () => {
		setDialogOpen(true);
	};

	const handleDialogClose = () => {
		setDialogOpen(false);
	};

	const handleDialogSuccess = async () => {
		try {
			const reservationsRes = await axios.get("/reservations", {
				headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
			});

			const reservations = reservationsRes.data;
			const events = reservations.map(reservation => ({
				id: reservation.id,
				title: reservation.title,
				start: moment(
					`${reservation.date} ${reservation.start_time}`,
					"YYYY-MM-DD HH:mm:ss"
				).toDate(),
				end: moment(
					`${reservation.date} ${reservation.end_time}`,
					"YYYY-MM-DD HH:mm:ss"
				).toDate(),
				resourceId: reservation.room_id,
			}));

			setEvents(events);
		} catch (error) {
			console.error("Error fetching reservations:", error);
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [roomTypesRes, reservationsRes, roomsRes] = await Promise.all([
					axios.get("/room-types", {
						headers: {
							Authorization: `Bearer ${localStorage.getItem("token")}`,
						},
					}),
					axios.get("/reservations", {
						headers: {
							Authorization: `Bearer ${localStorage.getItem("token")}`,
						},
					}),
					axios.get("/rooms", {
						headers: {
							Authorization: `Bearer ${localStorage.getItem("token")}`,
						},
					}),
				]);

				const roomTypes = roomTypesRes.data;
				const reservations = reservationsRes.data;
				const rooms = roomsRes.data;

				const events = reservations.map(reservation => ({
					id: reservation.id,
					title: reservation.title,
					start: moment(
						`${reservation.date} ${reservation.start_time}`,
						"YYYY-MM-DD HH:mm:ss"
					).toDate(),
					end: moment(
						`${reservation.date} ${reservation.end_time}`,
						"YYYY-MM-DD HH:mm:ss"
					).toDate(),
					resourceId: reservation.room_id,
				}));

				console.log(events);

				setResources(roomTypes);
				setEvents(events);
				setRooms(rooms);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData();
	}, []);

	return (
		<div className="glavniDiv">
			<Button
				variant="contained"
				color="primary"
				onClick={handleDialogOpen}
				className="mb-4"
			>
				Add New Reservation
			</Button>
			<Calendar
				className="aa"
				min={new Date(0, 0, 0, 8, 0, 0)}
				max={new Date(0, 0, 0, 23, 0, 0)}
				localizer={localizer}
				events={events}
				resources={rooms.map(room => ({ id: room.id, title: room.name }))}
				resourceIdAccessor="id"
				resourceTitleAccessor="title"
				startAccessor="start"
				endAccessor="end"
				style={{
					width: "90%",
					height: 750,
					marginTop: "10rem",
					// marginLeft: "5rem",
					// marginRight: "5rem",
				}}
			/>
			<DialogComponent
				open={dialogOpen}
				onClose={handleDialogClose}
				onSuccess={handleDialogSuccess}
				rooms={rooms}
			/>
		</div>
	);
};

export default Home;
