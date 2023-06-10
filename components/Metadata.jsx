import React from 'react'
import Head from "next/head"

function Metadata({title}) {
  return (
    <Head>
				<title>
					{title}
				</title>
                <link rel="icon" href="/images/logo.png" sizes="any" ></link>
                <link
                    rel="icon"
                    href="/images/logo.png"
                    type="image/png"
                    sizes="180x180"
                />
                <link
                    rel="apple-touch-icon"
                    href="/images/logo.png"
                    type="image/png"
                    sizes="180x180"
                />
				<meta
					name="description"
					content="Automate the creation of fencing competitions during practice."
				/>
				<meta
					name="viewport"
					content="initial-scale=1.0, width=device-width"
				/>
				<meta name="robots" content="index, follow" />
				<meta charset="UTF-8" />
				<meta property="og:title" content="Instant Fencing Beta Test" />
				<meta
					property="og:description"
					content="Automate the creation of fencing competitions during practice."
				/>
				<meta property="og:type" content="website" />
			</Head>
  )
}

export default Metadata