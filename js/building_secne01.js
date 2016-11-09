/// <reference path="typings/index.d.ts" />
var white = THREE.ColorKeywords.white;
var building_00 = (function () {
    function building_00() {
        this.UPDATE = true;
        this.END = false;
        this.createScene();
    }
    building_00.prototype.remove = function () {
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
    building_00.prototype.initOrbitControls = function (renderer) {
        this.controls = new THREE.OrbitControls(this.camera, renderer.domElement);
        this.controls.enableKeys = false;
    };
    building_00.prototype.updateControls = function () {
        this.controls.update();
    };
    building_00.prototype.createScene = function () {
        this.scene = new THREE.Scene();
        this.scene.add(new THREE.AmbientLight(0x999999));
        var dLight = new THREE.DirectionalLight(0xffffff);
        dLight.position.set(0, 10, 0);
        this.scene.add(dLight);
        // this.scene.fog = new THREE.Fog(0x000000,-500,3000);
        // カメラを作成
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
        this.camera.position.z = 10;
        // particle
        this.tick = 0;
        this.clock = new THREE.Clock(true);
        this.gui = new dat.GUI();
        this.particleSystem = new THREE.GPUParticleSystem({
            maxParticles: 100000
        });
        this.scene.add(this.particleSystem);
        this.options = {
            velocityRandomness: .49,
            positionRandomness: 15,
            size: 7.4,
            sizeRandomness: 1.4,
            colorRandomness: .03,
            lifetime: 3.2,
            turbulence: .24,
            color: 0xaaaaaa,
            position: new THREE.Vector3(0, 0, 0),
            velocity: new THREE.Vector3(0, 1, 0)
        };
        this.spawnerOptions = {
            spawnRate: 4561,
            timeScale: 0.76,
            horizontalSpeed: 1.5,
            verticalSpeed: 1.33
        };
        this.gui.add(this.options, "velocityRandomness", 0, 3);
        this.gui.add(this.options, "positionRandomness", 0, 50);
        this.gui.add(this.options, "size", 1, 20);
        this.gui.add(this.options, "sizeRandomness", 0, 25);
        this.gui.add(this.options, "colorRandomness", 0, 1);
        this.gui.add(this.options, "lifetime", .1, 10);
        this.gui.add(this.options, "turbulence", 0, 1);
        this.gui.add(this.spawnerOptions, "spawnRate", 10, 30000);
        this.gui.add(this.spawnerOptions, "timeScale", -1, 1);
        // setup controls
        this.boxs = [];
        for (var i = 0; i < 1; i++) {
            var geometry = new THREE.BoxGeometry(15, 1, 15, 1, 1, 1);
            var material = new THREE.MeshPhongMaterial({
                color: 0xffffff
            });
            var mesh = new THREE.Mesh(geometry, material);
            // mesh.position.x = Math.random()*600-300;
            mesh.position.y = -6;
            // mesh.position.z = Math.random()*400-200;
            this.boxs.push(mesh);
            this.scene.add(this.boxs[i]);
        }
        // this.lines = [];
        //
        // for ( var i = 0; i < 50; i ++ ) {
        //     var geometry = new THREE.Geometry();
        //     var point = new THREE.Vector3();
        //     var direction = new THREE.Vector3();
        //
        //
        //     var phi = Math.random()*Math.PI*2;
        //     var theta = Math.random()*Math.PI*2;
        //     var r = 10;
        //     direction.x = r * Math.sin(theta) * Math.cos(phi);
        //     direction.y = r * Math.cos(theta);
        //     direction.z = r * Math.sin(theta) * Math.sin(phi);
        //     for ( var j = 0; j < 50; j ++ ) {
        //         direction.x += Math.random() - 0.5;
        //         direction.y += Math.random() - 0.5;
        //         direction.z += Math.random() - 0.5;
        //         direction.normalize().multiplyScalar( 20 );
        //         point.add( direction );
        //         geometry.vertices.push( point.clone() );
        //     }
        //     var object;
        //     object = new THREE.Line( geometry,new THREE.LineBasicMaterial( { color: white} ));
        //     this.lines.push(object);
        //     this.scene.add( object );
        // }
        //
        // console.log(this.lines[0]);
        this.timer = 0.0;
        // this.scene.add(parentTransform);
    };
    building_00.prototype.endEnabled = function () {
        this.UPDATE = false;
    };
    building_00.prototype.update = function () {
        //console.log(this.END);
        if (this.UPDATE == false) {
            //this.scene.remove(this.scene.children[0]);
            this.remove();
            if (this.scene.children.length == 0) {
                this.END = true;
            }
        }
        var delta = this.clock.getDelta() * this.spawnerOptions.timeScale;
        this.tick += delta;
        if (this.tick < 0)
            this.tick = 0;
        for (var x = 0; x < this.spawnerOptions.spawnRate * delta; x++) {
            this.particleSystem.spawnParticle(this.options);
        }
        this.particleSystem.update(this.tick);
        // this.timer+=0.01;
        //
        // var date = new Date();
        // var noiseXRange = 0.03;
        // var noiseYRange = 0.01;
        // var noiseZRange = 0.02;
        //
        // for (var i = 0; i < this.lines.length; i++)
        // {
        //     var position = this.lines[i].geometry.vertices;
        //     var maxCount = 100;
        //     var yOff = 0.0;
        //     // timer += 0.01;
        //
        //     for(var j = 0; j < position.length; j++)
        //     {
        //
        //
        //         yOff+=0.01;
        //         // var value = noise.perlin2(position[j].x*0.01,date.getMilliseconds()*0.001);
        //         position[j].x += Math.sin(position[j].x);
        //
        //
        //
        //         var value = noise.perlin2(yOff,date.getMilliseconds()*0.001)*1.0;
        //         // position[j].y +=Math.sin(yOff);
        //
        //         // value = noise.perlin2(position[j].z*0.01,date.getMilliseconds()*0.001);
        //         // position[j].z += value;
        //     }
        //
        //     this.lines[i].geometry.verticesNeedUpdate = true;
        //
        // }
    };
    return building_00;
}());
//# sourceMappingURL=building_secne01.js.map