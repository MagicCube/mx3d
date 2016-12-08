import { StandardScene3D } from "mx3d";

import Bridge from "../obj/Bridge";

export default class BridgeScene3D extends StandardScene3D
{
    cameraControlsParams = {
        //minDistance: 10,
    	//maxDistance: 150,
        zoomSpeed: 0.2,
        //autoRotate: true,
        autoRotateSpeed: 0.2
    };

    init(options)
    {
        this.clickable = true;
        this.backgroundColor = 0x213857;
        this.anaglyphEffectEnabled = false;

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

        this.resetCamera(0);
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
            const position = {x: 67.02135539344368, y: 77.83638326413819, z: 188.04896351634508};
            const rotation = {
                x: -0.7527655018998052, y: 0.610207998509874, z: 0.24696213819957952
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
            e.sensor = this.bridge.getSensor(obj);
            this.trigger("sensorclick", [e]);
        }
    }
}
