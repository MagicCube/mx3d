import BridgeScene from "./BridgeScene";

$(() => {
    const scene = new BridgeScene({
        $element: $("body")
    });

    function animationLoop()
    {
        scene.update();
        scene.render();
        window.requestAnimationFrame(animationLoop);
    }
    animationLoop();
});
