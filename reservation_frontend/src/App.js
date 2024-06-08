import "./App.css";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";

function App() {
	return (
		<div className="appDiv">
			<Routes>
				<Route path="/" element={<Login />} />
			</Routes>
		</div>
	);
}

export default App;
