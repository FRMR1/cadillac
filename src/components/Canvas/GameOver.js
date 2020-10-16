import React from 'react'
import { Text } from "react-pixi-fiber"

const GameOver = () => {

    const width = window.innerWidth
    const height = window.innerHeight
    const x = width * 0.5
    const y = height * 0.5

    const style = {
        fill: '0xff0000',
        fontSize: 80,
        fontFamily: 'Winsor'
      }

    const loadFonts = () => {
        return new Promise((resolve, rej) => {
            const fontsList = [
                new FontFace("Winsor", "url(/fonts/fonts/winsor.otc)"),
            ];
            fontsList.forEach((fonts) => {
                fonts.load().then(function (loadedFontFace) {
                    document.fonts.add(loadedFontFace);
                    document.body.style.fontFamily = "Winsor";
                });
            });
            document.fonts.ready.then(() => {
                resolve();
            });
        });
    };

    return <Text
        text="GAME OVER"
        x={x}
        y={y + 240}
        interactive="true"
        buttonMode="true"
        style={style}
        anchor="0.5"
    />
}

export default GameOver;