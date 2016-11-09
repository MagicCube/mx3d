import BridgeScene from "./BridgeScene";

$(() => {
    const scene = new BridgeScene({
        $element: $("body")
    });

    window.onresize = () => {
        scene.invalidateSize();
    };

    setTimeout(() => {
        /*
        scene.focusLine(
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, -10, 0),
            0,
            2000,
            true
        );
        */
    }, 2000);

    scene.startAnimation();
});
