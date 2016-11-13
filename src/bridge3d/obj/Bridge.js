import { Object3D } from "mx3d";

export default class Bridge extends Object3D
{
    sensors = [];

    selection = null;

    bridgeMaterial = new THREE.MeshPhongMaterial( { color: 0x9999aa, specular: 0x555555, shininess: 20 } );
    sensorMaterial = new THREE.MeshPhongMaterial( { color: 0xffbc78, specular: 0x555555, shininess: 100 } );
    selectedSensorMaterial = new THREE.MeshPhongMaterial( { color: 0xff0000, specular: 0x555555, shininess: 100 } );

    constructor({ scene })
    {
        super();
        this.scene = scene;
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
                    under,
                    visible: true
                };
                sensor.mesh.material = this.sensorMaterial;
                this.sensors["sensor#" + sensor.id] = sensor;
                this.sensors[sensor.name] = sensor;
                this.sensors.push(sensor);
            }
            else
            {
                child.material = this.bridgeMaterial;
            }
        });
        this.hideAllSensors();
        console.log(`[bridge3d] ${this.sensors.length} sensors found.`);
    }

    getSensor(key)
    {
        if (key.name)
        {
            key = key.name;
        }
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

    showSensors(sensorIds)
    {
        this.sensors.forEach(sensor => {
            sensor.visible = sensorIds.indexOf(sensor.id) != -1;
            if (sensor.visible)
            {
                this.mesh.add(sensor.mesh);
            }
            else
            {
                this.mesh.remove(sensor.mesh);
            }
        });
    }

    hideAllSensors()
    {
        this.sensors.forEach(sensor => {
            sensor.visible = false;
            this.mesh.remove(sensor.mesh);
        });
    }

    selectSensor(sensor)
    {
        if (sensor === undefined || sensor === null)
        {
            return;
        }
        sensor = this.getSensor(sensor);
        if (!sensor || sensor === this.selection)
        {
            return;
        }

        if (this.selection)
        {
            this.selection.mesh.material = this.sensorMaterial;
        }
        this.selection = sensor;
        sensor.mesh.material = this.selectedSensorMaterial;
    }

    selectAndFocusOnSensor(sensor)
    {
        if (sensor)
        {
            this.selectSensor(sensor);
            this.focusOnSensor(sensor);
        }
    }

    focusOnSensor(sensor)
    {
        if (sensor === undefined || sensor === null)
        {
            return;
        }
        sensor = this.getSensor(sensor);
        const v1 = sensor.mesh.geometry.boundingSphere.center;
        const v2 = new THREE.Vector3(v1.x + (sensor.under ? 30 : -30), v1.y, v1.z);
        this.scene.focusOnLine(
            v1,
            v2,
            (sensor.under ? 45 : -45),
            2000
        );
    }
}
