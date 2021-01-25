import * as THREE from "three"
import React, { useMemo, useRef } from "react"
import { useLoader, useUpdate, useFrame } from "react-three-fiber"
import { frag, vert } from "../../Shaders/h1"
import gsap from "gsap"

const H1 = ({
    children,
    vAlign = "center",
    hAlign = "center",
    size = 1,
    color = "#000000",
    ...props
}) => {
    const ref = useRef()

    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    const aspect = windowWidth / windowHeight

    const font = useLoader(THREE.FontLoader, "/fonts/ciutadella.json")
    const txt = useLoader(THREE.TextureLoader, "/assets/hero.jpg")
    const txt2 = useLoader(THREE.TextureLoader, "/assets/texture2.jpg")

    const uniforms = useMemo(
        () => ({
            u_time: { value: 0.0 },
            u_mouse: { value: new THREE.Vector2() },
            u_resolution: { value: { x: windowWidth, y: windowHeight } },
            u_ratio: {
                value: aspect,
            },
        }),
        []
    )

    const config = useMemo(
        () => ({
            font,
            size: 14,
            height: 0,
            curveSegments: 20,
            bevelEnabled: true,
            bevelThickness: 1,
            bevelSize: 0.1,
            bevelOffset: 0,
            bevelSegments: 2,
        }),
        [font]
    )

    const mesh = useUpdate(
        self => {
            const size = new THREE.Vector3()
            self.geometry.computeBoundingBox()
            self.geometry.boundingBox.getSize(size)
            self.rotation.x = 1
            self.position.x =
                hAlign === "center"
                    ? -size.x / 2
                    : hAlign === "right"
                    ? 0
                    : -size.x
            // self.position.y =
            //     vAlign === "center"
            //         ? -size.y / 2
            //         : vAlign === "top"
            //         ? 0
            //         : -size.y
        },
        [children]
    )

    const animateX = e => {
        gsap.to(e, {
            duration: 1,
            x: props.pointer.x,
            ease: "inout",
        })
    }

    const animateY = e => {
        gsap.to(e, {
            duration: 1,
            y: props.pointer.y,
            ease: "inout",
        })
    }

    useFrame((state, delta) => {
        uniforms.u_time.value += delta

        animateX(uniforms.u_mouse.value)
        animateY(uniforms.u_mouse.value)

        state.camera.position.x = 0
        state.camera.position.z = 50
        state.camera.position.y = 0

        mesh.current.position.y =
            Math.sin((uniforms.u_time.value * props.seed) / 2) * 5
        mesh.current.rotation.x += Math.sin(uniforms.u_time.value / 2)

        // mesh.current.rotation.y = 0.3
        mesh.current.rotation.x = 0.5
        // mesh.current.rotation.z = 0.3
    })

    return (
        <group {...props} scale={[0.1 * size, 0.1 * size, 0.1]}>
            <mesh ref={mesh}>
                <textBufferGeometry args={[children, config]} />
                <shaderMaterial
                    uniforms={uniforms}
                    vertexShader={vert}
                    fragmentShader={frag}
                />
            </mesh>
        </group>
    )
}

export default H1
