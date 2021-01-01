import Head from "next/head"
import MainCanvas from "../components/Canvas"
import client from "../client"
import styles from "../styles/Home.module.scss"

const Home = props => {
    console.log(props)

    const shows = Object.values(props)

    console.log(shows)

    return (
        <div className={styles.container}>
            <Head>
                <title>Cadillac</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <MainCanvas />
            </main>
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
