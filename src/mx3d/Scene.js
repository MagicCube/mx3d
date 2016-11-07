export default class Scene
{
    anaglyphEffectEnabled = false;

    $container = null;
    cameraParams = {};
    rendererParams = {};
    frame = { };

    constructor({
        $container,
        anaglyphEffectEnabled = false
    } = {})
    {
        this.$container = $container ? $container : $(document.body);
        this.anaglyphEffectEnabled = anaglyphEffectEnabled;
        this.init();
    }

    init()
    {
        this.initFrame();
        this.initRoot();
        this.initCamera();
        this.initRenderer();
        this.initEffects();
        this.initObjects();
        this.initLights();
    }

    initFrame()
    {
        console.log(this.$container.width(), this.$container.height());
        this.frame = {
            width: window.innerWidth,
            height: window.innerHeight
        };
    }

    initRoot()
    {
        this.root = new THREE.Scene();
    }

    initCamera()
    {
        const params = Object.assign({
            fov : 45,
            aspect : this.frame.width / this.frame.height,
            near : 0.01,
            far : 10000
        }, this.cameraParams);
        this.camera = new THREE.PerspectiveCamera(params.fov, params.aspect, params.near, params.far);
        if (params.position != null)
        {
            if (Array.isArray(params.position))
            {
                this.camera.position.fromArray(params.position);
            }
            else
            {
                const position = Object.assign({
                    x : 0,
                    y : 0,
                    z : 0
                }, params.position);
                this.camera.position.copy(position);
            }
        }
        if (params.rotation != null)
        {
            if (Array.isArray(params.rotation))
            {
                this.camera.rotation.fromArray(params.rotation);
            }
            else
            {
                const rotation = Object.assign({
                    x : 0,
                    y : 0,
                    z : 0
                }, params.rotation);
                this.camera.rotation.copy(rotation);
            }
        }
        this.addObject(this.camera);
    }

    initRenderer()
    {
        const params = Object.assign({
            antialias : true
        }, this.rendererParams);
        this.renderer = new THREE.WebGLRenderer(params);
        this.renderer.setSize(this.frame.width, this.frame.height);
        this.renderer.gammaInput = true;
        this.renderer.gammaOutput = true;
        this.renderer.physicallyBasedShading = true;
        this.renderer.shadowMapEnabled = true;
        this.renderer.shadowMapSoft = true;
        this.$container.append(this.renderer.domElement);

        if (this.renderMode === "composer")
        {
            this.initComposer();
        }
    }

    initComposer()
    {
        this.composer = new THREE.EffectComposer(this.renderer);
    }

    initEffects()
    {
        if (this.anaglyphEffectEnabled && !this.anaglyphEffect)
        {
            this.anaglyphEffect = new THREE.AnaglyphEffect(this.renderer);
            this.anaglyphEffect.setSize(this.frame.width, this.frame.height);
        }
    }

    initLights()
    {

    }

    initObjects()
    {

    }





    addObject(obj)
    {
        this.root.add(obj);
    }

    removeObject(obj)
    {
       this.root.remove(obj);
    }

    addLight(light, helperClass)
    {
        this.root.add(light);

        if (typeof(helperClass) === "function")
        {
            let helper = null;
            helper = new helperClass(light);
            this.addObject(helper);
        }
    }

    removeLight(light)
    {
        this.removeObject(light);
    }

    render()
    {
        if (this.anaglyphEffectEnabled)
        {
            if (!this.anaglyphEffect)
            {
                this.initEffects();
            }
            this.anaglyphEffect.render(this.root, this.camera);
        }
        else if (this.renderMode === "composer" && this.composer)
        {
            this.composer.render();
        }
        else
        {
            this.renderer.render(this.root, this.camera);
        }
    }

    update()
    {

    }
}
