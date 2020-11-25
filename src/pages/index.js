import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"
import MainCanvas from "../components/Three/Canvas"

const IndexPage = () => (
    <Layout>
        <SEO title="Home" />
        <MainCanvas />
    </Layout>
)

export default IndexPage
