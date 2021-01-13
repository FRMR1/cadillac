import { useMemo, useRef } from "react"
import { useFrame, useThree } from "react-three-fiber"
import Quad from "../Quad"
import { frag, vert } from "../Shaders/bg"
import * as THREE from "three"

const Background = props => {
    const domEl = props.bodyRef
    const planeRef = useRef()

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
        const cameraZ = 150 // default camera value

        const vFov = (fov * Math.PI) / 180

        const height = 2 * Math.tan(vFov / 2) * cameraZ
        const width = height * aspect

        return { width, height }
    }

    const camUnit = calculateUnitSize()

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

    const updateRenderPosition = (el, scrollY) => {
        const {
            left,
            right,
            top,
            bottom,
            width,
            height,
        } = el.getBoundingClientRect()

        // Set origin to top left
        planeRef.current.position.x = -(camUnit.width / 2)
        planeRef.current.position.y = camUnit.height / 2

        // Set position
        planeRef.current.position.x +=
            (left / windowWidth) * camUnit.width +
            (camUnit.width * planeRef.current.scale.x) / 2
        planeRef.current.position.y -=
            ((top - scrollY) / windowHeight / 2) * camUnit.height +
            (camUnit.height * planeRef.current.scale.y) / 2
    }

    useFrame((state, delta) => {
        const { scaleX, scaleY } = getRenderSize(domEl)

        planeRef.current.scale.x = scaleX
        planeRef.current.scale.y = scaleY

        updateRenderPosition(domEl, 0)

        uniforms.u_time.value += delta

        gl.render(scene, camera)
    })

    return (
        <>
            <mesh position={[0, 0, 0]} ref={planeRef}>
                <planeBufferGeometry
                    args={[camUnit.width, camUnit.height * 2, 1, 1]}
                />
                <shaderMaterial
                    uniforms={uniforms}
                    vertexShader={vert}
                    fragmentShader={frag}
                />
            </mesh>
            {/* <Quad domEl={props.boxRef} />
            <Quad domEl={props.pyramidRef} /> */}
        </>
    )
}

export default Background
