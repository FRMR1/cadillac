import React, { useRef } from "react"
import { createStore } from "redux"
import { Provider } from "react-redux"
import reducer from "../store/reducer"
import Layout from "../components/Layout"
import { SmoothScrollProvider } from "../contexts/SmoothScroll.context"
import { LocomotiveScrollProvider } from "react-locomotive-scroll"
import "../styles/globals.scss"

const store = createStore(reducer)

function MyApp({ Component, pageProps }) {
    const containerRef = useRef(null)

    return (
        <Provider store={store}>
            <SmoothScrollProvider containerRef={containerRef}>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </SmoothScrollProvider>
        </Provider>
    )
}

export default MyApp
