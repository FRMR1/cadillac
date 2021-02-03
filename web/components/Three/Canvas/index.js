import { Suspense, useEffect, useState, useMemo } from "react"
import * as THREE from "three"
import { Canvas } from "react-three-fiber"
import Background from "../Background"
import dynamic from "next/dynamic"
import Skull from "../Skull"
import HeroText from "../Text/HeroText"
import H1 from "../Text/H1"
import Dice from "../Dice"
import Bullet from "../Bullet"
import FBO from "../FBO"
import Effects from "../Effects"
import styles from "../../../styles/Canvas.module.scss"

const MainCanvas = props => {
    const [bodyRef, setBodyRef] = useState()

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

    return (
        <Canvas onPointerMove={pointerMove} className={styles.canvas}>
            <Suspense fallback={null}>
                {/* <OrbitControls /> */}
                <Skull bodyRef={bodyRef} pointer={pointer} />
                <Dice pointer={pointer} />
                <Bullet pointer={pointer} />
                <HeroText
                    position={[0, 4.8, -5]}
                    children={"CADILLAC"}
                    pointer={pointer}
                />
                <Background
                    bodyRef={bodyRef}
                    bioRef={props.bioRef}
                    newsRef={props.newsRef}
                    showsRef={props.showsRef}
                    pointer={pointer}
                    route={props.route}
                />
                {props.route === "/" && (
                    <FBO
                        el={props.newsRef}
                        pointer={props.pointer}
                        bodyRef={bodyRef}
                    >
                        <H1
                            position={[0, 0, 0]}
                            children={"NEWS"}
                            pointer={props.pointer}
                        />
                    </FBO>
                )}
                {/* <Effects /> */}
            </Suspense>
        </Canvas>
    )
}

export default MainCanvas
