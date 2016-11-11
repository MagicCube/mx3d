import { StandardScene3D } from "mx3d";

import Bridge from "../obj/Bridge";

export default class BridgeScene3D extends StandardScene3D
{
    init(options)
    {
        this.clickable = true;
        this.backgroundColor = 0x213857;
        this.anaglyphEffectEnabled = false;
        this.cameraParams = {
            position: { z: 100 }
        };

        super.init(options);
        this.$element.addClass("bridge-scene-3d");
    }

    initObjects()
    {
        super.initObjects();
        this.showGrid(150, 15);
        this._initBridge();
    }

    async _initBridge()
    {
        const $loading = $("");
        this.bridge = new Bridge();
        await this.bridge.load(e => {

        });
        this.add(this.bridge);
    }
}
