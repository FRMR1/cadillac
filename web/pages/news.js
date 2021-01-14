import client from "../client"
import styles from "../styles/Home.module.scss"

const News = props => {
    const shows = Object.values(props)

    return (
        <div className={styles.newsContainer}>
            <h2>News</h2>
        </div>
    )
}

News.getInitialProps = async function (context) {
    const { show = "" } = context.query
    return await client.fetch(
        `
    *[_type == "show"] | order(date desc){date, venue, city}
  `,
        { show }
    )
}

export default News
