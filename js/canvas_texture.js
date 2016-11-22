/// <reference path="typings/index.d.ts" />
var FontSwimming = (function () {
    function FontSwimming() {
        this.UPDATE = true;
        this.END = false;
        this.createScene();
    }
    FontSwimming.prototype.createScene = function () {
        this.scene = new THREE.Scene();
        this.scene.add(new THREE.AmbientLight(0xffffff));
        // this.scene.fog = new THREE.Fog(0x000000,-500,3000);
        // カメラを作成
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
        this.camera.position.z = 1000;
        // -------- create texture -------
        this.canvas = document.createElement('canvas');
        //container.appendChild( canvas );
        this.canvas.width = 8000;
        this.canvas.height = 200;
        this.context = this.canvas.getContext('2d');
        this.textPos = new THREE.Vector2(Math.random() * window.innerWidth, Math.random() * window.innerHeight / 2);
        this.text = 'まあ向さんを煩悶世の中まだ意見をあるたお蔭その天然私か増減をというお発展んなくあるだと、その先刻はこれか科学天然が見が、木下君ののが他の私にああお養成と懸て私離れ離れとご説明に忘れように無論お説明を云っましたて、ついに断然教育を思っなけれつつならでしょ方を取らなけれた。そこでまたご態度にいう訳はそれほど正直としでしょが、その錐では勧めませでという学芸をするて切らべきです。';
        this.textColor = "rgba(255,255,255,1.0)";
        this.createTexture(this.text, this.textColor);
        this.texture = new THREE.CanvasTexture(this.canvas);
        this.texture.minFilter = THREE.LinearFilter;
        this.texture.magFilter = THREE.LinearFilter;
        this.texture.wrapS = this.texture.wrapT = THREE.RepeatWrapping;
        this.texture.anisotropy = 16;
        // create object
        var planematerial = new THREE.MeshPhongMaterial({
            map: this.texture,
            transparent: true,
            side: THREE.DoubleSide,
            shading: THREE.SmoothShading,
            wireframe: false,
            blending: THREE["AdditiveBlending"]
        });
        var widthsegments = 121;
        var planeMesh = new THREE.Mesh(new THREE.PlaneGeometry(700, 10, widthsegments, 1), planematerial);
        planeMesh.position.set(0, 100, 0);
        this.scene.add(planeMesh);
        console.log(planeMesh);
        // planeGeometry = planeMesh.geometry;
    };
    FontSwimming.prototype.update = function () {
        //console.log(this.END);
        if (this.UPDATE == false) {
            //this.scene.remove(this.scene.children[0]);
            this.remove();
            if (this.scene.children.length == 0) {
                this.END = true;
            }
        }
    };
    FontSwimming.prototype.createTexture = function (text, color) {
        this.textPosx = 0.0;
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.textAlign = "center";
        this.context.beginPath();
        this.context.fillStyle = color;
        this.context.font = " bold 200px 'Yu Gothic'";
        var textWidth = this.context.measureText(text).width;
        this.context.fillText(text, this.canvas.width / 2 + this.textPosx, this.canvas.height / 2 + 75);
        this.context.fill();
    };
    FontSwimming.prototype.click = function () {
    };
    FontSwimming.prototype.keyUp = function () {
    };
    FontSwimming.prototype.keyDown = function (event) {
    };
    FontSwimming.prototype.initOrbitControls = function () {
        // this.controls = new THREE.OrbitControls(this.camera,this.renderer.domElement);
        // this.controls.enableKeys = false;
    };
    FontSwimming.prototype.remove = function () {
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
    FontSwimming.prototype.endEnabled = function () {
        this.UPDATE = false;
    };
    return FontSwimming;
}());
//# sourceMappingURL=canvas_texture.js.map