import AnimatedScene from "mx3d/AnimatedScene";

export default class SimpleCubeScene extends AnimatedScene
{
    init()
    {
        this.cameraParams = {
            position: { z: 1000 }
        };

        super.init();
    }

    initObjects()
    {
        this._initCube();
    }

    _initCube()
    {
        const geometry = new THREE.BoxGeometry(200, 200, 200);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
        this.cube = new THREE.Mesh( geometry, material );
        this.add(this.cube);
    }

    update()
    {
        super.update();
        //this.cube.rotation.x += 0.01;
        //this.cube.rotation.y += 0.02;
    }
}
