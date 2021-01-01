import { Suspense } from "react"
import * as THREE from "three"
import { Canvas } from "react-three-fiber"
import styles from "../../styles/Canvas.module.scss"

const MainCanvas = props => {
    return (
        <Canvas className={styles.canvas}>
            <Suspense fallback={null}>
                {/* <OrbitControls /> */}
                <ambientLight />
                <mesh {...props}>
                    <boxBufferGeometry args={[10, 10, 1]} />
                    <meshStandardMaterial color="orange" />
                </mesh>
            </Suspense>
        </Canvas>
    )
}

export default MainCanvas
