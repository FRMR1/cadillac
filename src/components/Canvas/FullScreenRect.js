import { CustomPIXIComponent } from "react-pixi-fiber";
import * as PIXI from "pixi.js";

const TYPE = "Rectangle";

export const behavior = {
    customDisplayObject: (props) => new PIXI.Graphics(),
    customApplyProps: function (instance, oldProps, newProps) {
        const { x, y, width, height } = newProps;
        instance.clear();
        instance.beginFill(0x161616);
        instance.drawRect(x, y, width, height);
        instance.endFill();
    },
};

const FullScreenRect = CustomPIXIComponent(behavior, TYPE);

export default FullScreenRect;
