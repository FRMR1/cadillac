import * as React from "react"
import dynamic from "next/dynamic"

import { EffectComposer, Noise, DepthOfField } from "react-postprocessing"

import { BlendFunction } from "postprocessing"

const Effects = () => {
    return (
        <>
            <EffectComposer>
                {/* <Noise opacity={0.02} /> */}
                <DepthOfField
                    focusDistance={0}
                    focalLength={0.01}
                    bokehScale={1}
                    height={920}
                />
                {/* <Vignette
                    offset={0.5} // vignette offset
                    darkness={1} // vignette darkness
                    eskil={false} // Eskil's vignette technique
                    blendFunction={BlendFunction.NORMAL} // blend mode
                /> */}
            </EffectComposer>
        </>
    )
}

export default Effects
