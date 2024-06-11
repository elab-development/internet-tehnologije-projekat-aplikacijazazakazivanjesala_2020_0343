import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { notifySuccess, notifyError } from "../utils/Utils";

const SignUp = () => {
	const [email, setEmail] = useState("");
	const [name, setName] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [errors, setErrors] = useState({});
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

		if (password !== confirmPassword) {
			newErrors.confirmPassword = "Passwords do not match";
		}

		if (!name) {
			newErrors.name = "Name is required";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSignUp = async e => {
		e.preventDefault();
		if (!validateForm()) return;
		try {
			const response = await axios.post("/register", {
				name,
				email,
				password,
				password_confirmation: confirmPassword,
			});
			notifySuccess("Successfull registration!");
			navigate("/");
		} catch (error) {
			notifyError(error.message);
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
				<h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
				<form onSubmit={handleSignUp}>
					<div className="mb-4">
						<input
							type="text"
							placeholder="Full name"
							value={name}
							onChange={e => setName(e.target.value)}
							required
							className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
						/>
						{errors.name && (
							<p className="text-red-500 text-sm mt-1">{errors.name}</p>
						)}
					</div>
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
					<div className="mb-4">
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
					<div className="mb-6">
						<input
							type="password"
							placeholder="Confirm Password"
							value={confirmPassword}
							onChange={e => setConfirmPassword(e.target.value)}
							required
							className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
						/>
						{errors.confirmPassword && (
							<p className="text-red-500 text-sm mt-1">
								{errors.confirmPassword}
							</p>
						)}
					</div>
					<button
						type="submit"
						className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300"
					>
						Sign Up
					</button>
				</form>
				<p className="mt-4 text-center">
					Already have an account?{" "}
					<Link to="/" className="text-blue-500">
						Login here
					</Link>
				</p>
			</div>
		</div>
	);
};

export default SignUp;
