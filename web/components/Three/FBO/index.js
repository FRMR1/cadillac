import { useEffect, useMemo, useRef } from "react"
import { useFrame, useThree, createPortal } from "react-three-fiber"
import { frag, vert } from "../Shaders/fbo"
import gsap from "gsap"
import * as THREE from "three"

const FBO = props => {
    const planeRef = useRef()

    const domEl = props.el
    const scroll = props.scroll
    let scrollY = 0

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
            uTime: { value: 0.0 },
            uMouse: { value: new THREE.Vector2() },
            uPercent: {
                value: 1.0,
            },
            uTexture: {
                value: target.texture,
            },
        }),
        []
    )

    const calculateUnitSize = zDistance => {
        const fov = 75 // default camera value
        const cameraZ = 5 // default camera value
        const zoom = 4

        const vFov = (fov * Math.PI) / 180

        const height = (2 * Math.tan(vFov / 2) * cameraZ) / zoom
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

        const x = width / windowWidth
        const y = height / windowHeight

        const scaleX = camUnit.width * x
        const scaleY = camUnit.height * x

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

        const { scaleX, scaleY } = getRenderSize(domEl)

        // Set origin to top left
        planeRef.current.position.x = -(camUnit.width / 2) + scaleX / 2
        planeRef.current.position.y = camUnit.height / 2 - scaleY / 2

        // Set position
        planeRef.current.position.x += (left / windowWidth) * camUnit.width
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
    scroll.on("scroll", ({ scroll }) => {
        scrollY = scroll.y
    })

    useFrame((state, delta) => {
        // Sync size to dom element
        const { scaleX, scaleY } = getRenderSize(domEl)
        planeRef.current.scale.x = scaleX
        planeRef.current.scale.y = scaleY

        // Sync position to dom element + scroll
        updateRenderPosition(domEl, 0)
        const distToTop = scrollY + domEl.getBoundingClientRect().top
        planeRef.current.position.y -=
            (distToTop / windowHeight) * camUnit.height
        planeRef.current.position.y += scrollY / (windowHeight / camUnit.height)

        // Mouse rotations
        animateX(uniforms.uMouse.value)
        animateY(uniforms.uMouse.value)

        planeRef.current.rotation.y = uniforms.uMouse.value.x / 5
        planeRef.current.rotation.x = uniforms.uMouse.value.y / -5

        // Render
        state.gl.setRenderTarget(target)
        state.gl.render(scene, state.camera)
        state.gl.setRenderTarget(null)
    })

    return (
        <>
            {createPortal(props.children, scene)}
            <mesh ref={planeRef}>
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
