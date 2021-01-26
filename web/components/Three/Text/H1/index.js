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

    const [scene, target] = useMemo(() => {
        const scene = new THREE.Scene()
        const target = new THREE.WebGLMultisampleRenderTarget(
            windowWidth,
            windowHeight,
            {
                format: THREE.RGBFormat,
                stencilBuffer: false,
                depthBuffer: true,
                depthWrite: true,
                depthTest: true,
            }
        )
        return [scene, target]
    }, [])

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

    useFrame((state, delta) => {
        uniforms.u_time.value += delta

        state.gl.setRenderTarget(target)
        state.gl.render(scene, state.camera)
        state.gl.setRenderTarget(null)
    })

    return (
        <group {...props} scale={[size / 5, size * 4, 0.1]}>
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
