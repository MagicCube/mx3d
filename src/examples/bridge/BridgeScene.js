import AnimatedScene from "mx3d/AnimatedScene";

export default class BridgeScene extends AnimatedScene
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
        const material = new THREE.MeshBasicMaterial({color: 'gray', side: THREE.DoubleSide});
        loader.load(
           "/models/bridge.obj",
           obj => {
               obj.traverse((child) => {
                   if (child instanceof THREE.Mesh)
                   {
                       child.material = material;
                   }

               });
               this.add(obj);
            }
        );
    }
}
