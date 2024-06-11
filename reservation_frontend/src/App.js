import "./App.css";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import { UserProvider } from "./context/UserContext";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import SideMenuLayout from "./components/SideMenuLayout";

function App() {
	return (
		<UserProvider>
			<div className="flex">
				<Routes>
					<Route path="/" element={<Login />} />
					<Route path="/register" element={<SignUp />} />
					<Route element={<SideMenuLayout />}>
						<Route path="/home" element={<Home />} />
					</Route>
				</Routes>
			</div>
		</UserProvider>
	);
}

export default App;
