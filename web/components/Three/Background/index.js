import { useMemo } from "react"
import { useFrame, useThree } from "react-three-fiber"
import Quad from "../Quad"
import { frag, vert } from "../Shaders/scene"
import * as THREE from "three"

const Background = props => {
    const { gl, camera } = useThree()

    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    const aspect = windowWidth / windowHeight

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
            u_texture: {
                value: target.texture,
            },
        }),
        []
    )

    const calculateUnitSize = () => {
        const fov = 75 // default camera value
        const cameraZ = 5 // default camera value

        const vFov = (fov * Math.PI) / 180

        const height = 2 * Math.tan(vFov / 2) * cameraZ
        const width = height * aspect

        return { width, height }
    }

    const camUnit = calculateUnitSize()

    useFrame((state, delta) => {
        gl.render(scene, camera)
    })

    return (
        <>
            <mesh {...props}>
                <planeBufferGeometry
                    args={[camUnit.width, camUnit.height, 1, 1]}
                />
                <shaderMaterial
                    uniforms={uniforms}
                    vertexShader={vert}
                    fragmentShader={frag}
                />
            </mesh>
            <Quad boxRef={props.boxRef} pyramidRef={props.pyramidRef} />
        </>
    )
}

export default Background
