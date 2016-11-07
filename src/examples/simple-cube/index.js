import SimpleCubeScene from "./SimpleCubeScene";

$(() => {
    const scene = new SimpleCubeScene({
        $element: $("body")
    });

    scene.startAnimation();
});
