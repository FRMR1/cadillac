import React, { useMemo } from "react"
import { useLoader, useFrame } from "react-three-fiber"
import { frag, vert } from "../Shaders/gold"

import * as THREE from "three"

let OBJLoader

const Dice = props => {
    OBJLoader = require("three/examples/jsm/loaders/OBJLoader").OBJLoader
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

    for (let i = 0; i < obj.children.length; i++) {
        obj.children[i].material = material
    }

    obj.scale.set(0.2, 0.2, 0.2)

    useFrame((state, delta) => {
        obj.rotation.y += 0.03
        obj.position.y += Math.sin(delta / 2) / 400
    })

    return (
        <>
            <primitive position={[2.6, 3.75, -4]} object={obj} />
        </>
    )
}

export default Dice
