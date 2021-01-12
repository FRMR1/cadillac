import { Suspense, useEffect, useState } from "react"
import * as THREE from "three"
import { Canvas } from "react-three-fiber"
import Scene from "../Scene"
import Scene2 from "../Scene2"
import Background from "../Background"
import Quad from "../Quad"
import Reaper from "../Reaper"
import Ground from "../Ground"
// import { OrbitControls } from "@react-three/drei"
import styles from "../../../styles/Canvas.module.scss"

let OrbitControls

const MainCanvas = props => {
    const [boxRef, setBoxRef] = useState()
    const [pyramidRef, setPyramidRef] = useState()
    const [bodyRef, setBodyRef] = useState()

    useEffect(() => {
        setBoxRef(props.boxRef.current)
    }, [props.boxRef])

    useEffect(() => {
        setPyramidRef(props.pyramidRef.current)
    }, [props.pyramidRef])

    useEffect(() => {
        setBodyRef(props.bodyRef.current)
    }, [props.bodyRef])

    return (
        <Canvas className={styles.canvas}>
            <Suspense fallback={null}>
                {/* <OrbitControls /> */}
                {/* <ambientLight /> */}
                {/* <pointLight position={[0, 4, 10]} /> */}
                {/* <Ground /> */}
                <Reaper />
                <Background
                    position={[0, 0, -2]}
                    boxRef={boxRef}
                    pyramidRef={pyramidRef}
                    bodyRef={bodyRef}
                />
            </Suspense>
        </Canvas>
    )
}

export default MainCanvas
