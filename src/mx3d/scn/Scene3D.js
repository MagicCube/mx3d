import EventEmitter from "wolfy87-eventemitter";

import Object3D from "../obj/Object3D";

export default class Scene3D extends EventEmitter
{
    backgroundColor = 0;

    $element = null;
    frame = {};

    clickable = false;
    clickableObjects = [];

    camera = null;
    cameraParams = {};

    renderer = null;
    rendererParams = {};

    composer = null;

    anaglyphEffect = null;
    anaglyphEffectEnabled = false;

    constructor(options)
    {
        super();
        this.init(options);
    }

    init({
        $element
    } = {})
    {
        this.$element = $element ? $element : $(document.body);
        this.$element.addClass("scene3d");

        this.initFrame();
        this.initRoot();
        this.initCamera();
        this.initRenderer();
        this.initEffects();
        this.initObjects();
        this.initLights();

        this.$element.on("mouseup", "canvas", this.onmouseup.bind(this));
        this.$element.on("touchstart", "canvas", this.onmouseup.bind(this));
    }

    initFrame()
    {
        this.invalidateSize();
    }

    initRoot()
    {
        this.root = new THREE.Scene();
    }

    initCamera()
    {
        const params = Object.assign({
            fov : 12,
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
        this.add(this.camera);
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
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMapSoft = true;
        const $renderer = $(this.renderer.domElement);
        this.$element.append($renderer);
        this.renderer.setClearColor(this.backgroundColor);

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





    add(obj)
    {
        if (obj instanceof Object3D)
        {
            this.root.add(obj.mesh);
        }
        else
        {
            this.root.add(obj);
        }
    }

    remove(obj)
    {
        if (obj instanceof Object3D)
        {
            this.root.remove(obj.mesh);
        }
        else
        {
            this.root.remove(obj);
        }
    }

    addLight(light, helperClass)
    {
        this.root.add(light);

        if (typeof(helperClass) === "function")
        {
            let helper = null;
            helper = new helperClass(light);
            this.add(helper);
        }
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

    invalidateSize()
    {
        this.frame = {
            width: this.$element.width(),
            height: this.$element.height()
        };

        if (this.camera != null)
        {
            this.camera.aspect = this.frame.width / this.frame.height;
            this.camera.updateProjectionMatrix();
        }

        this.update();

        if (this.renderer != null)
        {
            this.renderer.setSize(this.frame.width, this.frame.height);
        }

        if (this.anaglyphEffect != null)
        {
            this.anaglyphEffect.setSize(this.frame.width, this.frame.height);
        }
    }






    onmouseup(e)
    {
        if (!this.clickable)
        {
            return;
        }

        e.preventDefault();

        let mouse = null;

        if (e.type === "mouseup")
        {
            // update the mouse variable
            mouse = {
                x : 0,
                y : 0,
                z : 0
            };
            mouse.x = (e.offsetX / this.frame.width) * 2 - 1;
            mouse.y = -(e.offsetY / this.frame.height) * 2 + 1;
            mouse.z = 1;
        }
        else if (e.type === "touchstart")
        {
            mouse = {
                x : 0,
                y : 0,
                z : 0
            };
            mouse.x = (e.touches[0].offsetX / this.frame.width) * 2 - 1;
            mouse.y = -(e.touches[0].offsetY / this.frame.height) * 2 + 1;
            mouse.z = 1;
        }

        if (mouse)
        {
            // create a Ray with origin at the mouse position
            // and direction into the scene (camera direction)
            const vector = new THREE.Vector3(mouse.x, mouse.y, mouse.z);
            vector.unproject(this.camera);

            const origin = this.camera.position;
            const dir = vector.sub(this.camera.position).normalize();
            const ray = new THREE.Raycaster();
            ray.set(origin, dir);

            // create an array containing all objects in the scene with which
            // the ray intersects
            const intersects = ray.intersectObjects(this.clickableObjects);
            if (intersects.length > 0)
            {
                let objects = intersects.map(intersect =>
                {
                    return intersect.object;
                });
                e.objects = objects;
                e.intersects = intersects;
                this.trigger("objectclick", [ e ]);
            }
        }
    }
}
