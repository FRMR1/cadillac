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
    // Responsive
    const isTablet = useMediaQuery({ query: "(max-width: 1200px)" })
    const isMobile = useMediaQuery({ query: "(max-width: 700px)" })
    const isLandscape = useMediaQuery({ query: "(orientation: landscape)" })

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
                    pointer={pointer}
                    scroll={props.scroll}
                    isTablet={isTablet}
                    isMobile={isMobile}
                    isLandscape={isLandscape}
                />
                <Dice
                    scroll={props.scroll}
                    pointer={pointer}
                    isTablet={isTablet}
                    isMobile={isMobile}
                    isLandscape={isLandscape}
                />
                <Bullet
                    scroll={props.scroll}
                    pointer={pointer}
                    isTablet={isTablet}
                    isMobile={isMobile}
                    isLandscape={isLandscape}
                />
                <HeroText
                    position={[0, -0.5, -5]}
                    children={"CADILLAC"}
                    pointer={pointer}
                    scroll={props.scroll}
                    isTablet={isTablet}
                    isMobile={isMobile}
                    isLandscape={isLandscape}
                />
                <Background
                    bioRef={props.bioRef}
                    pointer={pointer}
                    route={props.route}
                    scroll={props.scroll}
                />
                {/* <Effects /> */}
            </Suspense>
        </Canvas>
    )
}

export default MainCanvas
