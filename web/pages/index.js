import client from "../client"
import Shows from "../components/Shows"
import News from "../components/News"
import styles from "../styles/Home.module.scss"

const Home = props => {
    const shows = Object.values(props.shows)
    const posts = Object.values(props.posts)

    console.log(posts)

    return (
        <>
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
