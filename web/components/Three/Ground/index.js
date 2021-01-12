import React, { Suspense, useEffect, useRef, useMemo } from "react"
import { Canvas, useLoader, useThree, useFrame } from "react-three-fiber"
import { frag, vert } from "../Shaders/scene"
import * as THREE from "three"

const Reaper = props => {
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    const aspect = windowWidth / windowHeight

    const pointer = useMemo(() => {
        return new THREE.Vector2()
    })

    const { camera } = useThree()

    const mesh = useRef()

    const txt = useLoader(THREE.TextureLoader, "/assets/texture2.jpg")

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

    // const material = new THREE.ShaderMaterial({
    //     uniforms: uniforms,
    //     vertexShader: vert,
    //     fragmentShader: frag,
    // })
    useEffect(() => {
        mesh.current.rotation.set(-Math.PI / 2, Math.PI / 2000, Math.PI)
        mesh.current.position.set(0, -10, -100)
    }, [mesh])

    useFrame((state, delta) => {
        uniforms.u_time.value += delta
    })

    // const pointerMove = e => {
    //     pointer.set(e.x / window.innerWidth, 1 - e.y / window.innerHeight)
    //     pointer.x = (e.clientX / window.innerWidth) * 2 - 1
    //     pointer.y = -(e.clientY / window.innerHeight) * 2 + 1
    //     uniforms.u_mouse.value.x = pointer.x
    //     uniforms.u_mouse.value.y = pointer.y
    //     camera.position.set(pointer.x, pointer.y, 100)
    // }

    return (
        <mesh ref={mesh}>
            <planeGeometry args={[10, 300, 1]} />
            <shaderMaterial
                uniforms={uniforms}
                vertexShader={vert}
                fragmentShader={frag}
            />
        </mesh>
    )
}

export default Reaper
