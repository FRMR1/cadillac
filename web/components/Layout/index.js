import React, { useRef, useEffect } from "react"
import { connect } from "react-redux"
import Image from "next/image"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/dist/ScrollTrigger"
import MainCanvas from "../../components/Three/Canvas"
import client from "../../client"
import styles from "../../styles/Home.module.scss"

const Layout = props => {
    const bodyRef = useRef()
    const router = useRouter()

    console.log("LAYOUT PROPS", props)

    gsap.registerPlugin(ScrollTrigger)

    const date = new Date()
    const year = date.getFullYear()

    useEffect(() => {
        let height
        const element = bodyRef.current

        function setHeight() {
            height = element.clientHeight
            document.body.style.height = height + "px"
        }

        ScrollTrigger.addEventListener("refreshInit", setHeight)
        router.events.on("routeChangeComplete", setHeight)
        router.events.on("routerChangeComplete", console.log("ROUTE COMPLETE"))

        gsap.to(element, {
            y: () => -(height - document.documentElement.clientHeight),
            ease: "none",
            scrollTrigger: {
                trigger: document.body,
                invalidateOnRefresh: true,
                start: "top top",
                end: "bottom bottom",
                scrub: 1,
            },
        })
    }, [])

    return (
        <>
            <Head>
                <title>CADILLAC</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div id="left"></div>
            <div id="right"></div>
            <div id="top"></div>
            <div id="bottom"></div>
            <div id="viewport">
                <div ref={bodyRef} className={styles.container}>
                    <div className={styles.navContainer}>
                        <div className={styles.logo}></div>
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
                        bodyRef={bodyRef}
                        bioRef={props.bioRef}
                        newsRef={props.newsRef}
                        showsRef={props.showsRef}
                        route={props.route}
                    />
                    <main className={styles.main}>{props.children}</main>
                    <footer>
                        <Image src="/svg/logo.svg" width={210} height={43} />
                        <span className={styles.copyright}>
                            ©{year} Cadillac. All Rights Reserved.
                        </span>
                    </footer>
                </div>
            </div>
        </>
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

const mapStateToProps = state => {
    return {
        bioRef: state.bioRef,
        route: state.route,
        newsRef: state.newsRef,
        showsRef: state.showsRef,
    }
}

export default connect(mapStateToProps)(Layout)
