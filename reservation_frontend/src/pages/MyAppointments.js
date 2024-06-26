import React, { useEffect, useState, useContext } from "react";
import axios from "../api/axios";
import { UserContext } from "../context/UserContext";
import {
	IconButton,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import moment from "moment";

const MyAppointments = () => {
	const user = JSON.parse(localStorage.getItem("user"));
	const [appointments, setAppointments] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchAppointments = async () => {
			try {
				const response = await axios.get(
					`/reservations/my-reservations/${user.id}`,
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem("token")}`,
						},
					}
				);
				setAppointments(response.data);
			} catch (error) {
				console.error("Error fetching appointments:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchAppointments();
	}, [appointments]);

	const handleDelete = async id => {
		try {
			await axios.delete(`/reservations/${id}`, {
				headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
			});
			setAppointments(prevAppointments =>
				prevAppointments.filter(appointment => appointment.id !== id)
			);
		} catch (error) {
			console.error("Error deleting appointment:", error);
		}
	};

	const exportReservations = async () => {
		try {
			const response = await axios.get("/export-reservations", {
				responseType: "blob",
				headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
			});

			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute("download", "reservations.pdf");
			document.body.appendChild(link);
			link.click();
			link.remove();
		} catch (error) {
			console.error("Error exporting reservations:", error);
		}
	};

	return (
		<div className="flex items-center justify-center h-screen bg-gray-100">
			{loading ? (
				<CircularProgress />
			) : (
				<div className="w-full max-w-4xl mx-auto p-4 bg-white shadow-md rounded-lg">
					<h2 className="text-2xl font-semibold mb-4 text-center">
						My Appointments
					</h2>

					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-200">
							<thead>
								<tr>
									<th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Title
									</th>
									<th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Room Name
									</th>
									<th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Date
									</th>
									<th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Start Time
									</th>
									<th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										End Time
									</th>
									<th className="px-6 py-3 bg-gray-50"></th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{appointments.map(appointment => (
									<tr key={appointment.id}>
										<td className="px-6 py-4 whitespace-nowrap">
											{appointment.title}
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											{appointment.room_name}
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											{moment(appointment.date).format("DD-MM-YYYY")}
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											{moment(appointment.start_time, "HH:mm:ss").format(
												"HH:mm"
											)}
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											{moment(appointment.end_time, "HH:mm:ss").format("HH:mm")}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
											{user.role === "admin" && (
												<IconButton
													color="error"
													onClick={() => handleDelete(appointment.id)}
												>
													<DeleteIcon />
												</IconButton>
											)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
						<button
							onClick={exportReservations}
							className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
						>
							Export Reservations
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default MyAppointments;
