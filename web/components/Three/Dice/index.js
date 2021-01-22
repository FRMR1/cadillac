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

    // const animateX = e => {
    //     gsap.to(e, {
    //         duration: 1,
    //         x: props.pointer.x,
    //         ease: "inout",
    //     })
    // }

    // const animateY = e => {
    //     gsap.to(e, {
    //         duration: 1,
    //         y: props.pointer.y,
    //         ease: "inout",
    //     })
    // }

    const [scroll, setScroll] = useState()

    const handleScroll = () => {
        setScroll(window.pageYOffset)
    }

    useEffect(() => {
        window.addEventListener("scroll", handleScroll)
    })

    const handleScrollPos = scrollPos => {
        let zPos = scrollPos ? scrollPos / 40 : 0
        let xRot = scrollPos ? scrollPos / 500 : 0
        let yPos = scrollPos ? scrollPos / 50 : 0
        return { xRot, zPos, yPos }
    }

    useFrame((state, delta) => {
        uniforms.u_time.value += delta

        // animateX(uniforms.u_mouse.value)
        // animateY(uniforms.u_mouse.value)

        obj.rotation.y += 0.02

        const { xRot, zPos, yPos } = handleScrollPos(scroll)
        obj.position.z = 35
        obj.position.x = -10
        obj.position.y = yPos - 2
        // obj.rotation.x += xRot
    })

    return <primitive object={obj} />
}

export default dice
