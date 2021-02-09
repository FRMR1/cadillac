import React, { useMemo } from "react"
import { useLoader, useFrame } from "react-three-fiber"
import { frag, vert } from "../Shaders/gold"

import * as THREE from "three"

let OBJLoader

const Bullet = props => {
    OBJLoader = require("three/examples/jsm/loaders/OBJLoader").OBJLoader
    const obj = useLoader(OBJLoader, "/assets/bullet.obj")
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

    for (let i = 0; i < obj.children.length; i++) {
        obj.children[i].material = material
    }

    obj.scale.set(3.3, 3.3, 3.3)

    useFrame((state, delta) => {
        obj.rotation.y += 0.022
        obj.position.y += Math.sin(delta / 3) / 300
    })

    return (
        <>
            <primitive position={[-1.8, 5.95, -4]} object={obj} />
        </>
    )
}

export default Bullet
