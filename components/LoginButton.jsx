import { auth } from "../firebase/firebase.js";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";

const LoginButton = ({ showSignOut }) => {
	const [fail, setFail] = useState(false);
	const [user] = useAuthState(auth);
	const signInWithGoogle = () => {
		const provider = new GoogleAuthProvider();
		signInWithPopup(auth, provider).catch(error => {
			console.log(error);
			setFail(true);
		});
	};
	const showAlreadyLoggedIn = user && !showSignOut;
	const showFail = !user && fail;
	const showLoginButton = !user || !showSignOut;
	const showSignOutButton = user && showSignOut;
	return (
		<>
			{showFail && (
				<p className="fail-text">
					There was an error. Please try to log in again.
				</p>
			)}
			{showAlreadyLoggedIn && <p>You are already logged in!</p>}
			{showLoginButton && (
				<button
					className="button-primary"
					onClick={signInWithGoogle}
					disabled={user}
				>
					Continue with Google
				</button>
			)}
			{showSignOutButton && (
				<button
					className="button-primary"
					onClick={() => signOut(auth)}
				>
					Sign Out
				</button>
			)}
		</>
	);
};

export default LoginButton;
