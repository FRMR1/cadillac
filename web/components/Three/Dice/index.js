import React, { useEffect, useMemo, useRef } from "react"
import { useLoader, useFrame } from "react-three-fiber"
import { frag, vert } from "../Shaders/gold"
import * as THREE from "three"

const Dice = props => {
    const ref = useRef()
    const ref2 = useRef()

    // Dice instances
    const OBJLoader = require("three/examples/jsm/loaders/OBJLoader").OBJLoader
    const obj = useLoader(OBJLoader, "/assets/dice.obj")
    const txt = useLoader(THREE.TextureLoader, "/assets/texture.jpg")

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

    const geometry = obj.children[0].geometry

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

        ref.current.scale.set(0.2, 0.2, 0.2)
        ref.current.position.y = -1
        ref.current.position.y += scrollY / 240
        ref.current.rotation.y += 0.03
        ref.current.position.y += Math.sin(elapsedTime / 5) / 5

        ref2.current.scale.set(0.2, 0.2, 0.2)
        ref2.current.position.y = -4
        ref2.current.position.y += scrollY / 240
        ref2.current.rotation.y -= 0.03
        ref2.current.position.y += Math.sin(elapsedTime / 4.5) / 5
    })

    console.log(ref)

    return (
        <>
            <mesh
                ref={ref}
                args={[geometry, material]}
                position={[2.6, -1, -4]}
            ></mesh>
            <mesh
                ref={ref2}
                args={[geometry, material]}
                position={[-2, -4, -3]}
            ></mesh>
        </>
    )
}

export default Dice
