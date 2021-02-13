import { useEffect, useMemo, useRef } from "react"
import { useFrame, createPortal, useLoader } from "react-three-fiber"
import { frag, vert } from "../Shaders/bio"
import gsap from "gsap"
import * as THREE from "three"

const BioImage = ({ el, children, pointer, scroll }) => {
    const mesh = useRef()
    const geometry = useRef()
    const domElement = el

    // Window size
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    const aspect = windowWidth / windowHeight

    // Loaders
    const img = useLoader(THREE.TextureLoader, "/jpg/cadillac.jpg")
    const txt = useLoader(THREE.TextureLoader, "/jpg/texture.jpg")

    // Uniforms
    const uniforms = useMemo(
        () => ({
            uTime: { value: 0.0 },
            uMouse: { value: new THREE.Vector2() },
            uImage: {
                value: img,
            },
            uTexture: {
                value: txt,
            },
        }),
        []
    )

    // Vertex position animation
    const updateVerticePositions = () => {
        const verticeWidth = 30
        const verticeHeight = 15
        const verticeCount = 496

        const randomArr = new Float32Array(verticeCount)

        for (let i = 0; i < verticeCount; i++) {
            randomArr[i] = Math.random()
        }

        return { verticeWidth, verticeHeight, verticeCount, randomArr }
    }

    const {
        verticeWidth,
        verticeHeight,
        verticeCount,
        randomArr,
    } = updateVerticePositions()

    console.log(randomArr)

    // Viewport in camera units
    const calculateUnitSize = zDistance => {
        const fov = 75
        const cameraZ = 5
        const zoom = 4

        const vFov = (fov * Math.PI) / 180

        const height = (2 * Math.tan(vFov / 2) * cameraZ) / zoom
        const width = height * aspect

        return { width, height }
    }

    const camUnit = calculateUnitSize()

    // Render size
    const getRenderSize = el => {
        const { width, height } = el.getBoundingClientRect()

        const x = width / windowWidth
        const y = height / windowHeight

        const scaleX = camUnit.width * x
        const scaleY = camUnit.height * y

        return { scaleX, scaleY }
    }

    // Render position
    const updateRenderPosition = el => {
        const { left } = el.getBoundingClientRect()

        const { scaleX, scaleY } = getRenderSize(domElement)

        // Set origin to top left
        mesh.current.position.x = -(camUnit.width / 2) + scaleX / 2
        mesh.current.position.y = camUnit.height / 2 - scaleY / 2

        // Set position
        const distToTop = scrollY + domElement.getBoundingClientRect().top

        mesh.current.position.x += (left / windowWidth) * camUnit.width
        mesh.current.position.y -= (distToTop / windowHeight) * camUnit.height
        mesh.current.position.y += scrollY / (windowHeight / camUnit.height)
    }

    // Mouse animations
    const animateX = e => {
        gsap.to(e, {
            duration: 1,
            x: pointer.x,
            ease: "inout",
        })
    }

    const animateY = e => {
        gsap.to(e, {
            duration: 1,
            y: pointer.y,
            ease: "inout",
        })
    }

    // Scroll
    let scrollY = 0

    scroll.on("scroll", ({ scroll }) => {
        scrollY = scroll.y
    })

    // RAF
    useFrame((state, delta) => {
        uniforms.uTime.value += delta

        // Render size
        const { scaleX, scaleY } = getRenderSize(domElement)
        mesh.current.scale.x = scaleX
        mesh.current.scale.y = scaleY

        // Render position
        updateRenderPosition(domElement)

        // Mouse rotations
        animateX(uniforms.uMouse.value)
        animateY(uniforms.uMouse.value)
        mesh.current.rotation.y = uniforms.uMouse.value.x / 5
        mesh.current.rotation.x = uniforms.uMouse.value.y / -5
    })

    console.log("mesh", mesh)

    return (
        <>
            <mesh ref={mesh}>
                <planeBufferGeometry
                    attach="geometry"
                    ref={geometry}
                    args={[1, 1, verticeWidth, verticeHeight]}
                >
                    <bufferAttribute
                        attachObject={["attributes", "aRandom"]}
                        count={verticeCount}
                        array={randomArr}
                        itemSize={1}
                    />
                </planeBufferGeometry>
                <shaderMaterial
                    uniforms={uniforms}
                    vertexShader={vert}
                    fragmentShader={frag}
                    // wireframe={true}
                />
            </mesh>
        </>
    )
}

export default BioImage
