import React, { useMemo, useState, useEffect } from "react"
import { useFrame } from "react-three-fiber"
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader"
import gsap from "gsap"
import { frag, vert } from "../Shaders/skull"
import * as THREE from "three"

const Skull = ({ isTablet, isMobile, pointer, scroll }) => {
    // State
    const [skullObject, setSkullObject] = useState()

    // Uniforms
    const uniforms = useMemo(
        () => ({
            uTime: { value: 0.0 },
            uMouse: { value: new THREE.Vector2() },
        }),
        []
    )

    // Skull object
    useEffect(() => {
        const loader = new OBJLoader()
        loader.load("/assets/skull.obj", async obj => {
            obj.scale.set(0.3, 0.3, 0.3)

            const material = new THREE.ShaderMaterial({
                uniforms: uniforms,
                vertexShader: vert,
                fragmentShader: frag,
            })

            for (let i = 0; i < obj.children.length; i++) {
                obj.children[i].material = material
            }

            setSkullObject(obj)
        })
    }, [])

    // Mouse animations
    const animateX = e => {
        gsap.to(e, {
            duration: 1,
            x: pointer.x,
            ease: "inout",
        })
    }

    const animateY = e => {
        gsap.to(e, {
            duration: 1,
            y: pointer.y,
            ease: "inout",
        })
    }

    // Scroll
    let scrollY = 0

    scroll.on("scroll", ({ scroll }) => {
        scrollY = scroll.y
    })

    // RAF
    useFrame((state, delta) => {
        uniforms.uTime.value += delta

        if (skullObject) {
            // Responsive
            if (isMobile) {
                skullObject.scale.set(0.15, 0.15, 0.15)
                skullObject.position.y = -1.8
            } else if (isTablet) {
                skullObject.scale.set(0.2, 0.2, 0.2)
                skullObject.position.y = -2.2
            } else {
                skullObject.scale.set(0.3, 0.3, 0.3)
                skullObject.position.y = -3.5
            }

            // Position/rotation
            skullObject.position.y += scrollY / 150
            skullObject.position.y += Math.sin(uniforms.uTime.value / 1.75) / 2
            skullObject.rotation.x = Math.PI / 0.63
            skullObject.rotation.z = uniforms.uMouse.value.x / 10
            skullObject.rotation.x += uniforms.uMouse.value.y / -10
        }

        // Mouse animations
        animateX(uniforms.uMouse.value)
        animateY(uniforms.uMouse.value)
    })

    return (
        <>
            {skullObject ? (
                <primitive position={[0, -3.5, -15]} object={skullObject} />
            ) : null}
        </>
    )
}

export default Skull
