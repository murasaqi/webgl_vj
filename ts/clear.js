/// <reference path="typings/index.d.ts" />
var Clear = (function () {
    function Clear(renderer) {
        this.UPDATE = true;
        this.END = false;
        this.renderer = renderer;
        this.createScene();
    }
    Clear.prototype.update = function () {
        //console.log(this.END);
        this.renderer.setClearColor(0x000000, 1.0);
        if (this.UPDATE == false) {
            //this.scene.remove(this.scene.children[0]);
            this.remove();
            if (this.scene.children.length == 0) {
                this.END = true;
            }
        }
    };
    Clear.prototype.createScene = function () {
        this.scene = new THREE.Scene();
        // this.scene = new THREE.Scene();
        // this.scene.fog = new THREE.Fog(0x000000,-500,3000);
        // カメラを作成
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
        this.camera.position.z = 1000;
    };
    Clear.prototype.click = function () {
    };
    Clear.prototype.keyUp = function () {
    };
    Clear.prototype.keyDown = function (event) {
    };
    Clear.prototype.initOrbitControls = function () {
        // this.controls = new THREE.OrbitControls(this.camera,this.renderer.domElement);
        // this.controls.enableKeys = false;
    };
    Clear.prototype.remove = function () {
        //console.log(this.scene.children);
        while (this.scene.children.length != 0) {
            this.scene.remove(this.scene.children[0]);
            if (this.scene.children[0] == THREE.Mesh) {
                this.scene.children[0].geometry.dispose();
                this.scene.children[0].material.dispose();
            }
        }
        ;
    };
    Clear.prototype.endEnabled = function () {
        this.UPDATE = false;
    };
    return Clear;
}());
//# sourceMappingURL=clear.js.map