import * as THREE from "three"
import React, { useMemo, useRef } from "react"
import { useLoader, useUpdate, useFrame } from "react-three-fiber"
import { frag, vert } from "../../Shaders/herotext"

export default function Text({
    children,
    vAlign = "center",
    hAlign = "center",
    size = 1,
    color = "#000000",
    ...props
}) {
    const ref = useRef()

    const domEl = props.bodyRef
    const domElRect = domEl.getBoundingClientRect()

    const windowWidth = window.innerWidth
    const pageHeight = domElRect.height
    const heightToWidthRatio = pageHeight / windowWidth

    const font = useLoader(THREE.FontLoader, "/fonts/victorian.json")

    const uniforms = useMemo(
        () => ({
            uTime: { value: 0.0 },
        }),
        []
    )

    const config = useMemo(
        () => ({
            font,
            size: 10,
            height: 0.1,
            curveSegments: 20,
            bevelEnabled: true,
            bevelThickness: 1,
            bevelSize: 0.2,
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
        },
        [children]
    )

    useFrame((state, delta) => {
        uniforms.uTime.value += delta
        mesh.current.position.y += Math.sin(uniforms.uTime.value / 1.5) / 60
        mesh.current.rotation.x += Math.sin(uniforms.uTime.value / 2)
        mesh.current.rotation.x = 0.5
    })

    return (
        <group
            {...props}
            scale={[
                size * heightToWidthRatio * 0.1,
                size * heightToWidthRatio * 0.1,
                0.1 * heightToWidthRatio * 0.1,
            ]}
        >
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
