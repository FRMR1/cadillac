import React, { useRef, useEffect } from "react"
import { connect } from "react-redux"
import { useRouter } from "next/router"
import styles from "../styles/Home.module.scss"

const Bio = props => {
    const ref = useRef()

    const { route } = useRouter()
    props.setRoute(route)

    useEffect(() => {
        props.setBioRef(ref.current)
    }, [ref])

    return (
        <div className={styles.bioContainer}>
            <h2>We are Cadillac.</h2>
            <p>
                With one boot well placed in the traditions of yesteryear, and
                the other kicking down the door of the dystopian future we have
                yet to face, Cadillac is the best band you have yet to hear in
                this bizarre timeline we’ve all been chosen to exist in. Blazing
                dual guitars, thundering bass, intricate percussion and lyrics
                that would make Charlemagne second guess himself. With a
                dynamite rhythm section comprised of F@RM3R on drums, and Chad
                "Puff Chaddy" Krause on bass, they are the key components that
                keep the engine running. In the passenger seat is Nick "Reese
                Richards" Gauvin, whose twangy telecaster licks and sweet vocal
                harmonies are the seasoning that leave you wanting more. Last
                but not least, the one at the helm, on lead vocals and guitar is
                Reverend Kitchener Langfield III. In 2019 he left the bustling
                metropolis of Vancouver for the prairie skies of Southwest
                Saskatchewan on a divine calling to start the world's greatest
                rock and roll band. And now ladies and gentlemen, that dream has
                become a reality. So turn it up, shout it out and give it up for
                the band goddamnit!
            </p>
            <p>We are Cadillac, and we’re here to play rock n roll.</p>
            <div ref={ref} className={styles.bioImage}></div>
        </div>
    )
}

const mapDispatchToProps = dispatch => {
    return {
        setBioRef: bioRef => dispatch({ type: "SET_BIO_REF", value: bioRef }),
        setRoute: route =>
            dispatch({ type: "SET_CURRENT_ROUTE", value: route }),
    }
}

export default connect(null, mapDispatchToProps)(Bio)
