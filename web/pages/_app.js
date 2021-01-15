import React from "react"
import { createStore } from "redux"
import { Provider } from "react-redux"
import reducer from "../store/reducer"
import Layout from "../components/Layout"
import { BioContext } from "../pages/bio"
import "../styles/globals.scss"

const store = createStore(reducer)

function MyApp({ Component, pageProps }) {
    return (
        <Provider store={store}>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </Provider>
    )
}

export default MyApp
