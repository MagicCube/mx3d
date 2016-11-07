import Scene from "./Scene";

export default class AnimatedScene extends Scene
{
    cameraControlsEnabled = true;

    init(options)
    {
        if (options)
        {
            if (options.cameraControlsEnabled)
            {
                this.cameraControlsEnabled = options.cameraControlsEnabled;
            }
        }
        super.init(options);
        this.initControls();
    }

    initControls()
    {
        this.initCameraControls();
    }

    initCameraControls()
    {
        if (this.cameraControlsEnabled && !this.cameraControls)
        {
            this.cameraControls = new THREE.TrackballControls(this.camera, this.$element.find("canvas")[0]);
        }
    }

    startAnimation()
    {
        this.animating = true;
        this.renderLoop();
    }

    stopAnimation()
    {
        this.animating = false;
    }



    update()
    {
        this.updateCameraControls();
        super.update();
    }

    updateCameraControls()
    {
        if (this.cameraControlsEnabled)
        {
            if (!this.cameraControls)
            {
                this.initCameraControls();
            }
            if (!this.cameraControls.enabled)
            {
                this.cameraControls.enabled = true;
            }
            this.cameraControls.update();
        }
        else
        {
            if (this.cameraControls && this.cameraControls.enabled)
            {
                this.cameraControls.enabled = false;
            }
        }
    }

    renderLoop()
    {
        //this.trigger("framing");
        this.update();
        this.render();

        if (this.animating)
        {
            window.requestAnimationFrame(this.renderLoop.bind(this));
        }
    }
}
