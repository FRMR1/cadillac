import * as THREE from "three"
import React, { useMemo, useRef } from "react"
import { useLoader, useUpdate, useFrame } from "react-three-fiber"
import { frag, vert } from "../../Shaders/h1"
import gsap from "gsap"

const H1 = ({
    children,
    vAlign = "center",
    hAlign = "center",
    size = 1,
    color = "#000000",
    ...props
}) => {
    const ref = useRef()
    const group = useRef()

    const domEl = props.el
    const scroll = props.scroll
    let scrollY = 0

    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    const aspect = windowWidth / windowHeight

    const font = useLoader(THREE.FontLoader, "/fonts/ciutadella.json")

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
        }),
        []
    )

    const config = useMemo(
        () => ({
            font,
            size: 1,
            height: 0,
            curveSegments: 20,
            bevelEnabled: true,
            bevelThickness: 0,
            bevelSize: 0,
            bevelOffset: 0,
            bevelSegments: 2,
        }),
        [font]
    )

    const mesh = useUpdate(
        self => {
            // const size = new THREE.Vector3()
            // self.geometry.computeBoundingBox()
            // self.geometry.boundingBox.getSize(size)
            // self.rotation.x = 1
            // self.position.x =
            //     hAlign === "center"
            //         ? -size.x / 2
            //         : hAlign === "right"
            //         ? 0
            //         : -size.x
        },
        [children]
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
        const scaleY = camUnit.height * y

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
        group.current.position.x = -(camUnit.width / 2) + scaleX / 2
        group.current.position.y = camUnit.height / 2 - scaleY / 2

        // Set position
        group.current.position.x += (left / windowWidth) * camUnit.width
    }

    // Scroll
    scroll.on("scroll", ({ scroll }) => {
        scrollY = scroll.y
    })

    useFrame((state, delta) => {
        uniforms.u_time.value += delta

        // Sync size to dom element
        const { scaleX, scaleY } = getRenderSize(domEl)
        group.current.scale.x = scaleX
        group.current.scale.y = scaleY

        // Sync position to dom element + scroll
        updateRenderPosition(domEl, 0)
        const distToTop = scrollY + domEl.getBoundingClientRect().top
        group.current.position.y -= (distToTop / windowHeight) * camUnit.height
        group.current.position.y += scrollY / (windowHeight / camUnit.height)

        // Render
        state.gl.setRenderTarget(target)
        state.gl.render(scene, state.camera)
        state.gl.setRenderTarget(null)
    })

    return (
        // <group ref={group} {...props}>
        <mesh ref={group}>
            {/* <textBufferGeometry args={[children, config]} /> */}
            <planeBufferGeometry args={[1, 1, 1, 1]} />
            <shaderMaterial
                uniforms={uniforms}
                vertexShader={vert}
                fragmentShader={frag}
                transparent={true}
            />
        </mesh>
        // </group>
    )
}

export default H1
