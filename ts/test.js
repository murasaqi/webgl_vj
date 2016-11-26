var ThreeJSTest = (function () {
    function ThreeJSTest() {
        // レンダラーを作成
        //this.createRenderer();
        // シーンを作成
        this.createScene();
    }
    ThreeJSTest.prototype.createRenderer = function () {
        // WebGL レンダラーを作成
        this.renderer = new THREE.WebGLRenderer();
        // サイズの設定
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
    };
    ThreeJSTest.prototype.createScene = function () {
        // シーン (空間) を作成
        this.scene = new THREE.Scene();
        // 立方体のジオメトリーを作成
        this.geometry = new THREE.BoxGeometry(1, 1, 1);
        // 緑のマテリアルを作成
        this.material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        // 上記作成のジオメトリーとマテリアルを合わせてメッシュを生成
        this.cube = new THREE.Mesh(this.geometry, this.material);
        // メッシュをシーンに追加
        this.scene.add(this.cube);
        // カメラを作成
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        // カメラ位置を設定
        this.camera.position.z = 5;
    };
    ThreeJSTest.prototype.update = function () {
        //requestAnimationFrame(this.render.bind(this));
        // 立方体メッシュを自転
        this.cube.rotation.x += 0.1;
        this.cube.rotation.y += 0.1;
        // レンダリング
        //this.renderer.render(this.scene, this.camera);
    };
    return ThreeJSTest;
}());
//# sourceMappingURL=test.js.map