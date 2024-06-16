import React, { useEffect, useState, useContext } from "react";
import axios from "../api/axios";
import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { UserContext } from "../context/UserContext";
import SideMenu from "../components/SideMenu";
import { Button } from "@mui/material";
import DialogComponent from "../components/DialogComponent";
import { notifySuccess, notifyError } from "../utils/Utils";
import ReservationFilter from "../components/FilterComponent";
const localizer = momentLocalizer(moment);

const Home = () => {
	const [events, setEvents] = useState([]);
	const [resources, setResources] = useState([]);
	const [rooms, setRooms] = useState([]);
	const { user } = useContext(UserContext);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [reservation, setReservation] = useState({});
	const [update, setUpdate] = useState(false);
	const [dataChange, setDataChange] = useState(false);

	const handleDialogOpen = () => {
		setDialogOpen(true);
	};

	const handleDialogClose = () => {
		setDialogOpen(false);
		setReservation({});
		setUpdate(false);
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
			notifyError("Error fetching reservations");
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

				setEvents(events);
				setResources(roomTypes);
				setRooms(rooms);
			} catch (error) {
				notifyError("Error fetching reservations");
			}
		};

		fetchData();
	}, [dataChange]);

	const getReservation = async id => {
		try {
			const reservationsRes = await axios.get(`/reservations/${id}`, {
				headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
			});

			const reservation = reservationsRes.data;
			return reservation;
		} catch (error) {
			notifyError("Error fetching reservation");
		}
	};

	const handleSelectReservation = async e => {
		const reservation = await getReservation(e.id);
		setReservation(reservation);
		setDialogOpen(true);
		setUpdate(true);
	};

	const handleFilter = filteredReservations => {
		const events = filteredReservations.map(reservation => ({
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
	};

	const handleReset = async () => {
		setDataChange(true);
	};

	return (
		<div className="glavniDiv">
			<div className="grid justify-center">
				<ReservationFilter
					rooms={rooms}
					onFilter={handleFilter}
					onReset={handleReset}
				/>
				<div className="flex justify-center mt-2">
					<Button
						variant="contained"
						color="primary"
						onClick={handleDialogOpen}
						className="w-42"
					>
						Add New Reservation
					</Button>
				</div>
			</div>
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
					width: "95%",
					height: 750,
					marginTop: "1rem",
					marginLeft: "3rem",
					// marginRight: "5rem",
				}}
				onSelectEvent={handleSelectReservation}
			/>
			<DialogComponent
				open={dialogOpen}
				onClose={handleDialogClose}
				onSuccess={handleDialogSuccess}
				rooms={rooms}
				reservation={reservation}
				update={update}
			/>
		</div>
	);
};

export default Home;
