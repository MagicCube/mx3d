import { StandardScene3D } from "mx3d";

import Bridge from "../obj/Bridge";

export default class BridgeScene3D extends StandardScene3D
{
    cameraControlsParams = {
        minDistance: 10,
    	maxDistance: 150
    };

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
        this.bridge = new Bridge({ scene: this });
        await this.bridge.load(e => {
            // TODO Add loading indicator.
        });
        this.bridge.sensors.forEach(sensor => {
            this.clickableObjects.push(sensor.mesh);
        });
        this.add(this.bridge);
        this.trigger("load");
    }


    _onobjectclick(e)
    {
        if (e.button !== 0) return;

        const obj = e.objects[0];
        if (obj.name.startsWith("sensor_"))
        {
            this.trigger("sensorclick", [Object.assign(e, {
                sensor: this.bridge.getSensor(obj)
            })]);
            if (e.altKey)
            {
                this.bridge.selectAndFocusOnSensor(obj);
            }
            else
            {
                this.bridge.selectSensor(obj);
            }
        }
    }
}
