import { useRef, useEffect } from "react"
import { connect } from "react-redux"
import { formatDate } from "../../../utils/formatDate"
import styles from "../../../styles/Home.module.scss"

const Shows = props => {
    const showsRef = useRef()

    const shows = props.shows

    useEffect(() => {
        props.setShowsRef(showsRef.current)
    }, [showsRef])

    return (
        <div className={styles.showsContainer}>
            <h2 ref={showsRef}>Upcoming Shows</h2>
            <table>
                <tHead>
                    <tr>
                        <th>Date</th>
                        <th>City</th>
                        <th>Venue</th>
                    </tr>
                </tHead>
                <tBody>
                    {shows &&
                        shows.map(show => (
                            <tr key={show.date}>
                                <td>{formatDate(show.date)}</td>
                                <td>{show.city}</td>
                                <td>{show.venue}</td>
                            </tr>
                        ))}
                    {!shows.length && (
                        <tr className={styles.noShows}>
                            <td colspan="3">
                                There are currently no shows scheduled.
                            </td>
                        </tr>
                    )}
                </tBody>
            </table>
        </div>
    )
}

const mapDispatchToProps = dispatch => {
    return {
        setShowsRef: showsRef =>
            dispatch({ type: "SET_SHOWS_REF", value: showsRef }),
    }
}

export default connect(null, mapDispatchToProps)(Shows)
