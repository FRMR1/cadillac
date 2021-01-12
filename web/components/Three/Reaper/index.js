import React, { Suspense, useEffect, useRef, useMemo } from "react"
// import texture from "../../../public/assets/texture.png"
import { Canvas, useLoader, useThree, useFrame } from "react-three-fiber"
import { frag, vert } from "../Shaders/scene"

import * as THREE from "three"

let OBJLoader

const Reaper = props => {
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    const aspect = windowWidth / windowHeight

    const txt = useLoader(THREE.TextureLoader, "/assets/texture.jpg")

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
            u_texture: {
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

    obj.children[0].material = material

    useFrame((state, delta) => {
        uniforms.u_time.value += delta
        state.camera.position.z = 10
        state.camera.position.y = 6
    })

    return <primitive object={obj} />
}

export default Reaper
