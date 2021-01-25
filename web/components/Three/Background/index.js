import { useMemo, useRef, useState, useEffect } from "react"
import { useFrame, useThree } from "react-three-fiber"
import FBO from "../FBO"
import H1 from "../Text/H1"
import BioImage from "../BioImage"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/dist/ScrollTrigger"
import { frag, vert } from "../Shaders/bg"
// import { Text } from "troika-three-text"

import * as THREE from "three"

const Background = props => {
    const domEl = props.bodyRef
    const planeRef = useRef()

    console.log("bg props", props)

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
        const cameraZ = 95 // default camera value

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
            ((top - scrollY) / windowHeight / 10) * camUnit.height +
            camUnit.height * planeRef.current.scale.y
    }

    useFrame((state, delta) => {
        const { scaleX, scaleY } = getRenderSize(domEl)

        planeRef.current.scale.x = scaleX
        planeRef.current.scale.y = scaleY
        planeRef.current.position.z = -80

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
            {props.route === "/bio" && (
                <FBO el={props.bioRef} pointer={props.pointer}>
                    <BioImage />
                </FBO>
            )}
            {props.route === "/" && (
                <>
                    <FBO el={props.newsRef} pointer={props.pointer}>
                        <H1
                            position={[0, 55, -60]}
                            children={"CADILLAC"}
                            pointer={props.pointer}
                        />
                    </FBO>
                    <FBO el={props.showsRef} pointer={props.pointer}>
                        <H1
                            position={[0, 55, -60]}
                            children={"CADILLAC"}
                            pointer={props.pointer}
                        />
                    </FBO>
                </>
            )}
        </>
    )
}

export default Background
