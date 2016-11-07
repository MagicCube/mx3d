import BridgeScene from "./BridgeScene";

$(() => {
    const scene = new BridgeScene({
        $element: $("body")
    });
    scene.startAnimation();
});
