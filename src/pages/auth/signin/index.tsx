import { NextPage } from "next";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faVk, faGoogle } from "@fortawesome/free-brands-svg-icons";

const SignIn: NextPage = () => {
	const [usernameOrEmail, setUsernameOrEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
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
								value={usernameOrEmail}
								onChange={(e) => setUsernameOrEmail(e.target.value)}
								placeholder="Enter your username"
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
						<div className="flex items-center justify-between">
							<button
								type="submit"
								onClick={() => { console.log(usernameOrEmail, password) }}
								className="text-white hover:text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
								Sign In
							</button>
							<Link href="/auth/forgot-password" className="inline-block align-baseline font-bold text-sm text-white hover:text-black">Forgot Password?</Link>
							<Link href="/auth/signup" className="inline-block align-baseline font-bold text-sm text-white hover:text-black">Create account</Link>
						</div>
					</form>
					<div className="flex items-center justify-center">
						<button
							type="submit"
							onClick={(e) => signIn("discord", { callbackUrl: "http://localhost:3000" })}
							className="py-2 px-4 rounded focus:outline-none focus:shadow-outline inline-block align-baseline font-bold text-sm text-white hover:text-black">
							<FontAwesomeIcon icon={faDiscord} />{` `}
							Login with discord
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default SignIn;