import client from "../client"
import Link from "next/link"
import Shows from "../components/Home/Shows"
import News from "../components/Home/News"
import Image from "next/image"
import styles from "../styles/Home.module.scss"

const Home = props => {
    const shows = Object.values(props.shows)
    const posts = Object.values(props.posts)

    return (
        <>
            <div className={styles.eldorado}>
                <div className={styles.text}>
                    <h3>
                        New Album <span className={styles.gold}>El Dorado</span>
                    </h3>
                    <p>Out Now On</p>
                    <Image src="/svg/spotify.svg" width={180} height={50} />
                </div>
                <div className={styles.image}>
                    <Image src="/png/eldorado.png" width={200} height={200} />
                    <div className={styles.buy}>
                        <Image src="/svg/shithot.svg" width={80} height={80} />
                    </div>
                </div>
            </div>
            <News posts={posts} />
            <Shows shows={shows} />
            <div className={styles.shop}>
                <h3>Give us money.</h3>
                <Link href="#" target="_blank">
                    <a className={styles.button}>Shop</a>
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

export default Home
