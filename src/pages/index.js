import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"
import Canvas from "../components/Canvas"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <Canvas />
  </Layout>
)

export default IndexPage
