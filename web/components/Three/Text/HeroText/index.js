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
    isTablet,
    isMobile,
    isLandscape,
    ...props
}) {
    // Font config
    const font = useLoader(THREE.FontLoader, "/fonts/victorian.json")

    const config = useMemo(
        () => ({
            font,
            size: 20,
            height: 5,
            curveSegments: 20,
            bevelEnabled: true,
            bevelThickness: 1,
            bevelSize: 0.2,
            bevelOffset: 0,
            bevelSegments: 2,
        }),
        [font]
    )

    // Mesh
    const uniforms = useMemo(
        () => ({
            uTime: { value: 0.0 },
        }),
        []
    )

    const mesh = useUpdate(
        self => {
            const size = new THREE.Vector3()
            self.geometry.computeBoundingBox()
            self.geometry.boundingBox.getSize(size)
            self.rotation.x = 1

            // Center the text after responsive rescaling
            if (isMobile && isLandscape) {
                self.position.x = (-size.x * 0.8) / 2
            } else if (isMobile && !isLandscape) {
                self.position.x = (-size.x * 0.3) / 2
            } else if (isTablet && !isLandscape) {
                self.position.x = (-size.x * 0.4) / 2
            } else if (isTablet && isLandscape) {
                self.position.x = (-size.x * 0.7) / 2
            } else {
                self.position.x = -size.x / 2
            }
        },
        [children, isTablet, isMobile, isLandscape]
    )

    // Scroll
    let scrollY = 0
    const scroll = props.scroll

    scroll.on("scroll", ({ scroll }) => {
        scrollY = scroll.y
    })

    // Set responsive scale
    const setScale = () => {
        if (isMobile && isLandscape) {
            mesh.current.scale.set(0.8, 0.8, 0.8)
            return
        } else if (isMobile) {
            mesh.current.scale.set(0.3, 0.3, 0.3)
            return
        } else if (isTablet && !isLandscape) {
            mesh.current.scale.set(0.4, 0.4, 0.4)
            return
        } else if (isTablet && isLandscape) {
            mesh.current.scale.set(0.7, 0.7, 0.7)
            return
        } else {
            mesh.current.scale.set(1, 1, 1)
            return
        }
    }

    console.log("IS TABLET: ", isTablet)

    // RAF
    useFrame((state, delta) => {
        uniforms.uTime.value += delta
        // Animation
        isTablet && !isLandscape
            ? (mesh.current.position.y = 5)
            : (mesh.current.position.y = -0.5)
        mesh.current.position.y += scrollY / 11
        mesh.current.position.y += Math.sin(uniforms.uTime.value / 1.5)
        mesh.current.rotation.x = 0.1

        // Scale
        setScale()
    })

    return (
        <group {...props} scale={[0.05, 0.05, 0.05]}>
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
