import { useMemo, useRef } from "react"
import { useFrame } from "react-three-fiber"
import { frag, vert } from "../Shaders/bg"
import FBO from "../FBO"
import BioImage from "../BioImage"

const Background = props => {
    const uniforms = useMemo(
        () => ({
            uTime: { value: 0.0 },
            uScrollPos: {
                value: 0,
            },
        }),
        []
    )

    // Viewport in camera units
    const calculateUnitSize = () => {
        const fov = 75 // default camera value
        const cameraZ = 25
        const zoom = 4

        const windowWidth = window.innerWidth
        const windowHeight = window.innerHeight
        const aspect = windowWidth / windowHeight

        const vFov = (fov * Math.PI) / 180

        const height = (2 * Math.tan(vFov / 2) * cameraZ) / zoom
        const width = height * aspect

        return { width, height }
    }

    const camUnit = calculateUnitSize()

    // Scroll
    let scrollY = 0
    const scroll = props.scroll

    scroll.on("scroll", ({ scroll }) => {
        scrollY = scroll.y
    })

    // RAF
    useFrame((state, delta) => {
        uniforms.uTime.value += delta

        // Camera
        state.camera.position.x = 0
        state.camera.position.z = 5
        state.camera.position.y = 0
        state.camera.zoom = 4
        state.camera.updateProjectionMatrix()

        // Scroll
        uniforms.uScrollPos.value = scrollY
    })

    return (
        <>
            <mesh position={[0, 0, -20]}>
                <planeBufferGeometry
                    args={[camUnit.width, camUnit.height, 1, 1]}
                />
                <shaderMaterial
                    uniforms={uniforms}
                    vertexShader={vert}
                    fragmentShader={frag}
                />
            </mesh>
            {props.route === "/bio" && (
                <FBO
                    el={props.bioRef}
                    pointer={props.pointer}
                    scroll={props.scroll}
                >
                    <BioImage />
                </FBO>
            )}
        </>
    )
}

export default Background
