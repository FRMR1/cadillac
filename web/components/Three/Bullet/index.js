import React, { useMemo, useRef } from "react"
import { useLoader, useFrame } from "react-three-fiber"
import { frag, vert } from "../Shaders/gold"

import * as THREE from "three"

let OBJLoader

const Bullet = ({ isTablet, isMobile, ...props }) => {
    const mesh = useRef()
    const mesh2 = useRef()

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

        mesh.current.position.y = 0.5
        mesh.current.position.y += scrollY / 240
        mesh.current.rotation.y += 0.022
        mesh.current.position.y += Math.sin(elapsedTime / 2.5) / 5
        mesh.current.scale.set(3, 3, 3)

        mesh2.current.position.y = -6.5
        mesh2.current.position.y += scrollY / 240
        mesh2.current.rotation.y -= 0.022
        mesh2.current.position.y += Math.sin(elapsedTime / 2.5) / 5
        mesh2.current.scale.set(3, 3, 3)

        // Responsive
        if (isMobile) {
            mesh.current.scale.set(1.5, 1.5, 1.5)
            mesh2.current.scale.set(1.5, 1.5, 1.5)
            mesh.current.position.x = -0.5
            mesh2.current.position.x = 0.3
        } else if (isTablet) {
            mesh.current.scale.set(2.3, 2.3, 2.3)
            mesh2.current.scale.set(2.3, 2.3, 2.3)
            mesh.current.position.x = -1.5
            mesh2.current.position.x = 1
        }
    })

    return (
        <>
            <mesh
                ref={mesh}
                args={[geometry, material]}
                position={[-2, 0.5, -3]}
            />
            <mesh
                ref={mesh2}
                args={[geometry, material]}
                position={[1.5, -8, -3]}
            />
        </>
    )
}

export default Bullet
