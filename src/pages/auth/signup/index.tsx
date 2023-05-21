import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NextPage } from "next";
import { useState } from "react";

const SignUp: NextPage = () => {
	const [username, setUsername] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [passwordRepeat, setPasswordRepeat] = useState<string>("");

	const [passwordVisible, setPasswordVisible] = useState<boolean>(true);

	return (
		<>
			<div className="flex items-center justify-center text-white">
				<div className="w-full max-w-md shadow-md rounded px-8 py-6 bg-gray-700 bg-opacity-50">
					<form className="">
						<div className="mb-4">
							<label htmlFor="username" className="block text-sm font-bold mb-2">Username:</label>
							<input
								type="username"
								id="username"
								name="username"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								placeholder="Enter your username"
								className="bg-gray-700 shadow appearance-none rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline" />
						</div>
						<div className="mb-4">
							<label htmlFor="username" className="block text-sm font-bold mb-2">Email:</label>
							<input
								type="email"
								id="email"
								name="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="Enter your email"
								className="bg-gray-700 shadow appearance-none rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline" />
						</div>
						<div className="relative mb-6">
							<label htmlFor="password" className="block text-sm font-bold mb-2">Password:</label>
							<div className="flex items-center">
								<input
									type={passwordVisible ? "password" : "text"}
									id="password"
									name="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder="Enter your password"
									autoComplete="on"
									className="bg-gray-700 shadow appearance-none rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline" />
								<FontAwesomeIcon
									icon={passwordVisible ? faEyeSlash : faEye}
									className="absolute cursor-pointer right-0 top-0 mt-10 mr-3"
									onClick={() => setPasswordVisible(!passwordVisible)} />
							</div>
						</div>
						<div className="relative mb-6">
							<label htmlFor="password" className="block text-sm font-bold mb-2">Repeat password:</label>
							<div className="flex items-center">
								<input
									type={passwordVisible ? "password" : "text"}
									id="password-repeat"
									name="password-repeat"
									value={passwordRepeat}
									onChange={(e) => setPasswordRepeat(e.target.value)}
									placeholder="Enter your password again"
									autoComplete="on"
									className="bg-gray-700 shadow appearance-none rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline" />
							</div>
						</div>
						<div className="flex items-center justify-between">
							<button
								type="submit"
								onClick={() => { console.log(username, email, password) }}
								className="text-white hover:text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
								Sign Up
							</button>
						</div>
					</form>
				</div>
			</div>
		</>
	);
};

export default SignUp;