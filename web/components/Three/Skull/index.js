import React, { useEffect, useContext, useMemo } from "react"
import { useLoader, useFrame } from "react-three-fiber"
import { SmoothScrollContext } from "../../../contexts/SmoothScroll.context"
import gsap from "gsap"
import { frag, vert } from "../Shaders/skull"

import * as THREE from "three"

let OBJLoader

const Skull = props => {
    const scroll = props.scroll
    let scrollY = 0

    const domEl = props.bodyRef
    const domElRect = domEl.getBoundingClientRect()

    const windowWidth = window.innerWidth
    const pageHeight = domElRect.height
    const heightToWidthRatio = pageHeight / windowWidth

    OBJLoader = require("three/examples/jsm/loaders/OBJLoader").OBJLoader
    const obj = useLoader(OBJLoader, "/assets/skull.obj")

    const uniforms = useMemo(
        () => ({
            uTime: { value: 0.0 },
            uMouse: { value: new THREE.Vector2() },
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

    const animateX = e => {
        gsap.to(e, {
            duration: 1,
            x: props.pointer.x,
            ease: "inout",
        })
    }

    const animateY = e => {
        gsap.to(e, {
            duration: 1,
            y: props.pointer.y,
            ease: "inout",
        })
    }

    obj.scale.set(0.3, 0.3, 0.3)

    scroll.on("scroll", ({ scroll }) => {
        scrollY = scroll.y
    })

    useFrame((state, delta) => {
        uniforms.uTime.value += delta

        animateX(uniforms.uMouse.value)
        animateY(uniforms.uMouse.value)

        obj.position.y = -4
        obj.position.y += scrollY / 80
        obj.rotation.x = Math.PI / 0.63
        obj.rotation.z = uniforms.uMouse.value.x / 10
        obj.rotation.x += uniforms.uMouse.value.y / -10
        obj.position.y += Math.sin(uniforms.uTime.value / 1.75) / 170
    })

    return (
        <primitive
            position={[0, -4, -15]}
            onPointerOver={() => animateSetting(uniforms.u_setting)}
            object={obj}
        />
    )
}

export default Skull
