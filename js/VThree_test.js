/// <reference path="typings/index.d.ts" />
(function () {
    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('click', onWindowClick, false);
    window.addEventListener('keydown', onKeyDown);
    var NUM = 0;
    var scenes = [];
    // シーン
    var renderer;
    init();
    render();
    function init() {
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.sortObjects = false;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFShadowMap;
        renderer.domElement.id = "main";
        document.body.appendChild(renderer.domElement);
        scenes.push(new SceneA(renderer));
        scenes.push(new SceneB(renderer));
        scenes.push(new SceneC(renderer));
    }
    function render() {
        scenes[NUM].update();
        renderer.render(scenes[NUM].scene, scenes[NUM].camera);
        requestAnimationFrame(render);
    }
    function onWindowResize(event) {
        scenes[NUM].resize();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    function onWindowClick(event) {
        scenes[NUM].click();
    }
    function checkNum(length) {
        if (NUM < 0) {
            NUM = length - 1;
        }
        if (NUM >= length) {
            NUM = 0;
        }
    }
    function onKeyDown(event) {
        scenes[NUM].keyDown(event);
        if (event.key == "ArrowRight") {
            NUM++;
            checkNum(scenes.length);
        }
        if (event.key == "ArrowLeft") {
            NUM--;
            checkNum(scenes.length);
        }
    }
})();
//# sourceMappingURL=VThree_test.js.map