import BridgeScene from "./BridgeScene";

$(() => {
    const scene = new BridgeScene({
        $element: $("body")
    });

    window.onresize = () => {
        scene.invalidateSize();
    };

    scene.startAnimation();
});
