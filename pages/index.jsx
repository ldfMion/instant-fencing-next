import Head from "next/head";
//import styles from "../styles/Home.module.css";

import NavBar from "../components/NavBar";
import ActionCard from '../components/ActionCard'

export default function Home() {
    
	return (
		<>
            <Head>
                <title>Instant Fencing Beta Test</title>
                <meta name="description" content="Automate the creation of fencing competitions during practice."/>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <meta name="robots" content="index, follow"/>
                <meta charset="UTF-8"/>

                <meta property='og:title' content="Instant Fencing Beta Test"/>
                <meta property="og:description" content="Automate the creation of fencing competitions during practice." />
                <meta property="og:type" content="website" />
            </Head>
			<NavBar />
			<div className="mainContent">
				<section className="column">
					<h2>Welcome to the instant fencing beta!</h2>
                    <p>Create training competitions fast without the hassle</p>
					<h3>How to start</h3>
                    <ActionCard 
                        index={1}
                        text='Create an accound with google'
                        href='./login'
                        buttonText='Get started free'
                        buttonType='primary'
                    />
                    <ActionCard 
                        index={2}
                        text='Create a new event in the home page'
                        href='./home'
                        buttonText='Go to home'
                        buttonType='secondary'
                    />
				</section>
				<section className="column">
					<h2>Help</h2>
					<article className="card column">
						<h3>The Waiting Room</h3>
						<p>Share the waiting room link with other users</p>
						<p>Add fencers in the waiting room in two ways:</p>
						<p>
							Fencer names can be added by logged users. These
							fencers will not be associated with an account
						</p>
						<p>Or logged users can join</p>
					</article>
					<article className="card column">
						<h3>Sort types</h3>
						<h4>By Rank</h4>
						<p>
							Manually select the initial seeding used to make the
							pools
						</p>
						<p>Select fencers in order of best to worst</p>
						<h4>Randomly</h4>
						<p>Fencers will be sorted randomly into pools</p>
					</article>
					<article className="card column">
						<h3>The beta</h3>
						<p>
							Currently, the app only supports pools. Direct
							elimination and other competition formats are coming
							soon.
						</p>
					</article>
				</section>
			</div>
		</>
	);
}
