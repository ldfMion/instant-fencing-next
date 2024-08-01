import React from "react";

/*
import { getAuth } from "firebase/auth";
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
*/
import { useAuthState } from "react-firebase-hooks/auth";

import { HomePage } from "../components/HomePage";
import { LoggedOut } from "../components/LoggedOut.jsx";

import { auth, db } from "../firebase/firebase.js";

const Home = () => {
	console.log("is rendering the coponent again");
	//get the user that is logged in
	console.log(db);
	//const auth = getAuth();
	const [user] = useAuthState(auth);
	console.log(user);

	//load the prompt to sign in/up if the user is not signed in

	if (!user) {
		return <LoggedOut />;
	}

	return (
		<>
			<HomePage user={user} db={db} />
		</>
	);
};

export default Home;
