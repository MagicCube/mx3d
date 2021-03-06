import { Object3D } from "mx3d";

export default class Bridge extends Object3D
{
    sensors = [];

    selection = null;

    bridgeMaterial = new THREE.MeshPhongMaterial( { color: 0xbee0fc, specular: 0x555555, shininess: 10 } );
    sensorMaterial = new THREE.MeshPhongMaterial( { color: 0x00c09e, specular: 0x555555, shininess: 100 } );
    selectedSensorMaterial = new THREE.MeshPhongMaterial( { color: 0xec953b, specular: 0xffffff, shininess: 100 } );

    constructor({ scene })
    {
        super();
        this.scene = scene;
    }

    async load(url, onProcess)
    {
        console.log("[bridge3d] Loading bridge.obj...");
        this.mesh = await this.loadFromObj(url, onProcess);
        this.mesh.position.z -= 10;
        this.mesh.position.y -= 7;
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
        if (!sensor.mesh.geometry.boundingSphere)
        {
            setTimeout(() => {
                this.focusOnSensor(sensor);
            }, 100);
            return;
        }
        sensor.mesh.geometry.computeBoundingBox();

        const v1 = sensor.mesh.geometry.boundingBox.min.clone();
        v1.x += this.mesh.position.x + (sensor.under ? -7 : 10);
        v1.y += this.mesh.position.y;
        v1.z += this.mesh.position.z;
        const v2 = new THREE.Vector3(v1.x + (sensor.under ? 15 : -20), v1.y, v1.z + (sensor.under ? 12 : -12));
        this.scene.focusOnLine(
            v1,
            v2,
            (sensor.under ? 50 : -45),
            2000,
            false
        );
    }
}
