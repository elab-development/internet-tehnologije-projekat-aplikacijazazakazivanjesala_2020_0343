import "./App.css";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import { UserProvider } from "./context/UserContext";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import NavbarLayout from "./components/NavbarLayout";

function App() {
	return (
		<UserProvider>
			<Routes>
				<Route path="/" element={<Login />} />
				<Route path="/register" element={<SignUp />} />
				<Route element={<NavbarLayout />}>
					<Route path="/home" element={<Home />} />
				</Route>
			</Routes>
		</UserProvider>
	);
}

export default App;
