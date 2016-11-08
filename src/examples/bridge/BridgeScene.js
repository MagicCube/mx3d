import StandardScene from "mx3d/StandardScene";

export default class BridgeScene extends StandardScene
{
    selectedObject = null;
    bridgeMaterial = new THREE.MeshPhongMaterial( { color: 0xaaaaaa, specular: 0x555555, shininess: 50 } );
    selectedMaterial = new THREE.MeshPhongMaterial( { color: 0xff0000, specular: 0x555555, shininess: 50 } );

    init()
    {
        this.clickable = true;
        this.backgroundColor = 0x213857;
        this.anaglyphEffectEnabled = false;
        this.cameraParams = {
            position: { z: 100 }
        };

        super.init();

        this.on("objectClick", e => {
            const name = e.objects[0].name;
            if (name.startsWith("Rectangle"))
            {
                if (this.selectedObject === e.objects[0]) return;
                if (this.selectedObject)
                {
                    this.selectedObject.material = this.bridgeMaterial;
                    this.selectedObject = null;
                }
                this.selectedObject = e.objects[0];
                this.selectedObject.material = this.selectedMaterial;
            }
        });
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
           obj => {
               obj.traverse((child) => {
                   if (child instanceof THREE.Mesh)
                   {
                       child.material = this.bridgeMaterial;
                       this.clickableObjects.push(child);
                   }
               });
               this.add(obj);
            }
        );
    }
}
