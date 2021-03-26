import { connect } from "react-redux"
import client from "../client"
import Link from "next/link"
import Shows from "../components/Home/Shows"
import News from "../components/Home/News"
import ImageComponent from "../components/ImageComponent"
import styles from "../styles/Home.module.scss"
import { useRouter } from "next/router"

const Home = props => {
    const shows = Object.values(props.shows)
    const posts = Object.values(props.posts)

    const { route } = useRouter()
    props.setRoute(route)

    return (
        <>
            <div data-scroll className={styles.eldorado}>
                <div className={styles.text}>
                    <h3>New Album</h3>
                    <h3>
                        <span>El Dorado</span>
                    </h3>
                    <p>Listen Now On</p>
                    <a
                        href="https://open.spotify.com/album/7CWOL9I84czWmMSUaPIGZt?si=7eTevxqMT7eKmtuyOExLqQ"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <ImageComponent
                            src="spotify_iccow0.svg"
                            width={180}
                            height={50}
                        />
                    </a>
                </div>
                <div className={styles.image}>
                    <ImageComponent
                        src="eldorado_rqdi4o.png"
                        width={230}
                        height={230}
                    />
                    <div className={styles.buy}>
                        <ImageComponent
                            src="shithot_tc9bx7.svg"
                            width={80}
                            height={80}
                        />
                    </div>
                </div>
            </div>
            <News posts={posts} />
            <Shows shows={shows} />
            <div data-scroll className={styles.shop}>
                <h3>Give us your money!</h3>
                <Link href="https://cadillac.bigcartel.com/">
                    <a className={styles.button} target="_blank">
                        Shop
                    </a>
                </Link>
            </div>
        </>
    )
}

const showsQuery = `*[_type == "show"] | order(date desc){date, venue, city}`
const postsQuery = `*[_type == "post"] | order(publishedAt desc){title, slug, publishedAt, body}`

export const getStaticProps = async () => {
    const shows = await client.fetch(showsQuery)
    const posts = await client.fetch(postsQuery)
    return {
        props: { shows, posts }, // will be passed to the page component as props
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setRoute: route =>
            dispatch({ type: "SET_CURRENT_ROUTE", value: route }),
    }
}

export default connect(null, mapDispatchToProps)(Home)
