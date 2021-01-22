import React, { useEffect, useRef, useMemo } from "react"
import { useLoader, useThree, useFrame } from "react-three-fiber"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/dist/ScrollTrigger"
import { frag, vert } from "../Shaders/skull"

import * as THREE from "three"

let OBJLoader

const Skull = props => {
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    const aspect = windowWidth / windowHeight

    gsap.registerPlugin(ScrollTrigger)

    const { gl, scene } = useThree()

    const txt = useLoader(THREE.TextureLoader, "/assets/texture.jpg")
    const txt2 = useLoader(THREE.TextureLoader, "/assets/texture2.jpg")

    OBJLoader = require("three/examples/jsm/loaders/OBJLoader").OBJLoader
    const group = useRef()
    const obj = useLoader(OBJLoader, "/assets/skull.obj")

    const uniforms = useMemo(
        () => ({
            u_time: { value: 0.0 },
            u_mouse: { value: new THREE.Vector2() },
            u_resolution: { value: { x: windowWidth, y: windowHeight } },
            u_ratio: {
                value: aspect,
            },
            u_texture: {
                value: txt,
            },
            u_texture2: {
                value: txt2,
            },
            u_setting: {
                value: 0,
            },
        }),
        []
    )

    const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vert,
        fragmentShader: frag,
    })

    // const material = new THREE.MeshMatcapMaterial({
    //     matcap: txt,
    // })

    for (let i = 0; i < obj.children.length; i++) {
        obj.children[i].material = material
    }

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

    const animateSetting = e => {
        gsap.to(e, {
            duration: 2,
            value: 1,
            ease: "inout",
        })
    }

    const animateSettingBack = e => {
        gsap.to(e, {
            duration: 2,
            value: 0,
            ease: "inout",
        })
    }

    const handleScroll = e => {
        const element = props.bodyRef
        const height = element.clientHeight
        gsap.to(e, {
            y: -(height - document.documentElement.clientHeight),
            ease: "none",
            scrollTrigger: {
                trigger: document.body,
                start: "top top",
                end: "bottom bottom",
                scrub: 1,
            },
        })
    }

    // const [scroll, setScroll] = useState()

    // const handleScroll = () => {
    //     setScroll(window.pageYOffset)
    // }

    // useEffect(() => {
    //     window.addEventListener("scroll", handleScroll)
    // })

    // const handleScrollPos = scrollPos => {
    //     let zPos = scrollPos ? scrollPos / 80 : 0
    //     let xRot = scrollPos ? scrollPos / 500 : 0
    //     let yPos = scrollPos ? scrollPos / 12 : 0
    //     return { xRot, zPos, yPos }
    // }

    useFrame((state, delta) => {
        uniforms.u_time.value += delta

        animateX(uniforms.u_mouse.value)
        animateY(uniforms.u_mouse.value)
        handleScroll(obj.position.y)

        state.camera.position.x = 0
        state.camera.position.z = 50
        state.camera.position.y = 12

        obj.rotation.x = Math.PI / 0.64
        obj.rotation.z = uniforms.u_mouse.value.x / 10
        obj.rotation.x += (uniforms.u_mouse.value.y / 20) * -1

        // const { xRot, zPos, yPos } = handleScrollPos(scroll)
        obj.position.z = 20
        // obj.position.y = yPos
        // obj.rotation.x += xRot
    })

    return (
        <primitive
            onPointerOver={() => animateSetting(uniforms.u_setting)}
            object={obj}
        />
    )
}

export default Skull
