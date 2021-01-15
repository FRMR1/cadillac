import client from "../client"
import styles from "../styles/Home.module.scss"

const News = props => {
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

export default News
