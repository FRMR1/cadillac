import React, { useMemo } from "react"

import * as THREE from "three"
import { useFrame } from "react-three-fiber"
import { vert } from "../Shaders/vert"
import { frag } from "../Shaders/frag"

const Geometry = props => {
    const width = window.innerWidth
    const height = window.innerHeight

    const pointer = useMemo(() => {
        return new THREE.Vector2()
    })

    const uniforms = useMemo(
        () => ({
            u_time: { value: 0.0 },
            u_resolution: { value: { x: width, y: height } },
            u_ratio: {
                value: window.innerWidth / window.innerHeight,
            },
            u_mouse: { value: new THREE.Vector2() },
            u_speed: {
                value: 0,
            },
        }),
        []
    )

    useFrame((state, delta) => {
        uniforms.u_time.value += delta
    })

    const pointerMove = e => {
        pointer.set(e.x / window.innerWidth, 1 - e.y / window.innerHeight)
        pointer.x = (e.clientX / window.innerWidth) * 2 - 1
        pointer.y = -(e.clientY / window.innerHeight) * 2 + 1
        uniforms.u_mouse.value.x = pointer.x
        uniforms.u_mouse.value.y = pointer.y
    }

    return (
        <>
            <mesh onPointerMove={pointerMove}>
                <planeBufferGeometry args={[4, 4]} />
                <shaderMaterial
                    uniforms={uniforms}
                    vertexShader={vert}
                    fragmentShader={frag}
                />
            </mesh>
        </>
    )
}

export default Geometry
