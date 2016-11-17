import AnimatedScene3D from "./AnimatedScene3D";

export default class StandardScene3D extends AnimatedScene3D
{
    init(...args)
    {
        super.init(...args);
        this.$element.addClass("standard-scene3d");
    }

    initLights()
    {
        super.initLights();
        const ambiColor = "#444";
        this.ambientLight = new THREE.AmbientLight(ambiColor);
        this.add(this.ambientLight);

        this.sunLight = new THREE.DirectionalLight(0xffffff, 1);
        this.sunLight.position.set(100, 100, 50);
        this.add(this.sunLight);
    }

    initObjects()
    {

    }
}
