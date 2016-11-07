import AnimatedScene from "mx3d/AnimatedScene";

export default class StandardScene extends AnimatedScene
{
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
}
