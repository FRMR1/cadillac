import { useMemo } from "react"
import { useFrame, useThree } from "react-three-fiber"
import { frag, vert } from "../Shaders/scene"
import * as THREE from "three"

const Scene = props => {
    const width = window.innerWidth
    const height = window.innerHeight

    const { gl } = useThree()

    const scene = new THREE.Scene()
    const fov = 45
    const aspect = 2 // the canvas default
    const near = 0.1
    const far = 5
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)

    const target = new THREE.WebGLRenderTarget(width, height, {
        format: THREE.RGBFormat,
        stencilBuffer: false,
        depthBuffer: false,
        depthWrite: false,
        depthTest: false,
    })

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
            u_n1: {
                value: 14815366,
            },
            u_n2: {
                value: 4096,
            },
            u_trail: {
                value: target.texture,
            },
            u_slider: {
                value: props.sliderPos,
            },
        }),
        []
    )
    function makeScene(elem) {
        camera.position.z = 2
        camera.position.set(0, 1, 2)
        camera.lookAt(0, 0, 0)

        {
            const color = 0xffffff
            const intensity = 1
            const light = new THREE.DirectionalLight(color, intensity)
            light.position.set(-1, 2, 4)
            scene.add(light)
        }

        return { scene, camera, elem }
    }

    function setupScene() {
        const sceneInfo = makeScene(props.pyramidRef)
        const geometry = new THREE.BoxBufferGeometry(1, 1, 1)
        const material = new THREE.MeshPhongMaterial({ color: "red" })
        const mesh = new THREE.Mesh(geometry, material)
        sceneInfo.scene.add(mesh)
        sceneInfo.mesh = mesh
        return sceneInfo
    }

    const sceneInfo = setupScene()

    function renderSceneInfo(sceneInfo) {
        const { scene, camera, elem } = sceneInfo

        // get the viewport relative position of this element
        const {
            left,
            right,
            top,
            bottom,
            width,
            height,
        } = elem.getBoundingClientRect()

        const isOffscreen =
            bottom < 0 ||
            top > gl.domElement.clientHeight ||
            right < 0 ||
            left > gl.domElement.clientWidth

        if (isOffscreen) {
            return
        }

        camera.aspect = width / height
        camera.updateProjectionMatrix()

        const positiveYUpBottom = gl.domElement.clientHeight - bottom
        gl.setScissor(left, positiveYUpBottom, width, height)
        gl.setViewport(left, positiveYUpBottom, width, height)

        gl.render(scene, camera)
    }

    useFrame((state, delta) => {
        const transform = `translateY(${window.scrollY}px)`
        state.gl.domElement.style.transform = transform
        // resizeRendererToDisplaySize(state.gl)
        state.gl.setScissorTest(false)
        state.gl.clear(true, true)
        state.gl.setScissorTest(true)
        renderSceneInfo(sceneInfo)
    })

    return (
        <mesh>
            <planeBufferGeometry args={[20, 20, 1, 1]} />
            <shaderMaterial
                uniforms={uniforms}
                vertexShader={vert}
                fragmentShader={frag}
            />
        </mesh>
    )
}

export default Scene
