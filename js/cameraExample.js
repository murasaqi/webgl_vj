/// <reference path="typings/index.d.ts" />
var CameraA = (function () {
    function CameraA() {
        this.timer = 0;
        this.createScene();
    }
    // シーンを作る。ここでオブジェクトを格納していく。
    CameraA.prototype.createScene = function () {
        // シーンを作る
        this.scene = new THREE.Scene();
        var p_light = new THREE.PointLight(0xffffff);
        p_light.position.set(0, 300, 0);
        this.scene.add(p_light);
        var d_light = new THREE.DirectionalLight(0xffffff);
        d_light.position.set(0, 0, 200);
        this.scene.add(d_light);
        for (var i = 0; i < 20; i++) {
            var r = Math.random() * 255;
            var g = Math.random() * 255;
            var b = Math.random() * 255;
            var box = new THREE.Mesh(new THREE.BoxGeometry(50, 50, 50), new THREE.MeshLambertMaterial({ color: 0xffffff * Math.random() - 0.5 }));
            var rad = Math.random() * Math.PI * 2;
            box.position.set(Math.cos(rad) * 600, 0, (Math.sin(rad) * 600));
            this.scene.add(box);
        }
        // カメラを作成
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
        this.camera.position.z = 500;
        this.Box = new THREE.Mesh(new THREE.BoxGeometry(50, 50, 50), new THREE.MeshLambertMaterial(0xffffff));
        this.scene.add(this.Box);
    };
    // ワンフレームごとの処理
    CameraA.prototype.update = function () {
        this.timer += 0.01;
        this.Box.rotateY(0.01);
        this.Box.rotateX(0.01);
        this.Box.position.x = 200 * Math.cos(this.timer);
        this.Box.position.z = 200 * Math.sin(this.timer);
    };
    return CameraA;
}());
var CameraB = (function () {
    function CameraB() {
        this.timer = 0;
        this.createScene();
    }
    // シーンを作る。ここでオブジェクトを格納していく。
    CameraB.prototype.createScene = function () {
        // シーンを作る
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x000000, 0, 1500);
        // var a_light = new THREE.AmbientLight(0xffffff,0.5);
        // this.scene.add(a_light);
        var d_light = new THREE.DirectionalLight(0xffffff);
        d_light.position.set(0, 1, 1).normalize();
        this.scene.add(d_light);
        var d_light = new THREE.DirectionalLight(0xffffff);
        d_light.position.set(0, 1, 0).normalize();
        this.scene.add(d_light);
        this.p_light = new THREE.PointLight(0xffffff);
        this.p_light.position.set(0, 1, 0).normalize();
        // this.scene.add(this.p_light);
        // カメラを作成
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
        this.camera.position.z = 500;
        this.camera.position.y = 100;
        this.Box = new THREE.Mesh(new THREE.BoxGeometry(50, 50, 50), new THREE.MeshLambertMaterial(0xffffff));
        this.scene.add(this.Box);
        for (var i = 0; i < 20; i++) {
            var r = Math.random() * 255;
            var g = Math.random() * 255;
            var b = Math.random() * 255;
            var box = new THREE.Mesh(new THREE.BoxGeometry(50, 50, 50), new THREE.MeshLambertMaterial({ color: 0xffffff * Math.random() - 0.5 }));
            var rad = Math.random() * Math.PI * 2;
            box.position.set(Math.cos(rad) * 600, 0, (Math.sin(rad) * 600));
            this.scene.add(box);
        }
    };
    // ワンフレームごとの処理
    CameraB.prototype.update = function () {
        this.timer += 0.01;
        this.Box.rotateY(0.01);
        this.Box.rotateX(0.01);
        // ぐっと近寄るパターン
        this.camera.position.z += (100 - this.camera.position.z) * 0.1;
        this.camera.position.y += (50 - this.camera.position.y) * 0.1;
        this.camera.position.y += Math.sin(this.timer) * 0.5;
        // this.camera.position.z = Math.sin(this.timer)*100+200;
        // this.camera.position.y = Math.sin(this.timer*2)*100;
        //
        //
        // this.camera.position.x = 500 * Math.cos(this.timer);
        var lookat_x = Math.sin(this.timer * 0.8) * 10;
        var lookat_y = Math.sin(this.timer * 2) * 10;
        this.camera.lookAt(new THREE.Vector3(lookat_x, lookat_y, 0));
        // this.p_light.position.set(
        //     this.camera.position.x,
        //     this.camera.position.y,
        //     this.camera.position.z
        // );
    };
    return CameraB;
}());
//# sourceMappingURL=cameraExample.js.map