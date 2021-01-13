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

    const { gl, scene } = useThree()

    const txt = useLoader(THREE.TextureLoader, "/assets/texture.png")

    OBJLoader = require("three/examples/jsm/loaders/OBJLoader").OBJLoader
    const group = useRef()
    const obj = useLoader(OBJLoader, "/assets/skull.obj")

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

    for (let i = 0; i < obj.children.length; i++) {
        obj.children[i].material = material
    }

    console.log(obj)

    useFrame((state, delta) => {
        uniforms.u_time.value += delta
        state.camera.position.x = 0
        state.camera.position.z = 43
        state.camera.position.y = 12
        obj.rotation.z = obj.rotation.z += 0.005
        obj.rotation.x = Math.PI / 0.65
    })

    return <primitive object={obj} />
}

export default Reaper
