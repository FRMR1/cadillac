import Link from "next/link"
import styles from "../../../styles/Home.module.scss"

const News = props => {
    const posts = props.posts

    return (
        <div className={styles.newsContainer}>
            <h2>News</h2>
            {posts.map(post => (
                <>
                    <h3 key={post.slug}>{post.title}</h3>
                    <span>{post.publishedAt}</span>
                    <div className={styles.postBody}>
                        {post.body.map(p => (
                            <p>
                                {p.children[0].text
                                    .substring(0, 200)
                                    .concat("...")}
                            </p>
                        ))}
                    </div>
                </>
            ))}
            <div className={styles.buttonContainer}>
                <Link href="/news">
                    <a className={styles.button}>More</a>
                </Link>
            </div>
        </div>
    )
}

export default News
