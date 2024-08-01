import React from "react";
import styles from "../styles/NavLinks.module.css";
import Link from "next/link";
import LoginButton from "./LoginButton";

export const NavLinks = props => {
	return (
		<menu
			className={
				styles.NavLinks +
				" " +
				(props.open ? styles.NavLinks_open : styles.NavLinks_closed)
			}
		>
			<Link href="/home" passHref>
				<button className="button-terciary">
					<a>Home</a>
				</button>
			</Link>
			<Link href="/" passHref>
				<button className="button-terciary">
					<a>About</a>
				</button>
			</Link>
			<LoginButton showSignOut={true} />
		</menu>
	);
};
