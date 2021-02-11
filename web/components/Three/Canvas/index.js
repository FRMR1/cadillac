import { Suspense, useEffect, useState, useMemo } from "react"
import * as THREE from "three"
import { Canvas } from "react-three-fiber"
import Background from "../Background"
import Skull from "../Skull"
import HeroText from "../Text/HeroText"
import H1 from "../Text/H1"
import Dice from "../Dice"
import Bullet from "../Bullet"
import FBO from "../FBO"
// import Effects from "../Effects"
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
                <Skull
                    bodyRef={bodyRef}
                    pointer={pointer}
                    scroll={props.scroll}
                />
                <Dice scroll={props.scroll} pointer={pointer} />
                <Bullet scroll={props.scroll} pointer={pointer} />
                <HeroText
                    position={[0, -0.5, -5]}
                    children={"CADILLAC"}
                    pointer={pointer}
                    bodyRef={bodyRef}
                    scroll={props.scroll}
                />
                <Background
                    bodyRef={bodyRef}
                    bioRef={props.bioRef}
                    newsRef={props.newsRef}
                    showsRef={props.showsRef}
                    pointer={pointer}
                    route={props.route}
                    scroll={props.scroll}
                />
                {props.route === "/" && (
                    <>
                        <H1
                            el={props.newsRef}
                            position={[0, 0, 0]}
                            children={"NEWS"}
                            pointer={pointer}
                            scroll={props.scroll}
                        />
                        <H1
                            el={props.showsRef}
                            position={[0, 0, 0]}
                            children={"UPCOMING SHOWS"}
                            scroll={props.scroll}
                            pointer={pointer}
                        />
                    </>
                )}
                {/* <Effects /> */}
            </Suspense>
        </Canvas>
    )
}

export default MainCanvas
