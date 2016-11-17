/// <reference path="typings/index.d.ts" />
var offsetValueShader_frame = {
    shader: [
        '#define delta 10.0',
        'void main() {',
        '    // 正規化',
        '    vec2 uv = gl_FragCoord.xy / resolution.xy;',
        '    // offsetの取り出し',
        '    vec4 offsetV = texture2D( offsetValue, uv);',
        '    vec3 offset = offsetV.xyz;',
        '    // Dynamics',
        '    // ベクトルに速度を掛けて値を更新',
        '    gl_FragColor = vec4( offset, 1.0 );',
        '}'
    ].join("\n")
};
var computeShaderPosition_frame = {
    shader: [
        '#define delta ( 1.0 / 100.0 )',
        'uniform float alpha;',
        'uniform float offsetA_x;',
        'uniform float offsetA_y;',
        'uniform float offsetA_z;',
        'uniform float offsetB_x;',
        'uniform float offsetB_y;',
        'uniform float offsetB_z;',
        'uniform float offsetC_x;',
        'uniform float offsetC_y;',
        'uniform float offsetC_z;',
        'uniform float reset;',
        'uniform float time;',
        'float rnd(vec2 p){',
        '    return fract(sin(dot(p ,vec2(12.9898,78.233))) * 43758.5453);',
        '}',
        'void main() {',
        '    // 正規化',
        '    float nScale = 0.02;',
        '    vec2 uv = gl_FragCoord.xy / resolution.xy;',
        '    // テクスチャーから位置情報の取り出し',
        '    vec4 tmpPos = texture2D( texturePosition, uv );',
        '    float w = tmpPos.w;',
        '    vec3 pos = tmpPos.xyz;',
        '    // 移動するベクトルの取り出し',
        '    vec4 tmpVel = texture2D( textureVelocity, uv );',
        '    vec3 vel = tmpVel.xyz;',
        '    // 最初の位置',
        '    vec4 offsetV = texture2D( offsetValue, uv);',
        '    vec3 offset = offsetV.xyz;',
        '    //w -= 0.01;',
        '    pos += vel*time;',
        '    if(distance(pos.xyz,offsetV.xyz) > 600.0)',
        '    {',
        '        pos =offsetV.xyz;',
        '    }',
        '   if(reset == 1.0) {pos = offset;}',
        '    gl_FragColor = vec4( pos.xyz, w );',
        '}'
    ].join("\n")
};
var computeShaderVelocity_frame = {
    shader: [
        '#include <common>',
        '#define delta ( 1.0 / 200.0 )',
        'uniform float time;',
        'uniform float offsetX;',
        'uniform float offsetY;',
        'uniform float offsetZ;',
        'uniform float scale;',
        'uniform vec3 translate;',
        'uniform float reset;',
        'vec3 mod289(vec3 x) {',
        '    return x - floor(x * (1.0 / 289.0)) * 289.0;',
        '}',
        'vec4 mod289(vec4 x) {',
        '    return x - floor(x * (1.0 / 289.0)) * 289.0;',
        '}',
        'vec4 permute(vec4 x) {',
        '    return mod289(((x*34.0)+1.0)*x);',
        '}',
        'vec4 taylorInvSqrt(vec4 r)',
        '{',
        '    return 1.79284291400159 - 0.85373472095314 * r;',
        '}',
        'float snoise(vec3 v)',
        '{',
        '    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;',
        '    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);',
        '    // First corner',
        '    vec3 i  = floor(v + dot(v, C.yyy) );',
        '    vec3 x0 =   v - i + dot(i, C.xxx) ;',
        '    // Other corners',
        '    vec3 g = step(x0.yzx, x0.xyz);',
        '    vec3 l = 1.0 - g;',
        '    vec3 i1 = min( g.xyz, l.zxy );',
        '    vec3 i2 = max( g.xyz, l.zxy );',
        '    vec3 x1 = x0 - i1 + C.xxx;',
        '    vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y',
        '    vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y',
        '    // Permutations',
        '    i = mod289(i);',
        '    vec4 p = permute( permute( permute(',
        '                        i.z + vec4(0.0, i1.z, i2.z, 1.0 ))',
        '                + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))',
        '        + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));',
        '    // Gradients: 7x7 points over a square, mapped onto an octahedron.',
        '    // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)',
        '    float n_ = 0.142857142857; // 1.0/7.0',
        '    vec3  ns = n_ * D.wyz - D.xzx;',
        '    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)',
        '    vec4 x_ = floor(j * ns.z);',
        '    vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)',
        '    vec4 x = x_ *ns.x + ns.yyyy;',
        '    vec4 y = y_ *ns.x + ns.yyyy;',
        '    vec4 h = 1.0 - abs(x) - abs(y);',
        '    vec4 b0 = vec4( x.xy, y.xy );',
        '    vec4 b1 = vec4( x.zw, y.zw );',
        '    vec4 s0 = floor(b0)*2.0 + 1.0;',
        '    vec4 s1 = floor(b1)*2.0 + 1.0;',
        '    vec4 sh = -step(h, vec4(0.0));',
        '    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;',
        '    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;',
        '    vec3 p0 = vec3(a0.xy,h.x);',
        '    vec3 p1 = vec3(a0.zw,h.y);',
        '    vec3 p2 = vec3(a1.xy,h.z);',
        '    vec3 p3 = vec3(a1.zw,h.w);',
        '    //Normalise gradients',
        '    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));',
        '    p0 *= norm.x;',
        '    p1 *= norm.y;',
        '    p2 *= norm.z;',
        '    p3 *= norm.w;',
        '    // Mix final noise value',
        '    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);',
        '    m = m * m;',
        '    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),',
        '                    dot(p2,x2), dot(p3,x3) ) );',
        '}',
        '// ************* noise ************* //',
        'void main()	{',
        '    // 正規化',
        '    vec2 uv = gl_FragCoord.xy / resolution.xy;',
        '    float t = time;',
        '    // 位置情報の取り出し',
        '    vec4 tmpPos = texture2D( texturePosition, uv );',
        '    vec3 pos = tmpPos.xyz;',
        '    // ベクトルの取り出し',
        '    vec4 tmpVel = texture2D( textureVelocity, uv );',
        '    vec3 vel = tmpVel.xyz;',
        '    // 最初の位置',
        '    vec4 offsetV = texture2D( offsetValue, uv);',
        '    vec3 offset = offsetV.xyz;',
        '    float speed = 0.05;',
        '    float  scalex = time  * speed + 0.1365143;',
        '    float  scaley = time  * speed +   1.21688;',
        '    float  scalez = time  * speed +    1.5564;',
        '    float _scale = snoise(pos)*0.1;',
        '    //float _scale = 0.04;',
        '    vec3 n = normalize(translate) + normalize(pos);',
        '    //vec3 n = normalize(translate)+*normalize(pos);',
        '    vel.x=snoise(vec3(pos.x*scale, pos.y*scale,time*scalex+offsetX));',
        '    vel.y=snoise(vec3(pos.x*scale, pos.y*scale,time*scaley+offsetY));',
        '    vel.z=snoise(vec3(pos.x*scale, pos.y*scale,time*scalez+offsetZ));',
        '    vel += n*1.0; //vel.x += normalize(translate).x;',
        '    vel.z +=1.0; float addZ = 0.5;',
        '    // ノイズの値を位置情報から生成',
        '    if(reset == 1.0){vel = vec3(0.0,0.0,0.0); addZ = 0.0;}',
        '    gl_FragColor = vec4( vec3(vel.x,vel.y,vel.z+addZ), 1.0 );',
        '}',
    ].join('\n')
};
var particleShader_frame = {
    vertexShader: [
        '// For PI declaration:',
        '#include <common>',
        'uniform sampler2D texturePosition;',
        'uniform sampler2D textureVelocity;',
        'uniform float cameraConstant;',
        'uniform float density;',
        'varying vec2 vUv;',
        'uniform float radius;',
        'void main() {',
        '    // 位置情報の取り出し',
        '    vec4 posTemp = texture2D( texturePosition, uv );',
        '    vec3 pos = posTemp.xyz;',
        '    vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );',
        '    gl_PointSize = 0.5 * cameraConstant / ( - mvPosition.z );',
        '    vUv = uv;',
        '    gl_Position = projectionMatrix * mvPosition;',
        '}',
    ].join('\n'),
    fragmentShader: [
        'varying vec4 vColor;',
        'uniform sampler2D texture;',
        'varying vec2 vUv;',
        'uniform float alpha;',
        'uniform vec3 color;',
        'vec3 HUEtoRGB(float H){',
        '    H = mod(H,1.0);',
        '    float R = abs(H * 6.0 - 3.0) - 1.0;',
        '    float G = 2.0 - abs(H * 6.0 - 2.0);',
        '    float B = 2.0 - abs(H * 6.0 - 4.0);',
        '    return clamp(vec3(R,G,B),0.0,1.0);',
        '}',
        'vec3 HSLtoRGB(vec3 HSL){',
        '    vec3 RGB = HUEtoRGB(HSL.x);',
        '    float C = (1.0 - abs(2.0 * HSL.z - 1.0)) * HSL.y;',
        '    return (RGB - 0.5) * C + HSL.z;',
        '}',
        'void main() {',
        '    float size = 0.5;',
        '    //vec4 diffuseColor = texture2D( map, vUv );',
        '    float f = length( gl_PointCoord - vec2( size, size ) );',
        '    if ( f > size ) {',
        '        discard;',
        '    }',
        '     //vec3 _color = texture2D( texture, vUv ).rgb;',
        '   //gl_FragColor = vec4( _color, 1.0 );',
        '    gl_FragColor =vec4(color.xyz,1.0);',
        '}',
    ].join('\n')
};
var GPGPUParticle_frame = (function () {
    function GPGPUParticle_frame(scene, camera, renderer, width, height, position, color) {
        this.PARTICLE_NUM = 400;
        this.time = 0.0;
        this.radian = 0.0;
        this.WIDTH = width;
        this.HEIGHT = height;
        this.PARTICLES = this.PARTICLE_NUM * this.PARTICLE_NUM;
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.color = color;
        this.group = new THREE.Group();
        this.group.position.set(position.x, position.y, position.z);
        this.position = this.group.position;
        this.rotation = this.group.rotation;
        this.initComputeRenderer();
        this.initPosition();
        this.createBox();
        this.boxRemove = false;
    }
    GPGPUParticle_frame.prototype.createBox = function () {
        this.boxGeomery = new THREE.BoxGeometry(this.WIDTH, this.HEIGHT, 10, 1, 1);
        // var color = new THREE.Color(0xBF53F8);
        this.boxMaterial = new THREE.MeshLambertMaterial({
            color: this.color.getHex(),
            wireframe: false,
            transparent: true,
            opacity: 1.0
        });
        this.boxMesh = new THREE.Mesh(this.boxGeomery, this.boxMaterial);
        this.group.add(this.boxMesh);
        // this.scene.add(this.boxMesh);
    };
    GPGPUParticle_frame.prototype.initComputeRenderer = function () {
        // 画面サイズだけGPU Rendererを生成
        this.gpuCompute = new GPUComputationRenderer(this.WIDTH, this.WIDTH, this.renderer);
        // 位置情報用のテクスチャ
        var dtPosition = this.gpuCompute.createTexture();
        // パーティクルごとの移動方向を保存するテクスチャ
        var dtVelocity = this.gpuCompute.createTexture();
        // noiseに使うoffset
        var dtOffset = this.gpuCompute.createTexture();
        // おまじない
        this.fillTextures(dtPosition, dtVelocity, dtOffset);
        // shader Programの登録
        this.velocityVariable = this.gpuCompute.addVariable("textureVelocity", computeShaderVelocity_frame.shader, dtVelocity);
        this.positionVariable = this.gpuCompute.addVariable("texturePosition", computeShaderPosition_frame.shader, dtPosition);
        this.offsetVariable = this.gpuCompute.addVariable("offsetValue", offsetValueShader_frame.shader, dtOffset);
        this.gpuCompute.setVariableDependencies(this.velocityVariable, [this.positionVariable, this.velocityVariable, this.offsetVariable]);
        this.gpuCompute.setVariableDependencies(this.positionVariable, [this.positionVariable, this.velocityVariable, this.offsetVariable]);
        this.gpuCompute.setVariableDependencies(this.offsetVariable, [this.positionVariable, this.velocityVariable, this.offsetVariable]);
        // uniform変数の登録？
        this.velocityUniforms = this.velocityVariable.material.uniforms;
        this.offsetUniforms = this.offsetVariable.material.uniforms;
        this.positionUniforms = this.positionVariable.material.uniforms;
        this.velocityUniforms.time = { value: 1.0 };
        this.velocityUniforms.reset = { value: 0.0 };
        this.positionUniforms.alpha = { value: 1.0 };
        this.positionUniforms.time = { value: 0.0 };
        this.positionUniforms.reset = { value: 0.0 };
        var seed = 0.1;
        this.velocityUniforms.offseX = { value: Math.random() * seed };
        this.velocityUniforms.offseY = { value: Math.random() * seed };
        this.velocityUniforms.offseZ = { value: Math.random() * seed };
        this.velocityUniforms.scale = { value: (0.01 + Math.random() * 0.01 - 0.005) };
        this.velocityUniforms.translate = { value: this.position };
        var error = this.gpuCompute.init();
        if (error !== null) {
            console.error(error);
        }
    };
    GPGPUParticle_frame.prototype.initPosition = function () {
        // particleの初期位置を決める
        this.geometry = new THREE.BufferGeometry();
        var positions = new Float32Array(this.PARTICLES * 3);
        var p = 0;
        // 一旦0でうめる。texturePositionの値を参照するためとりあえず埋めれば良い。
        for (var i = 0; i < this.PARTICLES; i++) {
            // x
            positions[p++] = 0;
            // y
            positions[p++] = 0;
            // z
            positions[p++] = 0;
        }
        // テクスチャーに保存した情報を取り出すためにvec2(x,y)座標を記録
        var uvs = new Float32Array(this.PARTICLES * 2);
        p = 0;
        for (var j = 0; j < this.WIDTH; j++) {
            for (var i = 0; i < this.WIDTH; i++) {
                uvs[p++] = i / (this.WIDTH - 1);
                uvs[p++] = j / (this.WIDTH - 1);
            }
        }
        // vertex-shaderに登録
        this.geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
        this.geometry.addAttribute('uv', new THREE.BufferAttribute(uvs, 2));
        var colorVec = new THREE.Vector3(this.color.r, this.color.g, this.color.b);
        // particleの位置と移動方向を収めるuinform変数の初期化
        this.particleUniforms = {
            map: { value: new THREE.TextureLoader().load("./textures/circle.png") },
            texturePosition: { value: null },
            textureVelocity: { value: null },
            alpha: { value: 1.0 },
            color: { value: colorVec },
            cameraConstant: { value: this.getCameraConstant(this.camera) },
            texture: { value: new THREE.TextureLoader().load("textures/sea02.jpg") }
        };
        // ShaderMaterial の設定
        var material = new THREE.ShaderMaterial({
            uniforms: this.particleUniforms,
            vertexShader: particleShader_frame.vertexShader,
            fragmentShader: particleShader_frame.fragmentShader,
            transparent: true
        });
        // おまじない
        material.extensions.drawBuffers = true;
        // Points オブジェクトを生成
        this.particle = new THREE.Points(this.geometry, material);
        this.particle.matrixAutoUpdate = false;
        this.particle.updateMatrix();
        this.particle.frustumCulled = false;
        // シーンに追加
        // particles.position.set(50,5,0);
        this.group.add(this.particle);
        // group.translateX(this.position.x);
        // group.translateY(this.position.y);
        // group.translateZ(this.position.z);
        //particles.position.set(this.position.x,this.position.y,this.position.z);
        this.scene.add(this.group);
    };
    GPGPUParticle_frame.prototype.fillTextures = function (texturePosition, textureVelocity, offsetValue) {
        // 場所と移動方向を保存するテクスチャーの初期化
        var posArray = texturePosition.image.data;
        var velArray = textureVelocity.image.data;
        var offsetArray = offsetValue.image.data;
        for (var k = 0, kl = posArray.length; k < kl; k += 4) {
            // Position
            var x, y, z;
            var width = this.WIDTH;
            var height = this.HEIGHT;
            x = Math.random() * width - width / 2;
            //z = Math.random()*width-width/2;
            z = 0.0;
            y = Math.random() * height - height / 2;
            // Fill in texture values
            posArray[k + 0] = x;
            posArray[k + 1] = y;
            posArray[k + 2] = z;
            posArray[k + 3] = 1.0;
            velArray[k + 0] = Math.random() * 0.2 - 0.1;
            velArray[k + 1] = Math.random() * 0.2 - 0.1;
            velArray[k + 2] = Math.random() * 0.2 - 0.1;
            velArray[k + 3] = Math.random() * 0.2 - 0.1;
            offsetArray[k + 0] = x;
            offsetArray[k + 1] = y;
            offsetArray[k + 2] = z;
            offsetArray[k + 3] = 0;
        }
    };
    GPGPUParticle_frame.prototype.getCameraConstant = function (camera) {
        // カメラ情報を計算。
        return window.innerHeight / (Math.tan(THREE.Math.DEG2RAD * 0.5 * camera.fov * 0.6) / camera.zoom);
    };
    GPGPUParticle_frame.prototype.resize = function () {
        this.particleUniforms.cameraConstant.value = this.getCameraConstant(this.camera);
    };
    GPGPUParticle_frame.prototype.setPosition = function (pos) {
        this.group.position.set(pos.x, pos.y, pos.z);
    };
    GPGPUParticle_frame.prototype.enableUpdate = function () {
        this.startUpdate = true;
    };
    GPGPUParticle_frame.prototype.initUpdate = function () {
        this.time = 0.0;
        this.positionUniforms.reset.value = 1.0;
        this.velocityUniforms.reset.value = 1.0;
        this.boxMaterial.opacity = 1.0;
        this.boxMesh.material.color.set(0.05, 0.05, 0.05);
        // this.startUpdate = false;
        // this.particleUniforms.alpha.value = 0.0;
        this.velocityUniforms.time.value = 0.0;
        this.positionUniforms.time.value = 0.0;
    };
    GPGPUParticle_frame.prototype.getTime = function () {
        return this.positionUniforms.time.value = Math.abs(Math.sin(this.time));
    };
    GPGPUParticle_frame.prototype.update = function (time) {
        if (this.startUpdate) {
            this.time += 0.01;
            var speed = 0.0;
            if (Math.sin(this.time) < 0.0) {
                speed = 0.1;
            }
            else {
                speed = 1.0;
            }
            if (this.particleUniforms.alpha.value >= 0.0) {
                console.log('update');
                // gpuComputeをアップデート
                this.gpuCompute.compute();
                // 前のフレームの情報でパーティクルの位置情報を上書き
                this.particleUniforms.texturePosition.value = this.gpuCompute.getCurrentRenderTarget(this.positionVariable).texture;
                // 前のフレームの情報でパーティクルの移動方向情報を上書き
                this.particleUniforms.textureVelocity.value = this.gpuCompute.getCurrentRenderTarget(this.velocityVariable).texture;
                this.positionUniforms.alpha.value = this.particleUniforms.alpha.value;
                if (this.positionUniforms.reset.value == 1.0) {
                    this.positionUniforms.reset.value = 0.0;
                }
                if (time != undefined) {
                    speed = time;
                }
                this.velocityUniforms.time.value = Math.abs(speed);
                this.positionUniforms.time.value = Math.abs(speed);
            }
            else {
            }
            if (this.boxMaterial.opacity > 0.0) {
                this.boxMesh.material.opacity = 0.3;
                this.boxMesh.material.color.setHex(0xffffff);
            }
        }
        if (this.positionUniforms.reset.value == 1.0) {
            this.positionUniforms.reset.value == 0.0;
            this.velocityUniforms.reset.value == 0.0;
            this.particleUniforms.alpha.value = 0.0;
        }
    };
    return GPGPUParticle_frame;
}());
// ************************ main scene ************************ //
var Frame = (function () {
    function Frame(renderer) {
        this.UPDATE = true;
        this.END = false;
        this.particles = [];
        this.boxs = [];
        this.isUpdate = false;
        this.time_scene01 = 0.0;
        this.time_scene02 = 0.0;
        this.frame_boxs = [];
        this.speed = 0.0;
        this.scene01Update = false;
        this.scene02Update = false;
        this.clickCount = 0;
        this.renderer = renderer;
        this.createScene();
    }
    Frame.prototype.createScene = function () {
        this.radian = { value: 0.0 };
        this.scene = new THREE.Scene();
        // this.scene.fog = new THREE.Fog(0x000000,-500,3000);
        this.scene.add(new THREE.AmbientLight(0xffffff, 0.8));
        this.renderer.setClearColor(0xffffff, 1.0);
        this.scene01FramePositions = {
            now: [
                new THREE.Vector3(-200, -500, 3),
                new THREE.Vector3(0, 500, 3),
                new THREE.Vector3(200, -500, 3)
            ],
            next: [
                new THREE.Vector3(-200, 0, 3),
                new THREE.Vector3(0, 0, 3),
                new THREE.Vector3(200, 0, 3)
            ]
        };
        var xRotateRange = Math.PI / 2;
        this.rotattion = {
            now: [
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(0, 0, 0)
            ],
            next: [
                new THREE.Vector3(Math.random() * Math.PI / 2 * -Math.PI / 4, Math.random() * Math.PI * -0.5, Math.random() * Math.PI / 2 * -Math.PI / 4),
                new THREE.Vector3(Math.random() * Math.PI / 2 * -Math.PI / 4, Math.random() * Math.PI / 2 - Math.PI / 4, Math.random() * Math.PI / 2 * -Math.PI / 4),
                new THREE.Vector3(Math.random() * Math.PI / 2 * -Math.PI / 4, Math.random() * Math.PI * 0.5, Math.random() * Math.PI / 2 * -Math.PI / 4)
            ]
        };
        this.scene01FrameVector =
            [
                new THREE.Vector3(-0.5, 0, 0.0),
                new THREE.Vector3(0.0, 0, 0.0),
                new THREE.Vector3(0.5, 0, 0.0)
            ];
        this.scene01CameraRotation = new THREE.Vector3(Math.random() * Math.PI - Math.PI / 2, Math.random() * Math.PI - Math.PI / 2, -Math.random() * Math.PI / 2).normalize();
        this.scene01Speed =
            {
                now: 5.0,
                slow: 0.01
            };
        // カメラを作成
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
        this.camera.position.z = 500;
        var textureLoader = new THREE.TextureLoader();
        var image = textureLoader.load("textures/frame.jpg");
        var scale = 0.7;
        var geomery = new THREE.PlaneGeometry(1000, 800, 21, 21);
        var material = new THREE.MeshPhongMaterial({
            map: image
        });
        var mesh = new THREE.Mesh(geomery, material);
        // this.scene.add(mesh);
        var wirematerial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            wireframe: true
        });
        var frameA = new THREE.PlaneGeometry(2.5, 3.3, 2, 2);
        var blackMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000
        });
        var frameAMesh = new THREE.Mesh(frameA, blackMaterial);
        frameAMesh.position.x -= 3;
        frameAMesh.position.y = 1.3;
        var particleposition = new THREE.Vector3(-200, 0, 3);
        var wireposition = new THREE.Vector3(-200, 0, 0);
        var color = new THREE.Color(0.05, 0.05, 0.05);
        this.particles.push(new GPGPUParticle_frame(this.scene, this.camera, this.renderer, 140, 210, particleposition, color));
        this.boxs.push(new WierBox(this.scene, 140, 2, 210, wireposition, color, false));
        var particlepositionCenter = new THREE.Vector3(0, 0, 3);
        var wirepositionCenter = new THREE.Vector3(0, 0, 3);
        this.boxs.push(new WierBox(this.scene, 140, 2, 210, wirepositionCenter, color, false));
        this.particles.push(new GPGPUParticle_frame(this.scene, this.camera, this.renderer, 140, 210, particlepositionCenter, color));
        var particlepositionRight = new THREE.Vector3(200, 0, 3);
        var wirepositionRight = new THREE.Vector3(200, 0, 3);
        this.boxs.push(new WierBox(this.scene, 140, 2, 210, wirepositionRight, color, false));
        this.particles.push(new GPGPUParticle_frame(this.scene, this.camera, this.renderer, 140, 210, particlepositionRight, color));
        // if(!this.scene01 && this.scene02)
        // {
        //
        // }
        for (var i = 0; i < this.boxs.length; i++) {
            var x = this.scene01FramePositions.now[i].x;
            var y = this.scene01FramePositions.now[i].y;
            var z = this.scene01FramePositions.now[i].z;
            this.boxs[i].position.set(x, y, z);
            this.particles[i].setPosition(this.scene01FramePositions.now[i]);
        }
    };
    Frame.prototype.initPosition = function () {
        this.scene01FramePositions = {
            now: [
                new THREE.Vector3(-200, -500, 3),
                new THREE.Vector3(0, 500, 3),
                new THREE.Vector3(200, -500, 3)
            ],
            next: [
                new THREE.Vector3(-200, 0, 3),
                new THREE.Vector3(0, 0, 3),
                new THREE.Vector3(200, 0, 3)
            ]
        };
        var xRotateRange = Math.PI / 2;
        this.rotattion = {
            now: [
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(0, 0, 0)
            ],
            next: [
                new THREE.Vector3(Math.random() * Math.PI / 2 * -Math.PI / 4, -Math.random() * Math.PI, Math.random() * Math.PI / 2 * -Math.PI / 4),
                new THREE.Vector3(Math.random() * Math.PI / 2 * -Math.PI / 4, Math.random() * Math.PI * 2 - Math.PI / 2, Math.random() * Math.PI / 2 * -Math.PI / 4),
                new THREE.Vector3(Math.random() * Math.PI / 2 * -Math.PI / 4, Math.random() * Math.PI, Math.random() * Math.PI / 2 * -Math.PI / 4)
            ]
        };
        this.scene01FrameVector =
            [
                new THREE.Vector3(-0.5, 0, 0.0),
                new THREE.Vector3(0.0, 0, 0.0),
                new THREE.Vector3(0.5, 0, 0.0)
            ];
        this.scene01CameraRotation = new THREE.Vector3(Math.random() * Math.PI - Math.PI / 2, Math.random() * Math.PI - Math.PI / 2, -Math.random() * Math.PI / 2).normalize();
        this.scene01Speed =
            {
                now: 3.0,
                slow: 0.1
            };
        for (var i = 0; i < this.boxs.length; i++) {
            var x = this.scene01FramePositions.now[i].x;
            var y = this.scene01FramePositions.now[i].y;
            var z = this.scene01FramePositions.now[i].z;
            this.boxs[i].position.set(x, y, z);
            this.particles[i].setPosition(this.scene01FramePositions.now[i]);
            this.particles[i].rotation.set(0, 0, 0);
            this.boxs[i].rotation.set(0, 0, 0);
            this.particles[i].initUpdate();
        }
        this.time_scene02 = 0.0;
    };
    Frame.prototype.update = function () {
        if (this.scene01Update) {
            this.time_scene01 += 0.03;
            this.scene01Speed.now += (this.scene01Speed.slow - this.scene01Speed.now) * 0.1;
            for (var i = 0; i < this.boxs.length; i++) {
                if (this.scene01FramePositions.now[i].distanceTo(this.scene01FramePositions.next[i]) > 0.4) {
                    var framePos = this.boxs[i].position;
                    var speed = 0.1;
                    var next = this.scene01FramePositions.next[i];
                    var now = this.scene01FramePositions.now[i];
                    // console.log(now);
                    now.x += (next.x - now.x) * speed;
                    now.y += (next.y - now.y) * speed;
                    now.z += (next.z - now.z) * speed;
                    var x = now.x;
                    var y = now.y;
                    var z = now.z;
                    this.boxs[i].position.set(x, y, z);
                    this.particles[i].setPosition(now);
                }
                else {
                    var next = this.rotattion.next[i];
                    var now = this.rotattion.now[i];
                    var speed = 0.25;
                    // console.log(now);
                    now.x += (next.x - now.x) * speed;
                    now.y += (next.y - now.y) * speed;
                    now.z += (next.z - now.z) * speed;
                    var x = now.x;
                    var y = now.y;
                    var z = now.z;
                    this.boxs[i].rotation.set(x, y, z);
                    this.particles[i].rotation.set(x, y, z);
                    // console.log(this.scene01Speed.now);
                    var pos = new THREE.Vector3(x, y, z).normalize();
                    this.scene01FrameVector[i].multiplyScalar(this.scene01Speed.now);
                    this.boxs[i].position.add(this.scene01FrameVector[i]);
                    this.particles[i].position.add(this.scene01FrameVector[i]);
                    this.particles[i].enableUpdate();
                    this.particles[i].update(this.scene01Speed.now * 20);
                    this.camera.position.x = 500 * Math.cos(this.time_scene01 * 0.1 + Math.PI / 2);
                    this.camera.position.y = 200 * Math.sin(this.time_scene01 * 0.1);
                    var z = 700 * Math.sin(this.time_scene01 * 0.1 + Math.PI / 2);
                    this.camera.position.z += (z - this.camera.position.z) * 0.01;
                    this.camera.position.add(this.scene01CameraRotation.multiplyScalar(this.scene01Speed.now * 0.4));
                    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
                }
            }
            if (this.scene01Speed.now < 0.015) {
                // this.initPosition();
                // this.scene01Update = false;
                // this.clickCount = 0;
                // for(var i = 0; i < this.boxs.length; i++)
                // {
                //     console.log(this.boxs[i].position);
                //     console.log(this.particles[i].position);
                // }
                this.time_scene01 += 0.001;
                // this.camera.position.x = x;
                // this.camera.position.z = z;
                this.camera.position.add(this.scene01CameraRotation.multiplyScalar(this.scene01Speed.now));
            }
        }
        if (this.scene02Update) {
            this.time_scene02 += 0.01;
            if (Math.sin(this.time_scene02) < 0.0) {
                this.speed += (0.001 - this.speed) * 0.1;
            }
            else {
                this.speed += (0.015 - this.speed) * 0.1;
            }
            this.radian.value += this.speed;
            for (var i = 0; i < this.particles.length; i++) {
                this.particles[i].update();
                // if(Math.abs(this.particles[i].position.y) > 200 )
                {
                    if (i == 1) {
                        this.particles[i].position.y += (-200 - this.particles[i].position.y) * 0.01;
                        this.boxs[i].position.y = this.particles[i].position.y;
                    }
                    else {
                        this.particles[i].position.y += (200 - this.particles[i].position.y) * 0.01;
                        this.boxs[i].position.y = this.particles[i].position.y;
                    }
                    this.scene01FramePositions.now[i].set(this.boxs[i].position.x, this.boxs[i].position.y, this.boxs[i].position.z);
                    this.time_scene01 = this.time_scene02;
                }
                //var radian = Math.abs(Math.sin(this.time_scene01));
                var x = 500 * Math.cos(this.radian.value + Math.PI / 2);
                var z = 500 * Math.sin(this.radian.value + Math.PI / 2);
                this.camera.position.set(x, 0, z);
                this.camera.lookAt(new THREE.Vector3(0, 0, 0));
            }
            //console.log(this.END);
            if (this.UPDATE == false) {
                //this.scene.remove(this.scene.children[0]);
                this.remove();
                if (this.scene.children.length == 0) {
                    this.END = true;
                }
            }
        }
    };
    Frame.prototype.click = function () {
        if (this.clickCount == 1) {
            this.scene01Update = true;
            this.scene02Update = false;
        }
        if (this.clickCount == 0) {
            this.scene01Update = false;
            this.scene02Update = true;
            for (var i = 0; i < this.particles.length; i++) {
                this.particles[i].enableUpdate();
            }
        }
        if (this.clickCount == 5) {
            this.remove();
        }
        this.clickCount++;
    };
    Frame.prototype.initOrbitControls = function () {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableKeys = false;
    };
    Frame.prototype.keyDown = function (keyCode) {
        // console.log(keyCode);
        switch (keyCode) {
            case 190:
                this.scene01Update = false;
                this.scene02Update = true;
                break;
            case 82:
                this.remove();
                break;
        }
    };
    Frame.prototype.remove = function () {
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
    Frame.prototype.endEnabled = function () {
        this.UPDATE = false;
    };
    return Frame;
}());
//# sourceMappingURL=frame.js.map