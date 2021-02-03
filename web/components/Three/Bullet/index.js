import React, { Suspense, useState, useEffect, useRef, useMemo } from "react"
import { Canvas, useLoader, useThree, useFrame } from "react-three-fiber"
import gsap from "gsap"
import { frag, vert } from "../Shaders/dice"

import * as THREE from "three"

let OBJLoader

const Bullet = props => {
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    const aspect = windowWidth / windowHeight

    const { gl, scene } = useThree()

    const txt = useLoader(THREE.TextureLoader, "/assets/texture.jpg")
    // const txt2 = useLoader(THREE.TextureLoader, "/assets/texture2.jpg")

    OBJLoader = require("three/examples/jsm/loaders/OBJLoader").OBJLoader
    const group = useRef()
    const obj = useLoader(OBJLoader, "/assets/bullet.obj")

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

    const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vert,
        fragmentShader: frag,
    })

    for (let i = 0; i < obj.children.length; i++) {
        obj.children[i].material = material
    }

    obj.scale.set(3.3, 3.3, 3.3)

    useFrame((state, delta) => {
        uniforms.u_time.value += delta

        obj.rotation.y += 0.022
        obj.position.y += Math.sin(uniforms.u_time.value / 3) / 300
    })

    return (
        <>
            <primitive position={[-1.6, 5.75, -4]} object={obj} />
        </>
    )
}

export default Bullet
