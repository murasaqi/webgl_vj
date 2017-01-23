/// <reference path="typings/index.d.ts" />
var VThree = (function () {
    function VThree() {
        var _this = this;
        // 現在のシーンの番号
        this.NUM = 0;
        // シーンを格納する配列
        this.scenes = [];
        // ウィンドウの幅が変わったときの処理
        this.onWindowResize = function () {
            var windowHalfX = window.innerWidth / 2;
            var windowHalfY = window.innerHeight / 2;
            _this.scenes[_this.NUM].camera.aspect = window.innerWidth / window.innerHeight;
            _this.scenes[_this.NUM].camera.updateProjectionMatrix();
            _this.renderer.setSize(window.innerWidth, window.innerHeight);
            console.log("resize");
        };
        // 現在のシーン番号が、不適切な値にならないようにチェック
        this.checkNum = function () {
            if (_this.NUM < 0) {
                _this.NUM = _this.scenes.length - 1;
            }
            if (_this.NUM >= _this.scenes.length) {
                _this.NUM = 0;
            }
        };
        // ←→キーでシーン番号を足し引き
        this.onKeyDown = function (e) {
            console.log(e);
            // console.log(this.NUM);
            if (e.key == "ArrowRight") {
                _this.NUM++;
                _this.checkNum();
            }
            if (e.key == "ArrowLeft") {
                _this.NUM--;
                _this.checkNum();
            }
            console.log(_this.NUM);
        };
        // 初期化処理後、イベント登録
        this.init();
        window.addEventListener('resize', this.onWindowResize, false);
        document.addEventListener("keydown", this.onKeyDown, true);
    }
    VThree.prototype.init = function () {
        // Rendererを作る
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.sortObjects = false;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowMap;
        this.renderer.domElement.id = "main";
        document.body.appendChild(this.renderer.domElement);
    };
    // 管理したいシーンを格納する関数
    VThree.prototype.addScene = function (scene) {
        this.scenes.push(scene);
    };
    // 最終的な描写処理と、アニメーション関数をワンフレームごとに実行
    VThree.prototype.draw = function () {
        this.scenes[this.NUM].update();
        this.renderer.render(this.scenes[this.NUM].scene, this.scenes[this.NUM].camera);
        requestAnimationFrame(this.draw.bind(this));
    };
    return VThree;
}());
//# sourceMappingURL=VThree.js.map