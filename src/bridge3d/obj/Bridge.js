import { Object3D } from "mx3d";

export default class Bridge extends Object3D
{
    sensors = [];

    constructor()
    {
        super();
    }

    async load(onProcess)
    {
        console.log("[bridge3d] Loading bridge.obj...");
        this.mesh = await this.loadFromObj("../models/bridge.obj", onProcess);
        console.log("[bridge3d] bridge.obj is now successfully loaded.");
        this._loadSensors();
    }

    _loadSensors()
    {
        this.mesh.children.forEach(child => {
            if (child.name.startsWith("sensor_"))
            {
                let id = null;
                let under = false;
                if (child.name.startsWith("sensor_under_"))
                {
                    under = true;
                    id = child.name.substr(13);
                }
                else
                {
                    id = child.name.substr(7);
                }
                const sensor = {
                    id,
                    name: child.name,
                    mesh: child,
                    under
                };
                this.sensors["sensor#" + sensor.id] = sensor;
                this.sensors[sensor.name] = sensor;
                this.sensors.push(sensor);
            }
        });
        console.log(`[bridge3d] ${this.sensors.length} sensors found.`);
    }

    getSensor(key)
    {
        if (typeof(key) === "number")
        {
            return this.sensors[key];
        }
        else if (typeof(key) === "string")
        {
            if (this.sensors["sensor#" + key])
            {
                return this.sensors["sensor#" + key];
            }
            else if (this.sensors[key])
            {
                return this.sensors[key];
            }
        }
    }
}
