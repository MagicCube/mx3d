import AnimatedScene from "mx3d/AnimatedScene";

export default class BridgeScene extends AnimatedScene
{
    init()
    {
        this.anaglyphEffectEnabled = true;
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
        const material = new THREE.MeshPhongMaterial( { color: 0x6F6CC5, specular: 0x555555, shininess: 30 } );
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

    initLights()
    {
        super.initLights();
        const ambiColor = "#444";
        const ambientLight = new THREE.AmbientLight(ambiColor);
        this.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.position.set(100, 100, 50);
        this.add(dirLight);
    }
}
