import * as THREE from "three"
import React, { useMemo, useRef } from "react"
import { useLoader, useUpdate, useFrame } from "react-three-fiber"
import { frag, vert } from "../../Shaders/gold"
import gsap from "gsap"

const H1 = ({
    children,
    vAlign = "center",
    hAlign = "center",
    size = 0.1,
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

    // Loaders
    const font = useLoader(THREE.FontLoader, "/fonts/victorian.json")
    const txt = useLoader(THREE.TextureLoader, "/assets/texture.jpg")

    const uniforms = useMemo(
        () => ({
            uTime: { value: 0.0 },
            uMouse: { value: new THREE.Vector2() },
            uResolution: { value: { x: windowWidth, y: windowHeight } },
            uRatio: {
                value: aspect,
            },
            uTexture: {
                value: txt,
            },
        }),
        []
    )

    const config = useMemo(
        () => ({
            font,
            size: 0.15,
            height: 0.1,
            curveSegments: 20,
            bevelEnabled: true,
            bevelThickness: 0,
            bevelSize: 0.001,
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
            self.rotation.x = 1
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
        const distToTop = scrollY + domEl.getBoundingClientRect().top

        group.current.position.x += (left / windowWidth) * camUnit.width
        group.current.position.y -= (distToTop / windowHeight) * camUnit.height
        group.current.position.y += scrollY / (windowHeight / camUnit.height)
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
        console.log(windowHeight, scrollY, camUnit.height)
    })

    const distToTop = scrollY + domEl.getBoundingClientRect().top

    const sizeVec3 = new THREE.Vector3()

    useFrame((state, delta) => {
        uniforms.uTime.value += delta

        // Sync position to dom element + scroll
        updateRenderPosition(domEl, 0)

        // Mouse rotations
        animateX(uniforms.uMouse.value)
        animateY(uniforms.uMouse.value)

        // scrollY = scroll.y
        // group.current.position.y += scrollY / (distToTop / camUnit.height)

        group.current.rotation.y = uniforms.uMouse.value.x / 5
        group.current.rotation.x = uniforms.uMouse.value.y / -5

        // Mesh update
        group.current.geometry.computeBoundingBox()
        group.current.geometry.boundingBox.getSize(sizeVec3)
        // group.current.rotation.x = 1
        group.current.position.x =
            hAlign === "center"
                ? -sizeVec3.x / 2
                : hAlign === "right"
                ? 0
                : -sizeVec3.x
    })

    return (
        <mesh ref={group}>
            <textBufferGeometry args={[children, config]} />
            <shaderMaterial
                uniforms={uniforms}
                vertexShader={vert}
                fragmentShader={frag}
            />
        </mesh>
    )
}

export default H1
