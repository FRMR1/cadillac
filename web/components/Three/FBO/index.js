import { useEffect, useMemo, useRef } from "react"
import { useFrame, useThree, createPortal } from "react-three-fiber"
import { frag, vert } from "../Shaders/fbo"
import gsap from "gsap"
import * as THREE from "three"

const FBO = props => {
    const mesh = useRef()
    const domEl = props.el

    // Render target
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight

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

    // Uniforms
    const uniforms = useMemo(
        () => ({
            uTime: { value: 0.0 },
            uMouse: { value: new THREE.Vector2() },
            uTexture: {
                value: target.texture,
            },
        }),
        []
    )

    // Viewport in camera units
    const calculateUnitSize = zDistance => {
        const fov = 75
        const cameraZ = 5
        const zoom = 4
        const aspect = windowWidth / windowHeight

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

        const { scaleX, scaleY } = getRenderSize(domEl)

        // Set origin to top left
        mesh.current.position.x = -(camUnit.width / 2) + scaleX / 2
        mesh.current.position.y = camUnit.height / 2 - scaleY / 2

        // Set position
        const distToTop = scrollY + domEl.getBoundingClientRect().top

        mesh.current.position.x += (left / windowWidth) * camUnit.width
        mesh.current.position.y -= (distToTop / windowHeight) * camUnit.height
        mesh.current.position.y += scrollY / (windowHeight / camUnit.height)
    }

    // Mouse animations
    const animateX = e => {
        gsap.to(e, {
            duration: 1,
            x: props.pointer.x,
            ease: "inout",
        })
    }

    const animateY = e => {
        gsap.to(e, {
            duration: 1,
            y: props.pointer.y,
            ease: "inout",
        })
    }

    // Scroll
    const scroll = props.scroll
    let scrollY = 0

    scroll.on("scroll", ({ scroll }) => {
        scrollY = scroll.y
    })

    // RAF
    useFrame((state, delta) => {
        // Render size
        const { scaleX, scaleY } = getRenderSize(domEl)
        mesh.current.scale.x = scaleX
        mesh.current.scale.y = scaleY

        // Render position
        updateRenderPosition(domEl)

        // Mouse rotations
        animateX(uniforms.uMouse.value)
        animateY(uniforms.uMouse.value)
        mesh.current.rotation.y = uniforms.uMouse.value.x / 5
        mesh.current.rotation.x = uniforms.uMouse.value.y / -5

        // Render
        state.gl.setRenderTarget(target)
        state.gl.render(scene, state.camera)
        state.gl.setRenderTarget(null)
    })

    return (
        <>
            {createPortal(props.children, scene)}
            <mesh ref={mesh}>
                <planeBufferGeometry args={[1, 1, 1, 1]} />
                <shaderMaterial
                    uniforms={uniforms}
                    vertexShader={vert}
                    fragmentShader={frag}
                    transparent={true}
                />
            </mesh>
        </>
    )
}

export default FBO
