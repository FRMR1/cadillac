import styles from "../../styles/Home.module.scss"

const News = props => {
    const posts = props.posts

    return (
        <div className={styles.newsContainer}>
            <h2>News</h2>
            {posts.map(post => (
                <>
                    <h3 key={post.slug}>{post.title}</h3>
                    {post.body.map(p => (
                        <p>{p.children[0].text}</p>
                    ))}
                </>
            ))}
        </div>
    )
}

export default News
