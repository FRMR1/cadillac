import { useRef } from "react"

import Head from "next/head"
import MainCanvas from "../components/Three/Canvas"
import client from "../client"
import styles from "../styles/Home.module.scss"

const Home = props => {
    const boxRef = useRef()
    const pyramidRef = useRef()

    const shows = Object.values(props)

    return (
        <div className={styles.container}>
            <Head>
                <title>Cadillac</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <MainCanvas boxRef={boxRef} pyramidRef={pyramidRef} />
                <p>
                    <span ref={boxRef} id="box" className="diagram left"></span>
                    I love boxes. Presents come in boxes. When I find a new box
                    I'm always excited to find out what's inside.
                </p>
                <p>
                    <span
                        ref={pyramidRef}
                        id="pyramid"
                        className="diagram right"
                    ></span>
                    When I was a kid I dreamed of going on an expedition inside
                    a pyramid and finding a undiscovered tomb full of mummies
                    and treasure.
                </p>
                {/* {shows.map(show => (
                    <h2 key={show.date} style={{ marginBottom: "300px" }}>
                        {show.date} at {show.venue} in {show.city}
                    </h2>
                ))} */}
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
