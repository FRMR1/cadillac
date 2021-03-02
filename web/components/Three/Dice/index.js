import React, { useUpdate, useMemo, useRef } from "react"
import { useLoader, useFrame } from "react-three-fiber"
import { frag, vert } from "../Shaders/gold"
import * as THREE from "three"

const Dice = ({ isTablet, isMobile, ...props }) => {
    const mesh = useRef()
    const mesh2 = useRef()

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

        mesh.current.scale.set(0.2, 0.2, 0.2)
        mesh.current.position.y = -1
        mesh.current.position.y += scrollY / 240
        mesh.current.rotation.y += 0.03
        mesh.current.position.y += Math.sin(elapsedTime / 5) / 5

        mesh2.current.scale.set(0.2, 0.2, 0.2)
        mesh2.current.position.y = -4
        mesh2.current.position.y += scrollY / 240
        mesh2.current.rotation.y -= 0.03
        mesh2.current.position.y += Math.sin(elapsedTime / 4.5) / 5

        // Responsive
        if (isMobile) {
            mesh.current.scale.set(0.11, 0.11, 0.11)
            mesh2.current.scale.set(0.11, 0.11, 0.11)
            mesh.current.position.x = 0.5
            mesh2.current.position.x = -0.1
        } else if (isTablet) {
            mesh.current.scale.set(0.15, 0.15, 0.15)
            mesh2.current.scale.set(0.15, 0.15, 0.15)
            mesh.current.position.x = 1.5
            mesh2.current.position.x = -1.4
        }
    })

    return (
        <>
            <mesh
                ref={mesh}
                args={[geometry, material]}
                position={[2.6, -1, -4]}
            />
            <mesh
                ref={mesh2}
                args={[geometry, material]}
                position={[-2, -4, -3]}
            />
        </>
    )
}

export default Dice
