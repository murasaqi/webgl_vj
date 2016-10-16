var FloatingBox = (function () {
    function FloatingBox() {
        this.objs = [];
        this.timer = 0.0;
        this.objects = [];
        this.radius = 300;
        this.position_origin = [];
        this.animateVector = [];
        this.UPDATE = true;
        this.END = false;
        // レンダラーを作成
        //this.createRenderer();
        // シーンを作成
        this.createScene();
    }
    FloatingBox.prototype.remove = function () {
        while (this.scene.children.length != 0) {
            this.scene.remove(this.scene.children[0]);
            if (this.scene.children[0] == THREE.Mesh) {
                this.scene.children[0].geometry.dispose();
                this.scene.children[0].material.dispose();
            }
        }
        ;
    };
    FloatingBox.prototype.createRenderer = function () {
        // WebGL レンダラーを作成
        this.renderer = new THREE.WebGLRenderer();
        // サイズの設定
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.sortObjects = false;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowMap;
        document.body.appendChild(this.renderer.domElement);
    };
    FloatingBox.prototype.createScene = function () {
        // シーン (空間) を作成
        this.scene = new THREE.Scene();
        this.geometry = new THREE.BoxGeometry(1, 1, 1);
        this.material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        this.cube = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.cube);
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x000000, -500, 3000);
        var ambient = new THREE.AmbientLight(0x505050);
        this.scene.add(ambient);
        var light = new THREE.SpotLight(0xffffff);
        light.position.set(0, 2000, 0);
        light.castShadow = true;
        light.shadow = new THREE.LightShadow(new THREE.PerspectiveCamera(50, 1, 400, 20000));
        light.shadow.bias = -0.00022;
        //
        light.shadow.mapSize.width = 2048;
        light.shadow.mapSize.height = 2048;
        this.scene.add(light);
        var light02 = new THREE.SpotLight(0xffffff, 0.4);
        light02.position.set(0, -500, 0);
        this.scene.add(light02);
        var dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.name = 'Dir. Light';
        dirLight.position.set(0, 10, 0);
        this.scene.add(dirLight);
        // カメラを作成
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
        this.camera.position.z = 1000;
        this.cameraNextPos = new THREE.Vector3(Math.random() * 30 - 30, Math.random() * 30 - 30, Math.random() * 30 - 30 + 1000);
        this.cameraNextLookAt = new THREE.Vector3(Math.random() * 30 - 30, Math.random() * 30 - 30, Math.random() * 30 - 30);
        this.cameraLookAt = new THREE.Vector3(Math.random() * 40 - 20, Math.random() * 40 - 20, Math.random() * 40 - 40);
        var settings = {
            metalness: 0.1,
            roughness: 0.2,
            ambientIntensity: 0.1,
            aoMapIntensity: 1.0,
            envMapIntensity: 1.0,
            displacementScale: 2.436143,
            normalScale: 1.0
        };
        var textureLoader = new THREE.TextureLoader();
        this.normalMap = textureLoader.load("texture/tilenormalmap.png");
        this.map = textureLoader.load("texture/tilemap.png");
        this.displacementMap = textureLoader.load("texture/tilehightmap.jpg");
        var planeGeo = new THREE.PlaneGeometry(6000, 6000, 10, 10);
        var planeMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: settings.roughness,
            metalness: settings.metalness,
            normalMap: this.normalMap,
            normalScale: new THREE.Vector2(1, -1),
            displacementMap: this.displacementMap,
            displacementScale: settings.displacementScale,
            displacementBias: -0.428408,
            map: this.map,
            side: THREE.DoubleSide
        });
        var planeWireMaterial = new THREE.MeshPhongMaterial({
            color: 0x000000,
            wireframe: true
        });
        planeGeo.rotateX(-Math.PI / 2);
        var obj = new THREE.Mesh(planeGeo, planeMaterial);
        obj.position.y = -600;
        obj.position.z = 1000;
        obj.castShadow = true;
        obj.receiveShadow = true;
        this.scene.add(obj);
        var geometry = new THREE.BoxGeometry(40, 40, 40);
        var material = new THREE.MeshPhongMaterial({
            // color:  0x111111,
            color: 0xffffff,
            specular: 0x555555,
            shininess: 10,
            shading: THREE.FlatShading
        });
        for (var i = 0; i < 60; i++) {
            var theta = Math.random() * Math.PI * 2;
            var phi = Math.random() * Math.PI * 2;
            var object = new THREE.Mesh(geometry, material);
            object.position.x = Math.sin(theta) * Math.cos(phi) * this.radius;
            object.position.y = Math.cos(theta) * this.radius;
            object.position.z = Math.sin(theta) * Math.sin(phi) * this.radius;
            this.position_origin.push(new THREE.Vector3(object.position.x, object.position.y, object.position.z));
            vec = new THREE.Vector3(theta, phi, 0);
            this.animateVector.push(vec);
            object.rotation.x = Math.random() * 2 * Math.PI;
            object.rotation.y = Math.random() * 2 * Math.PI;
            object.rotation.z = Math.random() * 2 * Math.PI;
            object.castShadow = true;
            object.receiveShadow = true;
            this.scene.add(object);
            this.objects.push(object);
        }
        var points = [];
        for (var i = 0; i < 10; i++) {
            var randomx = -20 + Math.round(Math.random() * 200);
            var randomy = -15 + Math.round(Math.random() * 400);
            var randomz = -20 + Math.round(Math.random() * 400);
            points.push(new THREE.Vector3(randomx, randomy, randomz));
        }
        console.log(this.scene);
        //window.addEventListener( 'resize', this.onWindowResize, false );
    };
    FloatingBox.prototype.onWindowResize = function () {
        // this.camera.aspect = window.innerWidth / window.innerHeight;
        // this.camera.updateProjectionMatrix();
        //
        // this.renderer.setSize( window.innerWidth, window.innerHeight );
    };
    FloatingBox.prototype.endEnabled = function () {
        this.UPDATE = false;
    };
    FloatingBox.prototype.update = function () {
        //console.log(this.END);
        if (this.UPDATE == false) {
            //this.scene.remove(this.scene.children[0]);
            this.remove();
            if (this.scene.children.length == 0) {
                this.END = true;
            }
        }
        var date = new Date();
        if (this.cameraNextPos.distanceTo(this.camera.position) < 2) {
            var dist = 800;
            this.cameraNextPos = new THREE.Vector3(Math.random() * dist - dist / 2, Math.random() * dist - dist / 2, Math.random() * 2000 - 1000);
            this.cameraNextLookAt = new THREE.Vector3(Math.random() * 40 - 20, Math.random() * 40 - 20, Math.random() * 40 - 40);
        }
        this.timer += 0.01;
        for (var i = 0; i < this.objects.length; i++) {
            this.objects[i].rotation.x += 0.01;
            this.objects[i].rotation.y += 0.01;
            this.objects[i].rotation.z += 0.01;
            var _radius = 200 * Math.sin(this.timer) + this.radius;
            this.animateVector[i].x += 0.01;
            this.animateVector[i].y += 0.01;
            this.objects[i].position.x = Math.sin(this.animateVector[i].x) * Math.cos(this.animateVector[i].y) * _radius;
            this.objects[i].position.y = Math.cos(this.animateVector[i].x) * _radius;
            this.objects[i].position.z = Math.sin(this.animateVector[i].x) * Math.sin(this.animateVector[i].y) * _radius;
        }
        var speed = 0.02;
        this.camera.position.x += (this.cameraNextPos.x - this.camera.position.x) * speed;
        this.camera.position.y += (this.cameraNextPos.y - this.camera.position.y) * speed;
        this.camera.position.z += (this.cameraNextPos.z - this.camera.position.z) * speed;
        this.cameraLookAt.x += (this.cameraNextLookAt.x - this.cameraLookAt.x) * speed;
        this.cameraLookAt.y += (this.cameraNextLookAt.y - this.cameraLookAt.y) * speed;
        this.cameraLookAt.z += (this.cameraNextLookAt.z - this.cameraLookAt.z) * speed;
        var lookat = new THREE.Vector3(this.cameraLookAt.x * Math.sin(this.timer), this.cameraLookAt.y * Math.sin(this.timer), this.cameraLookAt.z * Math.sin(this.timer));
        this.camera.lookAt(lookat);
    };
    return FloatingBox;
}());
//# sourceMappingURL=box.js.map