/// <reference path="typings/index.d.ts" />


// *********** ひとつめのシーン *********** //
class SceneBoxA {

    public scene: THREE.Scene;
    public camera: THREE.Camera;
    private Box:THREE.Mesh;
    private timer:number = 0;


    constructor() {

        this.createScene();

    }

    // シーンを作る。ここでオブジェクトを格納していく。
    private createScene(){

        // シーンを作る
        this.scene = new THREE.Scene();

        // カメラを作成
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 10000 );
        this.camera.position.z = 1000;

        this.Box = new THREE.Mesh(
            new THREE.BoxGeometry(50,50,50),
            new THREE.MeshBasicMaterial(0xffffff)
        );

        this.scene.add(this.Box);

    }

    // ワンフレームごとの処理
    public update() {

        // ❑の横運動
        this.timer += 0.1;
        this.Box.position.x = 50 * Math.sin(this.timer);
    }


}


// *********** ふたつめのシーン *********** //

class SceneBoxB {

    public scene: THREE.Scene;
    public camera: THREE.Camera;
    private Box:THREE.Mesh;
    private timer:number = 0;


    constructor() {

        this.createScene();

    }

    private createScene(){

        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 10000 );
        this.camera.position.z = 1000;


        this.Box = new THREE.Mesh(
            new THREE.BoxGeometry(50,50,50),
            new THREE.MeshBasicMaterial(0x888888)
        );

        this.scene.add(this.Box);

    }

    public update() {

        // ❑の縦運動
        this.timer += 0.1;
        this.Box.position.y = 50 * Math.sin(this.timer);
    }


}


