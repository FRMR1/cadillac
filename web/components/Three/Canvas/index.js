import { Suspense, useEffect, useState, useMemo } from "react"
import * as THREE from "three"
import { Canvas } from "react-three-fiber"
import Background from "../Background"
import dynamic from "next/dynamic"
import Skull from "../Skull"
import Effects from "../Effects"
import styles from "../../../styles/Canvas.module.scss"

const MainCanvas = props => {
    const [bioRef, setBioRef] = useState()
    const [bodyRef, setBodyRef] = useState()
    const [scroll, setScroll] = useState()

    const pointer = useMemo(() => {
        return new THREE.Vector2()
    })

    useEffect(() => {
        setBodyRef(props.bodyRef.current)
    }, [props.bodyRef])

    const pointerMove = e => {
        pointer.set(e.x / window.innerWidth, 1 - e.y / window.innerHeight)
        pointer.x = (e.clientX / window.innerWidth) * 2 - 1
        pointer.y = -(e.clientY / window.innerHeight) * 2 + 1
    }

    // const OrbitControls = dynamic(() =>
    //     import("drei").then(drei => drei.OrbitControls)
    // )

    return (
        <Canvas onPointerMove={pointerMove} className={styles.canvas}>
            <Suspense fallback={null}>
                {/* <OrbitControls /> */}
                <Skull pointer={pointer} />
                <Background
                    scrollPos={props.scrollPos}
                    bodyRef={bodyRef}
                    bioRef={props.bioRef}
                    pointer={pointer}
                    route={props.route}
                />
                {/* <Effects /> */}
            </Suspense>
        </Canvas>
    )
}

export default MainCanvas
