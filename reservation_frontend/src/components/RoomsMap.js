import { React, useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
	iconRetinaUrl:
		"https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
	iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
	shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const locations = [
	{ id: 1, name: "Room 1", location: { lat: 44.8125, lng: 20.4612 } },
	{ id: 2, name: "Room 2", location: { lat: 44.8186, lng: 20.4633 } },
	{ id: 3, name: "Room 3", location: { lat: 44.8075, lng: 20.4654 } },
];

const RoomsMap = () => {
	const [weatherData, setWeatherData] = useState([]);

	useEffect(() => {
		const fetchWeatherData = async () => {
			const weatherPromises = locations.map(location =>
				getWeather(location.location.lat, location.location.lng)
			);
			const weatherResults = await Promise.all(weatherPromises);
			setWeatherData(weatherResults);
		};
		fetchWeatherData();
	}, []);

	return (
		<MapContainer
			center={[44.787197, 20.457273]}
			zoom={13}
			style={{ height: "400px", width: "100%" }}
		>
			<TileLayer
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			/>
			{locations.map(({ id, location, name }, index) => (
				<Marker key={id} position={[location.lat, location.lng]}>
					<Popup>
						<div>
							<h3>{name}</h3>
							{weatherData[index] && (
								<div>
									<p>{`Temperature: ${weatherData[index].main.temp}°C`}</p>
									<p>{`Weather: ${weatherData[index].weather[0].description}`}</p>
								</div>
							)}
						</div>
					</Popup>
				</Marker>
			))}
		</MapContainer>
	);
};

const getWeather = async (lat, lon) => {
	const apiKey = process.env.REACT_APP_API_KEY;
	try {
		const response = await axios.get(
			`https://api.openweathermap.org/data/2.5/weather`,
			{
				params: {
					lat,
					lon,
					appid: apiKey,
					units: "metric",
				},
			}
		);
		return response.data;
	} catch (error) {
		console.error("Error fetching weather data:", error);
		return null;
	}
};

export default RoomsMap;
