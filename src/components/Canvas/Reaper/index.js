import React from 'react';
import { Sprite } from 'react-pixi-fiber';
import * as PIXI from 'pixi.js';
import reaper from '../../../images/reaper-white.png';

const Reaper = (props) => {

    const width = props.width / 1.5;
    const height = props.height / 1.5;

    const x = width / 2;
    const y = height / 2;

    return <Sprite texture={PIXI.Texture.from(reaper)} x={x} y={y- 50} width={width} height={height} anchor={0.25} />
};

export default Reaper;