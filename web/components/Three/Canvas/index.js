import { Suspense, useEffect, useState } from "react"
import * as THREE from "three"
import { Canvas } from "react-three-fiber"
import Scene from "../Scene"
import Scene2 from "../Scene2"
import Quad from "../Quad"
import styles from "../../../styles/Canvas.module.scss"

const MainCanvas = props => {
    const [boxRef, setBoxRef] = useState()
    const [pyramidRef, setPyramidRef] = useState()

    useEffect(() => {
        setBoxRef(props.boxRef.current)
    }, [props.boxRef])

    useEffect(() => {
        setPyramidRef(props.pyramidRef.current)
    }, [props.pyramidRef])

    return (
        <Canvas className={styles.canvas}>
            {/* <Suspense fallback={null}> */}
            {/* <OrbitControls /> */}
            <ambientLight />
            <Quad boxRef={boxRef} pyramidRef={pyramidRef} />
            {/* <Scene boxRef={boxRef} />
            <Scene2 pyramidRef={pyramidRef} /> */}
            {/* </Suspense> */}
        </Canvas>
    )
}

export default MainCanvas
