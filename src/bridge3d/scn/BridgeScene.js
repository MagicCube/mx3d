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

        this.on("objectclick", this._onobjectclick.bind(this));
    }

    initObjects()
    {
        super.initObjects();
        this.showGrid(200, 40);
        this._initBridge();
    }

    async _initBridge()
    {
        const $loading = $("");
        this.bridge = new Bridge();
        await this.bridge.load(e => {

        });
        this.bridge.sensors.forEach(sensor => {
            this.clickableObjects.push(sensor.mesh);
        });
        this.add(this.bridge);
        this.trigger("load");
    }


    _onobjectclick(e)
    {
        const obj = e.objects[0];
        if (obj.name.startsWith("sensor_"))
        {
            this.trigger("sensorclick", [{
                sensor: this.bridge.getSensor(obj)
            }]);
            this.bridge.selectSensor(obj);
        }
    }
}
