import { StandardScene3D } from "mx3d";

import Bridge from "../obj/Bridge";

export default class BridgeScene3D extends StandardScene3D
{
    cameraControlsParams = {
        minDistance: 10,
    	maxDistance: 150,
        zoomSpeed: 0.2,
        autoRotate: true,
        autoRotateSpeed: 0.2
    };

    init(options)
    {
        this.clickable = true;
        this.backgroundColor = 0x213857;
        this.anaglyphEffectEnabled = false;
        this.cameraParams = {
            position: { z: 100 }
        };

        if (options.bridgeModelUrl)
        {
            this.bridgeModelUrl = options.bridgeModelUrl;
        }

        super.init(options);
        this.$element.addClass("bridge-scene-3d");

        this.on("objectclick", this._onobjectclick.bind(this));
        this.$element.on("mousedown touchstart", () => {
            this.cameraControls.autoRotate = false;
        });
    }

    initObjects()
    {
        super.initObjects();
        //this.showGrid(400, 20);
        this._initBridge();
    }

    async _initBridge()
    {
        const $loading = $("");
        this.bridge = new Bridge({ scene: this });
        await this.bridge.load(this.bridgeModelUrl, e => {
            // TODO Add loading indicator.
        });
        this.bridge.mesh.position.x = 14.3;
        this.bridge.sensors.forEach(sensor => {
            this.clickableObjects.push(sensor.mesh);
        });
        this.add(this.bridge);
        this.trigger("load");

        this.resetCamera(2000);
    }

    focusOnLine(...args)
    {
        super.focusOnLine(...args);
        this.cameraControls.autoRotate = false;
    }

    resetCamera(duration = 2000)
    {
        if (this.cameraControls)
        {
            const position = {
                "x":0,"y":80,"z":107.86556868012063
            };
            const rotation = {
                _x: -0.63814462829258, y: 0, z: 0
            };
            return this.moveCamera(position, rotation, duration);
       }
       return Promise.reject();
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
            this.bridge.selectSensor(obj);
        }
    }
}
