import axios from "axios";

const axiosInstance = axios.create({
	baseURL: "http://localhost:8000/api",
});

axiosInstance.interceptors.request.use(
	async config => {
		if (!axiosInstance.defaults.headers.common["X-CSRF-TOKEN"]) {
			await axiosInstance.get("/sanctum/csrf-cookiee");
			const token = document
				.querySelector('meta[name="csrf-token"]')
				.getAttribute("content");
			axiosInstance.defaults.headers.common["X-CSRF-TOKEN"] = token;
		}
		return config;
	},
	error => {
		return Promise.reject(error);
	}
);

export default axiosInstance;
