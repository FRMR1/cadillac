import { useMemo, useRef } from "react"
import { useFrame, useThree } from "react-three-fiber"
import { frag, vert } from "../Shaders/bg"
// import FBO from "../FBO"
// import H1 from "../Text/H1"
// import BioImage from "../BioImage"

import * as THREE from "three"

const Background = props => {
    const { gl, camera } = useThree()
    const planeRef = useRef()

    const domEl = props.bodyRef
    const domElRect = domEl.getBoundingClientRect()

    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    const aspect = windowWidth / windowHeight

    console.log("aspect", aspect)

    const pageHeight = domElRect.height
    const heightToWidthRatio = pageHeight / windowWidth

    console.log("pageHeight", pageHeight)
    console.log("windowWidth", windowWidth)
    console.log("heightToWidthRatio", heightToWidthRatio)

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
            uResolution: { value: { x: windowWidth, y: windowHeight } },
            uTexture: {
                value: target.texture,
            },
        }),
        []
    )

    const calculateUnitSize = () => {
        const fov = 75 // default camera value
        const cameraZ = 25 // default camera value

        const vFov = (fov * Math.PI) / 180

        const height = 2 * Math.tan(vFov / 2) * cameraZ
        const width = height / heightToWidthRatio

        return { width, height }
    }

    const camUnit = calculateUnitSize()

    console.log("camUnit", camUnit)
    console.log("aspect", aspect)

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

    console.log("renderSize", getRenderSize(domEl))

    // Get proper canvas width in ThreeJS units

    // const updateRenderPosition = (el, scrollY) => {
    //     const {
    //         left,
    //         right,
    //         top,
    //         bottom,
    //         width,
    //         height,
    //     } = el.getBoundingClientRect()

    //     // Set origin to top left
    //     planeRef.current.position.x = -(camUnit.width / 2)
    //     planeRef.current.position.y = camUnit.height / 2

    //     // Set position
    //     planeRef.current.position.x +=
    //         (left / windowWidth) * camUnit.width +
    //         (camUnit.width * planeRef.current.scale.x) / 2
    //     planeRef.current.position.y -=
    //         ((top - scrollY) / windowHeight / 10) * camUnit.height +
    //         camUnit.height * planeRef.current.scale.y
    // }

    useFrame((state, delta) => {
        const { scaleX, scaleY } = getRenderSize(domEl)

        state.camera.position.x = 0
        state.camera.position.z = 5
        state.camera.position.y = 0

        uniforms.uTime.value += delta

        gl.render(scene, camera)
    })

    return (
        <>
            <mesh position={[0, 0, -20]} ref={planeRef}>
                <planeBufferGeometry
                    args={[camUnit.width, camUnit.height, 1, 1]}
                />
                <shaderMaterial
                    uniforms={uniforms}
                    vertexShader={vert}
                    fragmentShader={frag}
                />
            </mesh>
            {/* {props.route === "/bio" && (
                <FBO el={props.bioRef} pointer={props.pointer}>
                    <BioImage />
                </FBO>
            )} */}
            {/* {props.route === "/" && (
                <>
                    <FBO el={props.newsRef} pointer={props.pointer}>
                        <H1
                            position={[0, 0, 0]}
                            children={"NEWS"}
                            pointer={props.pointer}
                        />
                    </FBO>
                    <FBO el={props.showsRef} pointer={props.pointer}>
                        <H1
                            position={[0, 0, 0]}
                            children={"UPCOMING SHOWS"}
                            pointer={props.pointer}
                        />
                    </FBO>
                </>
            )} */}
        </>
    )
}

export default Background
