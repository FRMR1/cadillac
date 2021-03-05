import React, { useEffect, useRef, useState } from "react"
import { connect } from "react-redux"
import ImageComponent from "../ImageComponent"
import Link from "next/link"
import Head from "next/head"
import { useMediaQuery } from "react-responsive"
import MainCanvas from "../../components/Three/Canvas"
import { MenuStyles } from "../../styles/MenuStyles"
import { BurgerStyles } from "../../styles/BurgerStyles"
import client from "../../client"
import styles from "../../styles/Home.module.scss"
import { useContext } from "react"
import { SmoothScrollContext } from "../../contexts/SmoothScroll.context"

const Layout = props => {
    const bodyRef = useRef()
    const [menuOpen, setMenuOpen] = useState()

    // Responsive
    const isMobile = useMediaQuery({ query: "(max-width: 700px)" })

    // Scroll
    const [scrollCtx, setScrollCtx] = useState()
    const { scroll } = useContext(SmoothScrollContext)

    useEffect(() => {
        setScrollCtx(scroll)
    }, [scroll])

    // Copyright date
    const date = new Date()
    const year = date.getFullYear()

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
                <div
                    ref={bodyRef}
                    data-scroll-container
                    className={styles.container}
                >
                    {isMobile && (
                        <>
                            <BurgerStyles
                                open={menuOpen}
                                onClick={() => setMenuOpen(!menuOpen)}
                            >
                                <div />
                                <div />
                                <div />
                            </BurgerStyles>
                            <MenuStyles menuOpen={menuOpen}>
                                <Link href="/">
                                    <a onClick={() => setMenuOpen(!menuOpen)}>
                                        Home
                                    </a>
                                </Link>
                                <Link href="/news">
                                    <a onClick={() => setMenuOpen(!menuOpen)}>
                                        News
                                    </a>
                                </Link>
                                <Link href="/bio">
                                    <a onClick={() => setMenuOpen(!menuOpen)}>
                                        Bio
                                    </a>
                                </Link>
                                <Link href="https://cadillac.bigcartel.com/">
                                    <a
                                        onClick={() => setMenuOpen(!menuOpen)}
                                        target="_blank"
                                    >
                                        Shop
                                    </a>
                                </Link>
                            </MenuStyles>
                        </>
                    )}
                    {!isMobile && (
                        <div
                            className={styles.navContainer}
                            data-scroll-section
                        >
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
                                <Link href="https://cadillac.bigcartel.com/">
                                    <a target="_blank">Shop</a>
                                </Link>
                            </div>
                        </div>
                    )}

                    <MainCanvas
                        bodyRef={bodyRef}
                        bioRef={props.bioRef}
                        newsRef={props.newsRef}
                        showsRef={props.showsRef}
                        route={props.route}
                        scroll={scrollCtx}
                    />
                    <main data-scroll-section className={styles.main}>
                        {props.children}
                    </main>
                    <footer data-scroll-section>
                        <div className={styles.footerSocial}>
                            <a
                                href="https://instagram.com/cadillac_ftw"
                                target="_blank"
                            >
                                <ImageComponent
                                    src="instagram_aogt64.svg"
                                    width={30}
                                    height={30}
                                />
                            </a>
                        </div>
                        <ImageComponent
                            src="logo_r0urvg.svg"
                            width={210}
                            height={43}
                        />
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
