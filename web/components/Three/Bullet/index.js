import React, { useMemo, useRef } from "react"
import { useLoader, useFrame } from "react-three-fiber"
import { frag, vert } from "../Shaders/gold"

import * as THREE from "three"

let OBJLoader

const Bullet = props => {
    const ref1 = useRef()
    const ref2 = useRef()

    // Bullet object
    OBJLoader = require("three/examples/jsm/loaders/OBJLoader").OBJLoader
    const obj = useLoader(OBJLoader, "/assets/bullet.obj")
    const txt = useLoader(THREE.TextureLoader, "/assets/texture.jpg")

    const geometry = obj.children[0].geometry

    const uniforms = useMemo(
        () => ({
            uTexture: {
                value: txt,
            },
        }),
        []
    )

    const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vert,
        fragmentShader: frag,
    })

    // Scroll
    const scroll = props.scroll
    let scrollY = 0

    scroll.on("scroll", ({ scroll }) => {
        scrollY = scroll.y
    })

    // RAF
    let elapsedTime = 0

    useFrame((state, delta) => {
        elapsedTime += delta

        ref1.current.position.y = 0.5
        ref1.current.position.y += scrollY / 240
        ref1.current.rotation.y += 0.022
        ref1.current.position.y += Math.sin(elapsedTime / 2.5) / 5
        ref1.current.scale.set(3, 3, 3)

        ref2.current.position.y = -6.5
        ref2.current.position.y += scrollY / 240
        ref2.current.rotation.y -= 0.022
        ref2.current.position.y += Math.sin(elapsedTime / 2.5) / 5
        ref2.current.scale.set(3, 3, 3)
    })

    return (
        <>
            <mesh
                ref={ref1}
                args={[geometry, material]}
                position={[-2, 0.5, -3]}
            ></mesh>
            <mesh
                ref={ref2}
                args={[geometry, material]}
                position={[1.5, -6, -3]}
            ></mesh>
        </>
    )
}

export default Bullet
