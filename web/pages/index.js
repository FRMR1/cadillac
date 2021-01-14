import client from "../client"
import Shows from "../components/Shows"
import News from "../components/News"
import Image from "next/image"
import styles from "../styles/Home.module.scss"

const Home = props => {
    const shows = Object.values(props.shows)
    const posts = Object.values(props.posts)

    console.log(posts)

    return (
        <>
            <div className={styles.eldorado}>
                <div className={styles.text}>
                    <h3>El Dorado</h3>
                    <span>BUY! BUY! BUY!</span>
                </div>
                <div className={styles.image}>
                    <Image src="/png/eldorado.png" width={200} height={200} />
                </div>
            </div>
            <Shows shows={shows} />
            <News posts={posts} />
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
