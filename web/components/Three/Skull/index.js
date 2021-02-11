import React, { useMemo } from "react"
import { useLoader, useFrame } from "react-three-fiber"
import gsap from "gsap"
import { frag, vert } from "../Shaders/skull"
import * as THREE from "three"

let OBJLoader

const Skull = props => {
    const uniforms = useMemo(
        () => ({
            uTime: { value: 0.0 },
            uMouse: { value: new THREE.Vector2() },
        }),
        []
    )

    // Skull object
    const getObject = () => {
        OBJLoader = require("three/examples/jsm/loaders/OBJLoader").OBJLoader
        const obj = useLoader(OBJLoader, "/assets/skull.obj")
        obj.scale.set(0.3, 0.3, 0.3)

        const material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: vert,
            fragmentShader: frag,
        })

        for (let i = 0; i < obj.children.length; i++) {
            obj.children[i].material = material
        }

        return obj
    }

    const skullObject = getObject()

    // Mouse animations
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

    // Scroll
    let scrollY = 0
    const scroll = props.scroll

    scroll.on("scroll", ({ scroll }) => {
        scrollY = scroll.y
    })

    // RAF
    useFrame((state, delta) => {
        uniforms.uTime.value += delta

        // Position/rotation
        skullObject.position.y = -4
        skullObject.position.y += scrollY / 80
        skullObject.position.y += Math.sin(uniforms.uTime.value / 1.75) / 170
        skullObject.rotation.x = Math.PI / 0.63
        skullObject.rotation.z = uniforms.uMouse.value.x / 10
        skullObject.rotation.x += uniforms.uMouse.value.y / -10

        // Mouse animations
        animateX(uniforms.uMouse.value)
        animateY(uniforms.uMouse.value)
    })

    return <primitive position={[0, -4, -15]} object={skullObject} />
}

export default Skull
