import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { UserContext } from "../context/UserContext";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState({});
	const { setUser } = useContext(UserContext);
	const navigate = useNavigate();

	const validateEmail = email => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const validateForm = () => {
		const newErrors = {};
		if (!email) {
			newErrors.email = "Email is required";
		} else if (!validateEmail(email)) {
			newErrors.email = "Email is not valid";
		}

		if (!password) {
			newErrors.password = "Password is required";
		} else if (password.length < 8) {
			newErrors.password = "Password must be at least 8 characters";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleLogin = async e => {
		e.preventDefault();
		if (!validateForm()) return;
		try {
			const response = await axios.post("/login", { email, password });
			console.log(response);
			setUser({ user: response.data.user, token: response.data.access_token });
			navigate("/home");
		} catch (error) {
			console.error("Login failed:", error);
		}
	};
	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
				<h2 className="text-2xl font-bold text-center mb-6">Login</h2>
				<form onSubmit={handleLogin}>
					<div className="mb-4">
						<input
							type="email"
							placeholder="Email"
							value={email}
							onChange={e => setEmail(e.target.value)}
							required
							className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
						/>
						{errors.email && (
							<p className="text-red-500 text-sm mt-1">{errors.email}</p>
						)}
					</div>
					<div className="mb-6">
						<input
							type="password"
							placeholder="Password"
							value={password}
							onChange={e => setPassword(e.target.value)}
							required
							className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
						/>
						{errors.password && (
							<p className="text-red-500 text-sm mt-1">{errors.password}</p>
						)}
					</div>
					<button
						type="submit"
						disabled={Object.keys(errors).length > 0}
						className={`w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300 ${
							Object.keys(errors).length > 0
								? "opacity-50 cursor-not-allowed"
								: ""
						}`}
					>
						Login
					</button>
				</form>
				<p className="mt-4 text-center">
					Don't have an account?{" "}
					<Link to="/register" className="text-blue-500">
						Register here
					</Link>
				</p>
			</div>
		</div>
	);
};

export default Login;
