import Head from "next/head"
import client from "../client"
import styles from "../styles/Home.module.css"

const Home = props => {
    console.log(props)

    const shows = Object.values(props)

    console.log(shows)

    return (
        <div className={styles.container}>
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>Cadillac</h1>
                <h2>Upcoming Shows:</h2>
                <ul>
                    {shows.map(show => (
                        <li>
                            {show.date} at {show.venue} in {show.city}
                        </li>
                    ))}
                </ul>
            </main>

            <footer className={styles.footer}>Copyright 2020 Cadillac.</footer>
        </div>
    )
}

Home.getInitialProps = async function (context) {
    const { show = "" } = context.query
    return await client.fetch(
        `
    *[_type == "show"] | order(date){date, venue, city}
  `,
        { show }
    )
}

export default Home
