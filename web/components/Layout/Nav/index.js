import styles from "../../../styles/Home.module.scss"
import Link from "next/link"
import MediaQuery from "react-responsive"
import Burger from "./Burger"
import MobileMenu from "./MobileMenu"

const Nav = ({ scroll }) => {
    console.log(scroll)
    return (
        <>
            <MediaQuery maxWidth={700}>
                <Burger />
                <MobileMenu />
                <div className={styles.navContainer} data-scroll-section>
                    <div data-scroll className={styles.nav}>
                        <Link href="/">
                            <a>Fuck</a>
                        </Link>
                    </div>
                </div>
            </MediaQuery>
            <MediaQuery minWidth={701}>
                <div className={styles.navContainer} data-scroll-section>
                    <div data-scroll className={styles.nav}>
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
            </MediaQuery>
            /
        </>
    )
}

export default Nav
