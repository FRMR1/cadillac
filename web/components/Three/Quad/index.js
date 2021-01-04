import { useMemo } from "react"
import { useFrame, useThree, createPortal } from "react-three-fiber"
import { frag, vert } from "../Shaders/quad"
import Scene from "../Scene"
import Scene2 from "../Scene2"
import * as THREE from "three"

const Quad = props => {
    const width = window.innerWidth
    const height = window.innerHeight

    const { gl } = useThree()

    const [scene, target] = useMemo(() => {
        const scene = new THREE.Scene()
        const target = new THREE.WebGLMultisampleRenderTarget(width, height, {
            format: THREE.RGBFormat,
            stencilBuffer: false,
            depthBuffer: true,
            depthWrite: true,
            depthTest: true,
        })
        return [scene, target]
    }, [])

    const uniforms = useMemo(
        () => ({
            u_time: { value: 0.0 },
            u_mouse: { value: new THREE.Vector2() },
            u_speed: {
                value: 0,
            },
            u_resolution: { value: { x: width, y: height } },
            u_ratio: {
                value: window.innerWidth / window.innerHeight,
            },
            u_texture: {
                value: target.texture,
            },
        }),
        []
    )

    useFrame((state, delta) => {
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
            <mesh>
                <planeBufferGeometry args={[10, 7, 1, 1]} />
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
