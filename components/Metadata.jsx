import React from 'react'
import Head from "next/head"

function Metadata({title, url}) {
    const description = "Automate the creation of fencing competitions during practice."
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
					content={description}
				/>
				<meta
					name="viewport"
					content="initial-scale=1.0, width=device-width"
				/>
				<meta name="robots" content="index, follow" />
				<meta charset="UTF-8" />
				<meta property="og:title" content={title} />
				<meta
					property="og:description"
					content={description}
				/>
				<meta property="og:type" content="website" />
                <meta property="og:url" content={url}></meta>
                <meta property="og:image" content="/images/card.png"></meta>

                <meta property="twitter:title" content={title}></meta>
                <meta property="twitter:description" content={description}></meta>
                <meta property="twitter:card" content="/images/card.png"></meta>
                <meta property="twitter:image" content="/images/card.png"></meta>
			</Head>
  )
}

export default Metadata