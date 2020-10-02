import React from "react"
import { Stage, Container, Text, withApp } from "react-pixi-fiber"

const CanvasContainer = props => {
  const width = window.innerWidth
  const height = window.innerHeight
  const x = width * 0.5
  const y = height * 0.5

  return (
    <Container>
      <Text
        text="CADILLAC"
        x={x}
        y={y}
        interactive="true"
        buttonMode="true"
        // style={style}
        anchor="0.5"
      />
    </Container>
  )
}

const ContainerWithApp = withApp(CanvasContainer)

const Canvas = props => {
  const width = window.innerWidth
  const height = window.innerHeight

  return (
    <div>
      <Stage
        resizeTo={window}
        options={{
          backgroundColor: 0x202020,
          antialias: true,
          height: height,
          width: width,
        }}
      >
        <ContainerWithApp {...props} />
      </Stage>
    </div>
  )
}

export default Canvas
