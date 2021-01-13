import React, { useRef, useEffect } from "react"
import { extend, useThree, useFrame } from "react-three-fiber"
import dynamic from "next/dynamic"
import * as THREE from "three"

let EffectComposer, RenderPass, FilmPass

extend({ EffectComposer, RenderPass, FilmPass })

const Effects = props => {
    const composer = useRef()
    const { scene, gl, size, camera } = useThree()

    const width = window.innerWidth
    const height = window.innerHeight

    EffectComposer = require("three/examples/jsm/postprocessing/EffectComposer")
        .EffectComposer
    RenderPass = require("three/examples/jsm/postprocessing/RenderPass")
        .RenderPass
    FilmPass = require("three/examples/jsm/postprocessing/FilmPass").FilmPass

    window.THREE = require("three")

    const uniforms = {
        tDiffuse: { value: null },
        resolution: { value: new THREE.Vector2(1 / width, 1 / height) },
    }

    useEffect(() => void composer.current.setSize(size.width, size.height), [
        size,
    ])

    useFrame(() => composer.current.render(), 1)

    return (
        <effectComposer ref={composer} args={[gl]}>
            {/* <renderPass attachArray="passes" scene={scene} camera={camera} /> */}
            <filmPass attachArray="passes" args={[1, 0, 0, false]} />
        </effectComposer>
    )
}

export default Effects
