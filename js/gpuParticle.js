var GPUParticle = (function () {
    function GPUParticle() {
        this.timer = 0;
        this.UPDATE = true;
        this.END = false;
        this.createScene();
    }
    GPUParticle.prototype.remove = function () {
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
    GPUParticle.prototype.createScene = function () {
        this.scene = new THREE.Scene();
        // this.scene.fog = new THREE.Fog(0x000000,-500,3000);
        // カメラを作成
        this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 5000);
        this.camera.position.z = 1400;
        this.scene = new THREE.Scene();
        this.geometry = new THREE.InstancedBufferGeometry();
        this.geometry.copy(new THREE.CircleBufferGeometry(1, 6));
        var particleCount = 20000;
        var translateArray = new Float32Array(particleCount * 3);
        for (var i = 0, i3 = 0, l = particleCount; i < l; i++, i3 += 3) {
            translateArray[i3 + 0] = Math.random() * 2 - 1;
            translateArray[i3 + 1] = Math.random() * 2 - 1;
            translateArray[i3 + 2] = Math.random() * 2 - 1;
        }
        this.geometry.addAttribute("translate", new THREE.InstancedBufferAttribute(translateArray, 3, 1));
        this.material = new THREE.RawShaderMaterial({
            uniforms: {
                map: { value: new THREE.TextureLoader().load("texture/circle.png") },
                time: { value: 0.0 }
            },
            vertexShader: document.getElementById('vshader').textContent,
            fragmentShader: document.getElementById('fshader').textContent,
            depthTest: true,
            depthWrite: true
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.scale.set(400, 400, 400);
        this.scene.add(this.mesh);
    };
    GPUParticle.prototype.endEnabled = function () {
        this.UPDATE = false;
    };
    GPUParticle.prototype.update = function () {
        this.timer += 0.01;
        //console.log(this.END);
        if (this.UPDATE == false) {
            //this.scene.remove(this.scene.children[0]);
            this.remove();
            if (this.scene.children.length == 0) {
                this.END = true;
            }
        }
        var time = performance.now() * 0.0005;
        this.material.uniforms.time.value = time;
        this.mesh.rotation.x = time * 0.2;
        this.mesh.rotation.y = time * 0.4;
        // this.camera.position.y = 100*Math.sin(this.timer);
        // this.camera.position.x = 100* Math.cos(this.timer);
        var rad = 600 + Math.sin(this.timer) * 200;
        this.camera.position.x = Math.sin(this.timer * 0.4) * Math.cos(this.timer * 0.3) * rad;
        this.camera.position.y = Math.cos(this.timer * 0.4) * rad;
        this.camera.position.z = Math.sin(this.timer * 0.4) * Math.sin(this.timer * 0.3) * rad; //+Math.sin(this.timer*0.5)*200;
        this.camera.lookAt(new THREE.Vector3(0, 0, 100 * Math.cos(this.timer * 0.005)));
    };
    return GPUParticle;
}());
//# sourceMappingURL=gpuParticle.js.map