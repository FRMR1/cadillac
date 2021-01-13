import { Suspense, useEffect, useState, useMemo } from "react"
import * as THREE from "three"
import { Canvas } from "react-three-fiber"
import Scene from "../Scene"
import Scene2 from "../Scene2"
import Background from "../Background"
import Quad from "../Quad"
import Reaper from "../Reaper"
import Ground from "../Ground"
import Effects from "../Effects"
import styles from "../../../styles/Canvas.module.scss"

const MainCanvas = props => {
    // const [boxRef, setBoxRef] = useState()
    // const [pyramidRef, setPyramidRef] = useState()
    const [bodyRef, setBodyRef] = useState()
    const [scroll, setScroll] = useState()

    const pointer = useMemo(() => {
        return new THREE.Vector2()
    })

    // useEffect(() => {
    //     setBoxRef(props.boxRef.current)
    // }, [props.boxRef])

    // useEffect(() => {
    //     setPyramidRef(props.pyramidRef.current)
    // }, [props.pyramidRef])

    useEffect(() => {
        setBodyRef(props.bodyRef.current)
    }, [props.bodyRef])

    const pointerMove = e => {
        pointer.set(e.x / window.innerWidth, 1 - e.y / window.innerHeight)
        pointer.x = (e.clientX / window.innerWidth) * 2 - 1
        pointer.y = -(e.clientY / window.innerHeight) * 2 + 1
    }

    return (
        <Canvas onPointerMove={pointerMove} className={styles.canvas}>
            <Suspense fallback={null}>
                {/* <OrbitControls /> */}
                <Reaper pointer={pointer} />
                <Background
                    // position={[0, 0, 0]}
                    scrollPos={props.scrollPos}
                    bodyRef={bodyRef}
                    // boxRef={boxRef}
                    // pyramidRef={pyramidRef}
                />
                {/* <Effects /> */}
            </Suspense>
        </Canvas>
    )
}

export default MainCanvas
