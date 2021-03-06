import Scene3D from "./Scene3D";

export default class AnimatedScene3D extends Scene3D
{
    cameraControls = null;
    cameraControlsParams = null;
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
        this.$element.addClass("animated-scene3d");
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
            /*
            this.cameraControls = new THREE.TrackballControls(this.camera, this.$element.find("canvas")[0]);
            */
            this.cameraControls = new THREE.OrbitControls(this.camera, this.$element.find("canvas")[0]);
            if (this.cameraControlsParams)
            {
                Object.assign(this.cameraControls, this.cameraControlsParams);
            }
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



    update(time)
    {
        this.updateCameraControls();
        TWEEN.update(time);

        super.update(time);
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

    renderLoop(time)
    {
        //this.trigger("framing");
        this.update(time);
        this.render(time);

        if (this.animating)
        {
            window.requestAnimationFrame(this.renderLoop.bind(this));
        }
    }



    showGrid(size = 100, step = 10)
    {
        if (!this.gridHelper)
        {
            this.gridHelper = new THREE.GridHelper(size, step);
        }
        this.gridHelper.size = size;
        this.gridHelper.step = step;
        this.add(this.gridHelper);
    }




    moveCamera(position, rotation, duration = 1000, up)
    {
        return new Promise(resolve => {
            if (position)
            {
                new TWEEN.Tween(this.camera.position).to(position, duration).easing(TWEEN.Easing.Sinusoidal.Out).start();
            }

            if (rotation)
            {
                new TWEEN.Tween(this.camera.rotation).to(rotation, duration).easing(TWEEN.Easing.Sinusoidal.Out).start();
            }

            if (up)
            {
                new TWEEN.Tween(this.cameraControls.object.up).to(up, duration).easing(TWEEN.Easing.Sinusoidal.Out).start();
            }
            else
            {
                this.cameraControls.reset();
            }
        });
    }

    moveCameraTarget(position, duration = 1000)
    {
        return new Promise(resolve => {
            if (position)
            {
                new TWEEN.Tween(this.cameraControls.target).to(position, duration).easing(TWEEN.Easing.Sinusoidal.Out).onComplete(() =>
                {
                    resolve();
                }).start();
            }
            else
            {
                resolve();
            }
        });
    }

    focusOnLine(vector1, vector2, overlookDegree = 0, duration = 1000, debug = false)
    {
        return new Promise(resolve => {
            let material = null;
            let geometry = null;
            let line = null;

            let mVector = vector1.clone();
            mVector = mVector.lerp(vector2, 0.5);

            let cVector = new THREE.Vector3();
            cVector.subVectors(vector2, vector1);
            let vLength = cVector.length();

            let quaternion = new THREE.Quaternion();
            let axis = new THREE.Vector3(0, 0, 1);
            quaternion.setFromAxisAngle(axis, -Math.PI / 2);
            cVector.applyQuaternion(quaternion);

            let angle = (90 - this.camera.fov / 2) * Math.PI / 180;
            let focusLength = vLength * 0.5 * Math.tan(angle);
            cVector.normalize().multiplyScalar(focusLength);

            let overlookAngle = overlookDegree * Math.PI / 180;
            cVector.z = focusLength * Math.tan(overlookAngle);
            cVector.add(mVector);

            if (debug)
            {
                const arrowHelper = new THREE.ArrowHelper(cVector, mVector, 20, 0xff0000);
                this.add(arrowHelper);
            }

            if (this.cameraControlsEnabled && this.cameraControls != null)
            {
                new TWEEN.Tween(this.cameraControls.target).to(mVector, duration).easing(TWEEN.Easing.Sinusoidal.Out).start();
                new TWEEN.Tween(this.camera.position).to(cVector, duration).easing(TWEEN.Easing.Sinusoidal.Out).onUpdate(() =>
                {
                    this.camera.lookAt(this.cameraControls.target);
                }).start();
                new TWEEN.Tween(this.cameraControls.object.up).to({
                    x : 0,
                    y : 0,
                    z : 1
                }, duration).easing(TWEEN.Easing.Sinusoidal.Out).start();

                setTimeout(() =>
                {
                    resolve();
                }, duration * 2);
            }
        });
    }

    focusOnTriangle(vector1, vector2, vector3, overlookDegree = 0, duration = 1000, debug = false)
    {
        return new Promise(() => {
            let material = null;
            let geometry = null;
            let line = null;

            let mVector = vector1.clone();
            mVector = mVector.lerp(vector2, 0.5);

            let cVector = new THREE.Vector3();
            cVector.subVectors(vector2, vector1);
            let vLength = cVector.length();

            let quaternion = new THREE.Quaternion();
            let axis = new THREE.Vector3(0, 0, 1);
            quaternion.setFromAxisAngle(axis, -Math.PI / 2);
            cVector.applyQuaternion(quaternion);

            let angle = (90 - this.camera.fov / 2) * Math.PI / 180;
            let overlookAngle = overlookDegree * Math.PI / 180;

            let focusLength1 = vLength * 0.5 * Math.tan(angle);
            let height = Math.abs(vector3.z) + 100;
            let focusLength2 = height * (Math.sin(overlookAngle) + Math.cos(overlookAngle) * Math.tan(angle)) * Math.cos(overlookAngle);
            let focusLength = focusLength1 > focusLength2 ? focusLength1 : focusLength2;

            cVector.normalize().multiplyScalar(focusLength);
            cVector.z = focusLength * Math.tan(overlookAngle);
            cVector.add(mVector);

            if (debug)
            {
                material = new THREE.LineBasicMaterial({
                    color : 0xffffff
                });
                geometry = new THREE.Geometry();
                geometry.vertices.push(mVector);
                geometry.vertices.push(cVector);
                line = new THREE.Line(geometry, material);
                this.add(line);
            }

            if (this.cameraControlsEnabled && this.cameraControls)
            {
                new TWEEN.Tween(this.cameraControls.target).to(mVector, duration).easing(TWEEN.Easing.Sinusoidal.Out).start();
                new TWEEN.Tween(this.camera.position).to(cVector, duration).easing(TWEEN.Easing.Sinusoidal.Out).onUpdate(() =>
                {
                    this.camera.lookAt(this.cameraControls.target);
                }).start();
                new TWEEN.Tween(this.cameraControls.object.up).to({
                    x : 0,
                    y : 0,
                    z : 1
                }, duration).easing(TWEEN.Easing.Sinusoidal.Out).start();

                setTimeout(() =>
                {
                    resolve();
                }, duration);
            }
        });
    }

    resetCamera(perspective = false, duration = 2000)
    {
        if (this.cameraControls)
        {
            let position = null;
            let rotation = null;

            if (!perspective)
            {
                let params = this.cameraParams;
                position = {
                    x : 0,
                    y : 0,
                    z : 0
                };
                rotation = {
                    x : 0,
                    y : 0,
                    z : 0
                };
                if (Array.isArray(params.position))
                {
                    position.x = params.position[0];
                    position.y = params.position[1];
                    position.z = params.position[2];
                }
                else
                {
                    position = Object.assign(position, params.position);
                }
           }
           else
           {
                position = {
                    x : -50.9760365348891,
                    y : -1750.5946134789813,
                    z : 2470.697634926914
                };
                rotation = {
                    x : 0.6164362891923738,
                    y : -0.01683316387367657,
                    z : 0.01192588582967832
                };
           }
           return this.moveCamera(position, rotation, duration);
       }
       return Promise.reject();
   }
}
