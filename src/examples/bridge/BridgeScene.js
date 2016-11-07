import StandardScene from "mx3d/StandardScene";

export default class BridgeScene extends StandardScene
{
    init()
    {
        this.backgroundColor = 0x213857;
        this.anaglyphEffectEnabled = false;
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
        const material = new THREE.MeshPhongMaterial( { color: 0xaaaaaa, specular: 0x555555, shininess: 50 } );
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
