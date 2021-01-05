import { useMemo, useRef } from "react"
import { useFrame, useThree, createPortal } from "react-three-fiber"
import { frag, vert } from "../Shaders/quad"
import Scene from "../Scene"
import Scene2 from "../Scene2"
import * as THREE from "three"

const Quad = props => {
    const { gl, camera } = useThree()

    const domEl = props.boxRef

    const planeRef = useRef()

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

    const calculateUnitSize = zDistance => {
        const fov = 75 // default camera value
        const cameraZ = 5 // default camera value

        const vFov = (fov * Math.PI) / 180

        const height = 2 * Math.tan(vFov / 2) * (cameraZ - zDistance)
        const width = height * aspect

        return { width, height }
    }

    const camUnit = calculateUnitSize(0) // element's z-index === 0

    const getRenderSize = el => {
        const {
            left,
            right,
            top,
            bottom,
            width,
            height,
        } = el.getBoundingClientRect()

        const scaleX = width / windowWidth
        const scaleY = height / windowHeight

        return { scaleX, scaleY }
    }

    useFrame((state, delta) => {
        // const
        const { scaleX, scaleY } = getRenderSize(domEl)

        // planeRef.current.position.x = left
        // planeRef.current.position.y = 5

        planeRef.current.scale.x = scaleX
        planeRef.current.scale.y = scaleY

        state.gl.setRenderTarget(target)
        state.gl.render(scene, state.camera)
        state.gl.setRenderTarget(null)
    })

    return (
        <>
            {createPortal(
                <Scene boxRef={props.boxRef} pyramidRef={props.pyramidRef} />,
                scene
            )}
            <mesh ref={planeRef}>
                <planeBufferGeometry
                    args={[camUnit.width, camUnit.height, 1, 1]}
                />
                <shaderMaterial
                    uniforms={uniforms}
                    vertexShader={vert}
                    fragmentShader={frag}
                />
            </mesh>
        </>
    )
}

export default Quad
