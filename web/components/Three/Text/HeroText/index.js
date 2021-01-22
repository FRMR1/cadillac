import React, { useState, useMemo, useRef } from "react"
import { extend, useLoader, useFrame } from "react-three-fiber"
import * as THREE from "three"
import { frag, vert } from "../../Shaders/herotext"
import { Text } from "troika-three-text"

extend({ Text })

const HeroText = prpos => {
    const ref = useRef()

    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    const aspect = windowWidth / windowHeight

    const text = "Cadillac"

    const [opts, setOpts] = useState({
        fontSize: 18,
        maxWidth: 300,
        lineHeight: 1,
        letterSpacing: 0,
        // textAlign: "justify",
    })

    const txt = useLoader(THREE.TextureLoader, "/assets/texture.jpg")

    const uniforms = useMemo(
        () => ({
            u_time: { value: 0.0 },
            u_mouse: { value: new THREE.Vector2() },
            u_resolution: { value: { x: windowWidth, y: windowHeight } },
            u_ratio: {
                value: aspect,
            },
            u_texture: {
                value: txt,
            },
        }),
        []
    )

    useFrame((state, delta) => {
        uniforms.u_time.value += delta

        ref.current.position.y = 80
        ref.current.position.z = -80
    })

    return (
        <text
            ref={ref}
            // position-z={-60}
            // position-y={90}
            {...opts}
            text={text}
            font={
                "https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
            }
            anchorX="center"
            // anchorY="middle"
        >
            <shaderMaterial
                attach="material"
                uniforms={uniforms}
                vertexShader={vert}
                fragmentShader={frag}
            />
        </text>
    )
}

export default HeroText
