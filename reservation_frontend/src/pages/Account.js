import React, { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import UserPreferenceForm from "../components/UserPreferenceForm";
import axios from "../api/axios";

const Account = () => {
	const { user } = useContext(UserContext);
	const [availableReservations, setAvailableReservations] = useState([]);

	const handlePreferencesSubmit = async preferences => {
		try {
			const response = await axios.get("/reservations/available", {
				params: preferences,
				headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
			});
			setAvailableReservations(response.data);
		} catch (error) {
			console.error("Error fetching available reservations:", error);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
			<div className="w-full max-w-xl mx-auto bg-white shadow-md rounded-lg p-4">
				<h2 className="text-2xl font-semibold mb-4 text-center">
					Optimal Reservations
				</h2>
				<UserPreferenceForm onPreferencesSubmit={handlePreferencesSubmit} />
				{availableReservations.length > 0 && (
					<div className="mt-4 w-full">
						<h3 className="text-xl font-semibold mb-2 text-center">
							Suggested Reservations
						</h3>
						<div className="overflow-x-auto">
							<table className="min-w-full divide-y divide-gray-200">
								<thead>
									<tr>
										<th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Room Name
										</th>
										<th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Capacity
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
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200">
									{availableReservations.map((reservation, index) => (
										<tr key={index}>
											<td className="px-6 py-4 whitespace-nowrap">
												{reservation.room_name}
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												{reservation.num_of_seats}
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												{reservation.date}
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												{reservation.start_time}
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												{reservation.end_time}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Account;
