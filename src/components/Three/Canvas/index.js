import React, { Suspense } from "react"

import { Canvas } from "react-three-fiber"
import styles from "../../../styles/canvas.module.scss"
import Geometry from "../Geometry"
import Camera from "../Camera"
import { OrbitControls } from "@react-three/drei"

const MainCanvas = props => {
    const width = window.innerWidth
    const height = window.innerHeight

    return (
        <Canvas className={styles.canvas}>
            <OrbitControls />
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <Suspense fallback={null}>
                <Geometry position={[-1.2, 0, 0]} />
            </Suspense>
        </Canvas>
    )
}

export default MainCanvas
