import EventEmitter from "wolfy87-eventemitter";

export default class Object3D extends EventEmitter
{
    mesh = null;

    loadFromObj(url, onProcess)
    {
        const loader = new THREE.OBJLoader();
        return new Promise((resolve, reject) => {
            loader.load(
               url,
               obj => {
                   resolve(obj);
               },
               onProcess,
               reject
            );
        });
    }
}
