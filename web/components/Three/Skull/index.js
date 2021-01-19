import React, { Suspense, useEffect, useRef, useMemo } from "react"
// import texture from "../../../public/assets/texture.png"
import { Canvas, useLoader, useThree, useFrame } from "react-three-fiber"
import { frag, vert } from "../Shaders/skull"

import * as THREE from "three"

let OBJLoader

const Skull = props => {
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    const aspect = windowWidth / windowHeight

    const { gl, scene } = useThree()

    const txt = useLoader(THREE.TextureLoader, "/assets/texture.jpg")
    const txt2 = useLoader(THREE.TextureLoader, "/assets/texture2.png")

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
            u_texture2: {
                value: txt2,
            },
        }),
        []
    )

    const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vert,
        fragmentShader: frag,
    })

    // const material = new THREE.MeshMatcapMaterial({
    //     matcap: txt,
    // })

    for (let i = 0; i < obj.children.length; i++) {
        obj.children[i].material = material
    }

    useFrame((state, delta) => {
        uniforms.u_time.value += delta
        uniforms.u_mouse.value.x = props.pointer.x
        uniforms.u_mouse.value.y = props.pointer.y
        state.camera.position.x = 0
        state.camera.position.z = 48
        state.camera.position.y = 12
        // obj.rotation.z = obj.rotation.z += 0.01
        obj.rotation.x = Math.PI / 0.64
        obj.rotation.x += (props.pointer.y / 40) * -1
        obj.rotation.z = props.pointer.x / 10
    })

    return <primitive object={obj} />
}

export default Skull
