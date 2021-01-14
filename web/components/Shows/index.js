import styles from "../../styles/Home.module.scss"

const Shows = props => {
    const shows = props.shows

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
                        <tr key={show.date}>
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

export default Shows
