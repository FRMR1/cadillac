import { Suspense, useEffect, useState, useMemo } from "react"
import * as THREE from "three"
import { Canvas } from "react-three-fiber"
import dynamic from "next/dynamic"
import { useMediaQuery } from "react-responsive"
import styles from "../../../styles/Canvas.module.scss"

const Background = dynamic(() => import("../Background"), { ssr: false })
const Skull = dynamic(() => import("../Skull"), { ssr: false })
const HeroText = dynamic(() => import("../Text/HeroText"), { ssr: false })
const Dice = dynamic(() => import("../Dice"), { ssr: false })
const Bullet = dynamic(() => import("../Bullet"), { ssr: false })

const MainCanvas = props => {
    const [bodyRef, setBodyRef] = useState()
    const isTablet = useMediaQuery({ query: "(max-width: 1200px)" })
    const isMobile = useMediaQuery({ query: "(max-width: 700px)" })

    useEffect(() => {
        setBodyRef(props.bodyRef.current)
    }, [props.bodyRef])

    // Pointer data
    const pointer = useMemo(() => {
        return new THREE.Vector2()
    })

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
                    isTablet={isTablet}
                    isMobile={isMobile}
                />
                {/* <Dice
                    scroll={props.scroll}
                    pointer={pointer}
                    isTablet={isTablet}
                    isMobile={isMobile}
                />
                <Bullet
                    scroll={props.scroll}
                    pointer={pointer}
                    isTablet={isTablet}
                    isMobile={isMobile}
                />
                <HeroText
                    position={[0, -0.5, -5]}
                    children={"CADILLAC"}
                    pointer={pointer}
                    bodyRef={bodyRef}
                    scroll={props.scroll}
                    isTablet={isTablet}
                    isMobile={isMobile}
                />
                <Background
                    bodyRef={bodyRef}
                    bioRef={props.bioRef}
                    newsRef={props.newsRef}
                    showsRef={props.showsRef}
                    pointer={pointer}
                    route={props.route}
                    scroll={props.scroll}
                /> */}
                {/* <Effects /> */}
            </Suspense>
        </Canvas>
    )
}

export default MainCanvas
