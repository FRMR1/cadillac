import React, { useEffect, useState, useContext } from "react"
import Link from "next/link"
import Head from "next/head"
import { connect } from "react-redux"
import { SmoothScrollContext } from "../../contexts/SmoothScroll.context"
import ImageComponent from "../ImageComponent"
import MainCanvas from "../../components/Three/Canvas"
import { useMediaQuery } from "react-responsive"
import { MenuStyles } from "../../styles/MenuStyles"
import { BurgerStyles } from "../../styles/BurgerStyles"
import client from "../../client"
import styles from "../../styles/Home.module.scss"

const Layout = props => {
    // State
    const [menuOpen, setMenuOpen] = useState()
    const [isMobile, setIsMobile] = useState()

    // Responsive
    const mobile = useMediaQuery({ query: "(max-width: 600px)" })

    useEffect(() => {
        setIsMobile(mobile)
    }, [mobile])

    // Scroll
    const [scrollCtx, setScrollCtx] = useState()
    const { scroll } = useContext(SmoothScrollContext)

    useEffect(() => {
        setScrollCtx(scroll)

        // Update height after page load
        if (scroll) scroll.update()
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
                <div data-scroll-container className={styles.container}>
                    {isMobile ? (
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
                    ) : (
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
                        bioRef={props.bioRef}
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
    }
}

export default connect(mapStateToProps)(Layout)
