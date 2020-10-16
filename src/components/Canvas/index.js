import React, { useEffect } from "react"
import { Stage, Container, Text, withApp } from "react-pixi-fiber"
import '@pixi/filter-color-matrix';
import * as PIXI from 'pixi.js';
import { RGBSplitFilter } from '@pixi/filter-rgb-split';
import GameOver from './GameOver'
import { PixelateFilter } from '@pixi/filter-pixelate';
import { ColorOverlayFilter } from '@pixi/filter-color-overlay';
import { CRTFilter } from '@pixi/filter-crt';
import Reaper from './Reaper/index'
import FullScreenRect from './FullScreenRect'

const CanvasContainer = props => {
  const width = window.innerWidth
  const height = window.innerHeight
  const x = width * 0.5
  const y = height * 0.5

  const crtFilter = new CRTFilter({
      noise: .15,
      vignetting: 0,
      noiseSize: 3,
      lineWidth: 2,
      lineContrast: 1,
  });

  const rgbSplitFilter = new RGBSplitFilter(
    [Math.random() * 5, Math.random() * 5],
    [Math.random() * -5, Math.random() * 5],
    [Math.random() * 5, Math.random() * -5]
  );

  const pixelateFilter = new PixelateFilter(4);

  const colorOverlayFilter1 = new ColorOverlayFilter(
    [1, 0, 0]
  );

  const colorOverlayFilter2 = new ColorOverlayFilter(
    [1, 0, 0]
  );

  let colorMatrix = new PIXI.filters.ColorMatrixFilter();
  colorMatrix.lsd(true);
  // colorMatrix.night(1, true);
  colorMatrix.colorTone();

  useEffect(() => {

      const animateFilter = () => {
          crtFilter.seed = Math.random();
          crtFilter.time += .8;
          colorOverlayFilter1.color = [Math.random()- Math.random(), Math.random() - Math.random(), Math.random() - Math.random()];
          colorOverlayFilter2.color = [Math.random()- Math.random(), Math.random() - Math.random(), Math.random() - Math.random()];
          // colorMatrix.colorTone(Math.random(), Math.random());

      };
    
      props.app.ticker.add(animateFilter);

  }, []);

  return (
    <Container filters={[crtFilter]}>
      <FullScreenRect 
                width={width}
                height={height} />
        <Container filters={[pixelateFilter]} >
          <Container filters={[colorOverlayFilter1, rgbSplitFilter]} >
            <Reaper height={height} width={width}/>
          </Container>
          <Container filters={[colorOverlayFilter2, rgbSplitFilter]} >
            <GameOver />
          </Container>
        </Container>
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
          backgroundColor: 0x000000,
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
