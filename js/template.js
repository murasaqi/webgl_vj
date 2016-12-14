/// <reference path="typings/index.d.ts" />
// *********** ひとつめのシーン *********** //
var SceneBoxA = (function () {
    function SceneBoxA() {
        this.timer = 0;
        this.createScene();
    }
    // シーンを作る。ここでオブジェクトを格納していく。
    SceneBoxA.prototype.createScene = function () {
        // シーンを作る
        this.scene = new THREE.Scene();
        // カメラを作成
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
        this.camera.position.z = 1000;
        this.Box = new THREE.Mesh(new THREE.BoxGeometry(50, 50, 50), new THREE.MeshBasicMaterial(0xffffff));
        this.scene.add(this.Box);
    };
    // ワンフレームごとの処理
    SceneBoxA.prototype.update = function () {
        // ❑の横運動
        this.timer += 0.1;
        this.Box.position.x = 50 * Math.sin(this.timer);
    };
    return SceneBoxA;
}());
// *********** ふたつめのシーン *********** //
var SceneBoxB = (function () {
    function SceneBoxB() {
        this.timer = 0;
        this.createScene();
    }
    SceneBoxB.prototype.createScene = function () {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
        this.camera.position.z = 1000;
        this.Box = new THREE.Mesh(new THREE.BoxGeometry(50, 50, 50), new THREE.MeshBasicMaterial(0x888888));
        this.scene.add(this.Box);
    };
    SceneBoxB.prototype.update = function () {
        // ❑の縦運動
        this.timer += 0.1;
        this.Box.position.y = 50 * Math.sin(this.timer);
    };
    return SceneBoxB;
}());
//# sourceMappingURL=template.js.map