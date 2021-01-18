import { connect } from "react-redux"
import { useRouter } from "next/router"
import client from "../client"
import styles from "../styles/Home.module.scss"

const News = props => {
    const { route } = useRouter()
    props.setRoute(route)

    const posts = Object.values(props.posts)

    return (
        <>
            {posts.map(post => (
                <div className={styles.newsContainer}>
                    <h3 key={post.slug}>{post.title}</h3>
                    <span>{post.publishedAt}</span>
                    <div className={styles.postBody}>
                        {post.body.map(p => (
                            <p>{p.children[0].text}</p>
                        ))}
                    </div>
                </div>
            ))}
        </>
    )
}

const postsQuery = `*[_type == "post"] | order(publishedAt desc){title, slug, publishedAt, body}`

export const getStaticProps = async () => {
    const posts = await client.fetch(postsQuery)
    return {
        props: { posts }, // will be passed to the page component as props
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setRoute: route =>
            dispatch({ type: "SET_CURRENT_ROUTE", value: route }),
    }
}

export default connect(null, mapDispatchToProps)(News)
