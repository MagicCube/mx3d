import SimpleCubeScene from "./SimpleCubeScene";

$(() => {
    const scene = new SimpleCubeScene({
        $container: $("body")
    });

    function animationLoop()
    {
        scene.update();
        scene.render();
        window.requestAnimationFrame(animationLoop);
    }
    animationLoop();
});
