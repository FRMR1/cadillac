import React, { useEffect, useRef } from "react"
import { useFrame, useThree } from "react-three-fiber"

const Camera = props => {
  const ref = useRef()
  const { setDefaultCamera } = useThree()

  // Make the camera known to the system
  useEffect(() => void setDefaultCamera(ref.current), [])

  // Update it every frame
  // useFrame(() => ref.current.updateMatrixWorld())

  // return <orthographicCamera ref={ref} {...props} />
  return <perspectiveCamera ref={ref} {...props} />
}

export default Camera
