import React, { useMemo } from "react"
import { useLoader, useFrame } from "react-three-fiber"
import { frag, vert } from "../Shaders/gold"

import * as THREE from "three"

let OBJLoader

const Bullet = props => {
    const scroll = props.scroll
    let scrollY = 0

    OBJLoader = require("three/examples/jsm/loaders/OBJLoader").OBJLoader
    const obj = useLoader(OBJLoader, "/assets/bullet.obj")
    const txt = useLoader(THREE.TextureLoader, "/assets/texture.jpg")

    let elapsedTime = 0

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

    for (let i = 0; i < obj.children.length; i++) {
        obj.children[i].material = material
    }

    obj.scale.set(5, 5, 5)

    scroll.on("scroll", ({ scroll }) => {
        scrollY = scroll.y
    })

    useFrame((state, delta) => {
        elapsedTime += delta

        obj.position.y = 0.5
        obj.position.y += scrollY / 250

        obj.rotation.y += 0.022
        obj.position.y += Math.sin(elapsedTime / 0.55) / 570
    })

    return (
        <>
            <primitive position={[-3, 0.5, -8]} object={obj} />
        </>
    )
}

export default Bullet
