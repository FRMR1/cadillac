import { useRef, useEffect } from "react"
import { connect } from "react-redux"
import Link from "next/link"
import styles from "../../../styles/Home.module.scss"
import { formatDate } from "../../../utils/formatDate"

const News = ({ posts, ...props }) => {
    const newsRef = useRef()

    useEffect(() => {
        props.setNewsRef(newsRef.current)
    }, [newsRef])

    return (
        <div className={styles.newsContainer}>
            <h2 ref={newsRef}>News</h2>
            {posts.map(post => (
                <div key={post.publishedAt} className={styles.articleContainer}>
                    <h3 key={post.slug}>{post.title}</h3>
                    <span>{formatDate(post.publishedAt)}</span>
                    <div className={styles.postBody}>
                        {post.body.map(p => (
                            <p key={p._key}>
                                {p.children[0].text
                                    .substring(0, 200)
                                    .concat("...")}
                            </p>
                        ))}
                    </div>
                </div>
            ))}
            <div className={styles.buttonContainer}>
                <Link href="/news">
                    <a className={styles.button}>More</a>
                </Link>
            </div>
        </div>
    )
}

const mapDispatchToProps = dispatch => {
    return {
        setNewsRef: newsRef =>
            dispatch({ type: "SET_NEWS_REF", value: newsRef }),
    }
}

export default connect(null, mapDispatchToProps)(News)
