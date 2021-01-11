import React, { Suspense, useEffect, useRef, useMemo } from "react"
import { Canvas, useLoader, useThree } from "react-three-fiber"
import { frag, vert } from "../Shaders/scene"

import * as THREE from "three"

let OBJLoader

const Reaper = props => {
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    const aspect = windowWidth / windowHeight

    OBJLoader = require("three/examples/jsm/loaders/OBJLoader").OBJLoader
    const group = useRef()
    const obj = useLoader(OBJLoader, "/assets/reaper.obj")

    const uniforms = useMemo(
        () => ({
            u_time: { value: 0.0 },
            u_mouse: { value: new THREE.Vector2() },
            u_resolution: { value: { x: windowWidth, y: windowHeight } },
            u_ratio: {
                value: aspect,
            },
            // u_texture: {
            //     value: target.texture,
            // },
        }),
        []
    )

    console.log(obj)

    const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vert,
        fragmentShader: frag,
    })

    obj.children[0].material = material

    return (
        <primitive
            object={obj}
            position={[0, -6, -5]}
            // children-0-material={material}
        />
    )
}

export default Reaper
