var Terrain = (function () {
    function Terrain() {
        this.UPDATE = true;
        this.END = false;
        this.WIDTH = window.innerWidth;
        this.HEIGHT = window.innerHeight;
        this.preSec = 0;
        this.timer_end = Math.PI;
        this.timer = 0;
        this.timer_roop = 0;
        this.frameCounter = 0;
        // camera
        this.VIEW_ANGLE = 45;
        this.ASPECT = this.WIDTH / this.HEIGHT;
        this.NEAR = 1;
        this.FAR = 2000;
        this.vertex = [];
        this.planes = [];
        this.cubes = [];
        this.cubePos = [];
        this.noiseseed = [];
        this.settings = {
            metalness: 0.1,
            roughness: 0.2,
            ambientIntensity: 0.1,
            aoMapIntensity: 1.0,
            envMapIntensity: 1.0,
            displacementScale: 2.436143,
            normalScale: 1.0
        };
        this.createScene();
    }
    Terrain.prototype.remove = function () {
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
    Terrain.prototype.createScene = function () {
        // シーン (空間) を作成
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x000000, 1, 2500);
        // 立方体のジオメトリーを作成
        this.geometry = new THREE.BoxGeometry(1, 1, 1);
        // 緑のマテリアルを作成
        this.material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        // 上記作成のジオメトリーとマテリアルを合わせてメッシュを生成
        this.cube = new THREE.Mesh(this.geometry, this.material);
        // メッシュをシーンに追加
        this.scene.add(this.cube);
        // カメラを作成
        this.camera = new THREE.PerspectiveCamera(this.VIEW_ANGLE, this.ASPECT, this.NEAR, this.FAR);
        // カメラ位置を設定
        this.camera.position.z = 5;
        // ***************** creat objs ***************** //
        var width = 3000;
        this.planeGeo = new THREE.PlaneGeometry(width, width, 20, 20);
        var wirematerial = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            wireframe: true,
            wireframeLinewidth: 3,
            transparent: true,
            opacity: 0.3
        });
        this.planeMat = wirematerial;
        console.log(this.planeGeo);
        this.vertex = this.planeGeo.vertices;
        var _x = 0;
        var _y = 0;
        var _z = 0;
        for (var i = 0; i < this.vertex.length; i++) {
            //console.log(vertex[i]);
            _x += 0.1;
            _y += 0.2;
            _z += 0.1;
            this.noiseseed.push({ x: _x, y: _y, z: _z });
        }
        var cubemapmaterial = new THREE.MeshPhongMaterial({
            color: 0x000000,
            Shading: THREE.FlatShading
        });
        var ypos = 300;
        var upperWire = new THREE.Mesh(this.planeGeo, this.planeMat);
        upperWire.rotateX(Math.PI / 2);
        upperWire.position.y = ypos;
        upperWire.position.z = 0;
        this.planes.push(upperWire);
        this.scene.add(upperWire);
        var wireMesh = new THREE.Mesh(this.planeGeo, this.planeMat);
        wireMesh.rotateX(-Math.PI / 2);
        wireMesh.updateMatrix();
        wireMesh.position.y = -ypos;
        wireMesh.position.z = 0;
        this.scene.add(wireMesh);
        var dLight00 = new THREE.DirectionalLight(0xcccccc, 0.5);
        dLight00.position.set(0, 1, 0);
        this.scene.add(dLight00);
        var dLight01 = new THREE.DirectionalLight(0xcccccc, 0.5);
        dLight01.position.set(0, -1, 0);
        this.scene.add(dLight01);
        // lights
        this.mainLight = new THREE.PointLight(0xcccccc, 0.3, 250);
        this.mainLight.position.y = 60;
        this.scene.add(this.mainLight);
        this.greenLight = new THREE.PointLight(0x26FFE0, 0.3, 1000);
        this.greenLight.position.set(550, 50, 0);
        this.scene.add(this.greenLight);
        this.redLight = new THREE.PointLight(0xFF30FD, 0.3, 1000);
        this.redLight.position.set(-550, 50, 0);
        this.scene.add(this.redLight);
        this.blueLight = new THREE.PointLight(0xFACC22, 0.3, 1000);
        this.blueLight.position.set(0, 50, 550);
        this.scene.add(this.blueLight);
        // this.scene.add( new THREE.PointLightHelper( this.mainLight, 15 ) );
        // this.scene.add( new THREE.PointLightHelper( this.greenLight, 15 ) );
        // this.scene.add( new THREE.PointLightHelper( this.redLight, 15 ) );
        // this.scene.add( new THREE.PointLightHelper( this.blueLight, 15 ) );
        var centerLight = new THREE.PointLight(0xffffff, 0.7, 1000);
        centerLight.position.set(0, 0, 0);
        this.scene.add(centerLight);
        var textureLoader = new THREE.TextureLoader();
        var normalMap = textureLoader.load("texture/nomalmap.png");
        //var map = textureLoader.load( "textures/tilemap.png" );
        var displacementMap = textureLoader.load("texture/bumpmap.jpg");
        var cubeGeomery = new THREE.CubeGeometry(20, 20, 20);
        var cubeMaterial = new THREE.MeshStandardMaterial({
            color: 0xaaaaaa, specular: 0xffffff, shininess: 250,
            roughness: this.settings.roughness,
            metalness: this.settings.metalness,
            normalMap: normalMap,
            normalScale: new THREE.Vector2(1, -1),
            displacementMap: displacementMap,
            displacementScale: this.settings.displacementScale,
            displacementBias: -0.428408
        });
        for (var i = 0; i < 30; i++) {
            var phi = Math.random() * Math.PI * 2;
            var theta = Math.random() * Math.PI * 2;
            var mesh = new THREE.Mesh(cubeGeomery, cubeMaterial);
            mesh.position.x = 100 * Math.cos(phi) * Math.sin(theta);
            mesh.position.y = 100 * Math.cos(theta);
            mesh.position.z = 100 * Math.sin(phi) * Math.sin(theta);
            this.cubePos.push({ position: mesh.position, phi: phi, theta: theta });
            this.cubes.push(mesh);
            this.scene.add(mesh);
        }
    };
    Terrain.prototype.endEnabled = function () {
        this.UPDATE = false;
    };
    Terrain.prototype.update = function () {
        this.noise_timer += 0.01;
        //console.log(this.END);
        if (this.UPDATE == false) {
            //this.scene.remove(this.scene.children[0]);
            this.remove();
            if (this.scene.children.length == 0) {
                this.END = true;
            }
        }
        var date = new Date();
        this.timer_roop += 0.03;
        for (var i = 0; i < this.noiseseed.length; i++) {
            this.noiseseed[i].x += 0.01;
            this.noiseseed[i].y += 0.03;
            this.noiseseed[i].z += 0.02;
        }
        if (BUNG) {
            this.timer = 0.0;
        }
        BUNG = false;
        this.timer += (this.timer_end - this.timer) * 0.3;
        this.frameCounter += 0.001;
        this.planeMat.opacity = bungValue * 0.4;
        this.camera.position.x = Math.sin(this.frameCounter) * 1000;
        this.camera.position.z = Math.cos(this.frameCounter) * 1000;
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        for (var i = 0; i < this.vertex.length; i++) {
            var value = noise.perlin3(this.noiseseed[i].x, this.noiseseed[i].y, this.noiseseed[i].z) * 200 + bungValue * 0.05;
            //vertex[i].z+=5;
            this.planeGeo.vertices[i].z = Math.abs(value * Math.sin(this.timer));
        }
        for (var i = 0; i < this.cubePos.length; i++) {
            this.cubePos[i].phi += 0.01;
            this.cubePos[i].theta += 0.01;
            var rad = 100 + 100 * Math.sin(this.timer_roop);
            this.cubePos[i].x = rad * Math.cos(this.cubePos[i].phi) * Math.sin(this.cubePos[i].theta);
            this.cubePos[i].y = rad * Math.cos(this.cubePos[i].theta);
            this.cubePos[i].z = rad * Math.sin(this.cubePos[i].phi) * Math.sin(this.cubePos[i].theta);
            this.cubes[i].position.x = this.cubePos[i].x;
            this.cubes[i].position.y = this.cubePos[i].y;
            this.cubes[i].position.z = this.cubePos[i].z;
            this.cubes[i].rotation.x = this.cubePos[i].phi;
            this.cubes[i].rotation.y = this.cubePos[i].theta;
        }
        var rad = Math.sin(this.timer_roop * 0.6) * 300 + 700;
        this.camera.position.x = rad * Math.sin(this.timer_roop * 0.4) * Math.cos(this.timer_roop * 0.3 * 0.4);
        this.camera.position.z = rad * Math.cos(this.timer_roop * 0.4);
        this.camera.position.y = 100 * Math.sin(this.timer_roop * 0.4) * Math.sin(this.timer_roop * 0.3 * 0.4);
        this.camera.lookAt(new THREE.Vector3(0, 0, Math.sin(this.timer_roop * 0.9) * 20));
        this.planeGeo.verticesNeedUpdate = true;
        this.mainLight.position.x = 300 * Math.sin(this.timer_roop) * Math.cos(this.timer_roop * 0.3);
        this.mainLight.position.z = 300 * Math.cos(this.timer_roop);
        this.mainLight.position.y = 300 * Math.sin(this.timer_roop) * Math.sin(this.timer_roop * 0.3);
        this.redLight.position.x = 300 * Math.sin(this.timer_roop * 0.2) * Math.cos(this.timer_roop * 0.5);
        this.redLight.position.z = 300 * Math.cos(this.timer_roop * 0.2);
        this.redLight.position.y = 300 * Math.sin(this.timer_roop * 0.2) * Math.sin(this.timer_roop * 0.5);
        this.greenLight.position.x = 300 * Math.sin(this.timer_roop + 0.5) * Math.cos(this.timer_roop * 0.3);
        this.greenLight.position.z = 300 * Math.cos(this.timer_roop + 0.5);
        this.greenLight.position.y = 300 * Math.sin(this.timer_roop + 0.5) * Math.sin(this.timer_roop * 0.3);
        this.blueLight.position.x = 300 * Math.sin(this.timer_roop * 0.8) * Math.cos(this.timer_roop * 0.9);
        this.blueLight.position.z = 300 * Math.cos(this.timer_roop * 0.8);
        this.blueLight.position.y = 300 * Math.sin(this.timer_roop * 0.8) * Math.sin(this.timer_roop * 0.9);
        // this.redLight.position.x = 200 * Math.cos(this.timer_roop);
        // this.redLight.position.z = 200 * Math.sin(this.timer_roop);
        //
        // this.blueLight.position.x = 300 * Math.sin(this.timer_roop+0.5);
        // this.blueLight.position.z = 300 * Math.cos(this.timer_roop+0.5);
        this.preSec = date.getSeconds();
    };
    return Terrain;
}());
//# sourceMappingURL=terrain.js.map