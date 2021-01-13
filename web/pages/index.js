import { useRef } from "react"

import Head from "next/head"
import MainCanvas from "../components/Three/Canvas"
import client from "../client"
import styles from "../styles/Home.module.scss"
import Image from "next/image"

const Home = props => {
    const shows = Object.values(props)

    console.log(shows)

    return (
        <div className={styles.showsContainer}>
            <h2>Upcoming Shows</h2>
            <table>
                <tHead>
                    <tr>
                        <th>Date</th>
                        <th>City</th>
                        <th>Venue</th>
                    </tr>
                </tHead>
                <tBody>
                    {shows.map(show => (
                        <tr>
                            <td>{show.date}</td>
                            <td>{show.city}</td>
                            <td>{show.venue}</td>
                        </tr>
                    ))}
                </tBody>
            </table>
        </div>
    )
}

Home.getInitialProps = async function (context) {
    const { show = "" } = context.query
    return await client.fetch(
        `
    *[_type == "show"] | order(date desc){date, venue, city}
  `,
        { show }
    )
}

export default Home
