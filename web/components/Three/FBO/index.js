import { useMemo, useRef } from "react"
import { useFrame, useThree, createPortal } from "react-three-fiber"
import { frag, vert } from "../Shaders/fbo"
import * as THREE from "three"

const FBO = props => {
    const domEl = props.el
    const planeRef = useRef()

    const { camera } = useThree()

    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    const clientHeight = props.bodyRef.clientHeight
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

        const height = 2 * Math.tan(vFov / 2) * cameraZ
        const width = height * aspect

        return { width, height }
    }

    const camUnit = calculateUnitSize() // element's z-distance === 0

    const getRenderSize = el => {
        const {
            left,
            right,
            top,
            bottom,
            width,
            height,
        } = el.getBoundingClientRect()

        const scaleX = (width / windowWidth) * 2
        const scaleY = (height / windowHeight) * 14

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
        planeRef.current.position.x += (left - width) * camUnit.width
        planeRef.current.position.y -= (top / height) * camUnit.height
    }

    useFrame((state, delta) => {
        const { scaleX, scaleY } = getRenderSize(domEl)

        planeRef.current.scale.x = scaleX / 2
        planeRef.current.scale.y = scaleY
        planeRef.current.position.z = -40

        updateRenderPosition(domEl, 0)

        state.gl.setRenderTarget(target)
        state.gl.render(scene, state.camera)
        state.gl.setRenderTarget(null)
    })

    return (
        <>
            {createPortal(props.children, scene)}
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

export default FBO
