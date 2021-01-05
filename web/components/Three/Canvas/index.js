import { Suspense, useEffect, useState } from "react"
import * as THREE from "three"
import { Canvas } from "react-three-fiber"
import Scene from "../Scene"
import Scene2 from "../Scene2"
import Background from "../Background"
import Quad from "../Quad"
import styles from "../../../styles/Canvas.module.scss"

const MainCanvas = props => {
    const [boxRef, setBoxRef] = useState()
    const [pyramidRef, setPyramidRef] = useState()
    const [windowRef, setWindowRef] = useState()

    useEffect(() => {
        setBoxRef(props.boxRef.current)
    }, [props.boxRef])

    useEffect(() => {
        setPyramidRef(props.pyramidRef.current)
    }, [props.pyramidRef])

    useEffect(() => {
        setWindowRef(props.windowRef.current)
    }, [props.windowRef])

    return (
        <Canvas className={styles.canvas}>
            {/* <Suspense fallback={null}> */}
            {/* <OrbitControls /> */}
            <Background windowRef={windowRef} />
            {/* <Scene2 boxRef={boxRef} pyramidRef={pyramidRef} /> */}
            {/* <Scene boxRef={boxRef} pyramidRef={pyramidRef} /> */}
            {/* </Suspense> */}
        </Canvas>
    )
}

export default MainCanvas
