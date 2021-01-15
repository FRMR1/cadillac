import React, { useRef } from "react"
import Head from "next/head"
import Link from "next/link"
import MainCanvas from "../../components/Three/Canvas"
import client from "../../client"
import styles from "../../styles/Home.module.scss"
import Image from "next/image"

const Layout = props => {
    const bodyRef = useRef()

    const date = new Date()
    const year = date.getFullYear()

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
                    <Link href="/">
                        <a>
                            <Image
                                src="/svg/logo.svg"
                                width={210}
                                height={43}
                            />
                        </a>
                    </Link>
                </div>
                <div className={styles.nav}>
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
            <footer>
                <Image src="/svg/logo.svg" width={210} height={43} />
                <span className={styles.copyright}>
                    ©{year} Cadillac. All Rights Reserved.
                </span>
            </footer>
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
