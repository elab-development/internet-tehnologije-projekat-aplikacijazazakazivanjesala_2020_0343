import React from "react";
import RoomsMap from "../components/RoomsMap";

const Locations = () => {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
			<h1 className="text-3xl font-bold mb-8">Room Locations in Belgrade</h1>
			<div className="w-full max-w-4xl">
				<RoomsMap />
			</div>
		</div>
	);
};

export default Locations;
