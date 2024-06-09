import "./App.css";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import { UserProvider } from "./context/UserContext";
import Home from "./pages/Home";

function App() {
	return (
		<UserProvider>
			<div className="appDiv">
				<Routes>
					<Route path="/" element={<Login />} />
					<Route path="/home" element={<Home />} />
				</Routes>
			</div>
		</UserProvider>
	);
}

export default App;
