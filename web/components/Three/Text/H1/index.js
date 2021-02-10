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
    const domEl = props.el

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
            const size = new THREE.Vector3()
            self.geometry.computeBoundingBox()
            self.geometry.boundingBox.getSize(size)
            // self.rotation.x = 1
            self.position.x =
                hAlign === "center"
                    ? -size.x / 2
                    : hAlign === "right"
                    ? 0
                    : -size.x
        },
        [children]
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

        const { scaleX, scaleY } = getRenderSize(domEl)

        // Set origin to top left
        planeRef.current.position.x = -(camUnit.width / 2) + scaleX / 2
        planeRef.current.position.y = camUnit.height / 2 - scaleY / 2

        // Set position
        planeRef.current.position.x += (left / windowWidth) * camUnit.width
        planeRef.current.position.y -= (top / windowHeight) * camUnit.height
    }

    useFrame((state, delta) => {
        uniforms.u_time.value += delta

        const { scaleX, scaleY } = getRenderSize(domEl)

        // planeRef.current.scale.x = scaleX / 2
        // planeRef.current.scale.y = scaleY
        // planeRef.current.position.z = 0

        // updateRenderPosition(domEl, 0)

        // state.gl.setRenderTarget(target)
        // state.gl.render(scene, state.camera)
        // state.gl.setRenderTarget(null)
    })

    return (
        <group {...props}>
            <mesh ref={mesh}>
                <textBufferGeometry args={[children, config]} />
                {/* <boxBufferGeometry args={[1, 1, 1]} /> */}
                <shaderMaterial
                    uniforms={uniforms}
                    vertexShader={vert}
                    fragmentShader={frag}
                    transparent={true}
                />
            </mesh>
        </group>
    )
}

export default H1
