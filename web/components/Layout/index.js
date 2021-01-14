import React, { useRef } from "react"
import Head from "next/head"
import Link from "next/link"
import MainCanvas from "../../components/Three/Canvas"
import client from "../../client"
import styles from "../../styles/Home.module.scss"
import Image from "next/image"

const Layout = props => {
    const bodyRef = useRef()

    return (
        <div ref={bodyRef} className={styles.container}>
            <Head>
                <title>CADILLAC</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div id="left"></div>
            <div id="right"></div>
            <div id="top"></div>
            <div id="bottom"></div>
            <div className={styles.navContainer}>
                <div className={styles.logo}>
                    <Image src="/svg/logo.svg" width={210} height={43} />
                </div>
                <div className={styles.nav}>
                    <Link href="/">
                        <a>Home</a>
                    </Link>
                    <Link href="/news">
                        <a>News</a>
                    </Link>
                    <Link href="/bio">
                        <a>Bio</a>
                    </Link>
                    <Link href="#">
                        <a>Shop</a>
                    </Link>
                </div>
            </div>
            <MainCanvas
                // boxRef={boxRef}
                // pyramidRef={pyramidRef}
                bodyRef={bodyRef}
            />

            <main className={styles.main}>{props.children}</main>
        </div>
    )
}

Layout.getInitialProps = async function (context) {
    const { show = "" } = context.query
    return await client.fetch(
        `
    *[_type == "show"] | order(date){date, venue, city}
  `,
        { show }
    )
}

export default Layout
