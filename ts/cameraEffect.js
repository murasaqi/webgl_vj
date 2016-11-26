var CameraEffect = (function () {
    function CameraEffect() {
        this.UPDATE = true;
        this.END = false;
        this.vertixes = [];
        this.createScene();
    }
    CameraEffect.prototype.remove = function () {
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
    CameraEffect.prototype.createScene = function () {
        this.scene = new THREE.Scene();
        // this.scene.fog = new THREE.Fog(0x000000,0,1000);
        // カメラを作成
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
        this.camera.position.z = 1;
        var geometry = new THREE.Geometry();
        for (i = 0; i < 10; i++) {
            geometry.vertices.push(new THREE.Vector3(Math.random() * 100, Math.random() * 100, Math.random() * 100));
        }
        var material = new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 1, linewidth: 3 });
        var line = new THREE.Line(geometry, material);
        this.scene.addEventListener(line);
    };
    CameraEffect.prototype.endEnabled = function () {
        this.UPDATE = false;
    };
    CameraEffect.prototype.update = function () {
        //console.log(this.END);
        if (this.UPDATE == false) {
            //this.scene.remove(this.scene.children[0]);
            this.remove();
            if (this.scene.children.length == 0) {
                this.END = true;
            }
        }
    };
    return CameraEffect;
}());
//# sourceMappingURL=cameraEffect.js.map