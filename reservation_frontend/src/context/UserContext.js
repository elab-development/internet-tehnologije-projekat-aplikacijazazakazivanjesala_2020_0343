import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
	const [user, setUser] = useState(null);

	useEffect(() => {
		const storedUser = JSON.parse(localStorage.getItem("user"));
		if (storedUser) {
			setUser(storedUser);
		}
	}, []);

	const value = {
		user,
		setUser,
	};

	return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
