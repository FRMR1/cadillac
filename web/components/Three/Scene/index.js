import { useMemo, useRef, useEffect } from "react"
import { useFrame, useThree, useLoader } from "react-three-fiber"
import { frag, vert } from "../Shaders/bio"
import cadillac from "../../../public/jpg/cadillac.jpg"
import * as THREE from "three"

const Scene = props => {
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

    const txt = useLoader(THREE.TextureLoader, "/jpg/cadillac.jpg")

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

    const calculateUnitSize = zDistance => {
        const fov = 75 // default camera value
        const cameraZ = 65 // default camera value

        const vFov = (fov * Math.PI) / 180

        const height = 2 * Math.tan(vFov / 2) * (cameraZ - zDistance)
        const width = height * aspect

        return { width, height }
    }

    const camUnit = calculateUnitSize(0) // element's z-index === 0

    useFrame((state, delta) => {
        state.gl.setRenderTarget(target)
        state.gl.render(scene, state.camera)
        state.gl.setRenderTarget(null)
    })

    return (
        <mesh>
            <planeBufferGeometry args={[camUnit.width, camUnit.height, 1, 1]} />
            <shaderMaterial
                uniforms={uniforms}
                vertexShader={vert}
                fragmentShader={frag}
            />
        </mesh>
    )
}

export default Scene
