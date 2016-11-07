import Scene from "mx3d/Scene";

export default class BridgeScene extends Scene
{
    init()
    {
        this.cameraParams = {
            position: { z: 100 }
        };

        super.init();
    }

    initObjects()
    {
        this._initBridge();
    }

    _initBridge()
    {
        const loader = new THREE.OBJLoader();
        loader.load(
           "/models/bridge.obj",
           bridge => {
               this.bridge = bridge;
               this.add(this.bridge);
           }
        );
    }

    update()
    {
        super.update();
        if (this.bridge)
        {
            this.bridge.rotation.x += 0.01;
            this.bridge.rotation.y += 0.02;
        }
    }
}
