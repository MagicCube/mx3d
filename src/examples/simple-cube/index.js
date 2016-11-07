import SimpleCubeScene from "./SimpleCubeScene";

$(() => {
    const scene = new SimpleCubeScene({
        $element: $("body")
    });

    window.onresize = () => {
        scene.invalidateSize();
    };

    scene.startAnimation();
});
