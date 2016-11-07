import SimpleCubeScene from "./SimpleCubeScene";

$(() => {
    const scene = new SimpleCubeScene({
        $element: $("body")
    });

    window.onresize = () => {
        scene.updateFrame();
    };

    scene.startAnimation();
});
