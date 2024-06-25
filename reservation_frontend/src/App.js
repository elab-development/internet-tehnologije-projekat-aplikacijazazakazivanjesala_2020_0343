import "./App.css";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import { UserProvider } from "./context/UserContext";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import NavbarLayout from "./components/NavbarLayout";
import MyAppointments from "./pages/MyAppointments";
import Account from "./pages/Account";
import Locations from "./pages/Locations";

function App() {
	return (
		<UserProvider>
			<Routes>
				<Route path="/" element={<Login />} />
				<Route path="/register" element={<SignUp />} />
				<Route element={<NavbarLayout />}>
					<Route path="/home" element={<Home />} />
					<Route path="/appointments" element={<MyAppointments />} />
					<Route path="/account" element={<Account />} />
					<Route path="/locations" element={<Locations />} />
				</Route>
			</Routes>
		</UserProvider>
	);
}

export default App;
