import React, { Suspense, useState, useEffect, useRef, useMemo } from "react"
import { Canvas, useLoader, useThree, useFrame } from "react-three-fiber"
import gsap from "gsap"
import { frag, vert } from "../Shaders/dice"

import * as THREE from "three"

let OBJLoader

const dice = props => {
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    const aspect = windowWidth / windowHeight

    const { gl, scene } = useThree()

    const txt = useLoader(THREE.TextureLoader, "/assets/texture.jpg")
    // const txt2 = useLoader(THREE.TextureLoader, "/assets/texture2.jpg")

    OBJLoader = require("three/examples/jsm/loaders/OBJLoader").OBJLoader
    const group = useRef()
    const obj = useLoader(OBJLoader, "/assets/dice.obj")

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
            // u_texture2: {
            //     value: txt2,
            // },
        }),
        []
    )

    const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vert,
        fragmentShader: frag,
    })

    // const material = new THREE.MeshMatcapMaterial({
    //     matcap: txt,
    // })

    for (let i = 0; i < obj.children.length; i++) {
        obj.children[i].material = material
    }

    useEffect(() => {
        const element = obj.position
        gsap.to(element, {
            y: () => element.y - 20,
            ease: "none",
            scrollTrigger: {
                trigger: document.body,
                invalidateOnRefresh: true,
                start: "top top",
                end: "bottom bottom",
                scrub: 1,
            },
        })
    }, [])

    useFrame((state, delta) => {
        uniforms.u_time.value += delta

        obj.rotation.y += 0.02
    })

    return <primitive position={[-12, 2, 5]} object={obj} />
}

export default dice
