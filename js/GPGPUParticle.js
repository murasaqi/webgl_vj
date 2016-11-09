/// <reference path="typings/index.d.ts" />
var GPGPUParticle = (function () {
    function GPGPUParticle(renderer) {
        this.UPDATE = true;
        this.END = false;
        this.offsetValueShader = {
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
        this.computeShaderPosition = {
            shader: [
                '#define delta ( 1.0 / 100.0 )',
                'uniform float offsetA_x;',
                'uniform float offsetA_y;',
                'uniform float offsetA_z;',
                'uniform float offsetB_x;',
                'uniform float offsetB_y;',
                'uniform float offsetB_z;',
                'uniform float offsetC_x;',
                'uniform float offsetC_y;',
                'uniform float offsetC_z;',
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
                '    w -= 0.01;',
                '    pos += vel;',
                '    if(w < 0.0)',
                '    {',
                '        pos = offset;',
                '        w = 1.0;',
                '    }',
                '    if(distance(pos.xyz,offsetV.xyz) > 200.0)',
                '    {',
                '        //w = 0.0;',
                '        //pos =　offsetV.xyz;',
                '        //pos.x = rnd(offset.xy)*100.0-50.0;',
                '        //pos.y = rnd(offset.yz)*100.0-50.0;',
                '        //pos.z = rnd(offset.zx)*100.0-50.0;',
                '    }',
                '    gl_FragColor = vec4( pos.xyz, w );',
                '}'
            ].join("\n")
        };
        this.computeShaderVelocity = {
            shader: [
                '#include <common>',
                '#define delta ( 1.0 / 60.0 )',
                'uniform float time;',
                'uniform float offsetX;',
                'uniform float offsetY;',
                'uniform float offsetZ;',
                'uniform float scale;',
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
                '    float  scalez = time  * speed +    2.5564;',
                '    float _scale = snoise(pos)*0.1;',
                '    //float _scale = 0.04;',
                '    vec3 n = normalize(pos);',
                '    vel.x=snoise(vec3(pos.x*scale, pos.y*scale,time*scalex+offsetX))+n.x;',
                '    vel.z=snoise(vec3(pos.x*scale, pos.y*scale,time*scalez+offsetY))+n.z;',
                '    vel.y=snoise(vec3(pos.x*scale, pos.y*scale,time*scaley+offsetZ));',
                '    vel.y = 1.0+n.y;',
                '    vel *= 3.0;',
                '    // ノイズの値を位置情報から生成',
                '    gl_FragColor = vec4( vec3(vel.x,vel.y,vel.z), 1.0 );',
                '}',
            ].join('\n')
        };
        this.particleShader =
            {
                vertexShader: [
                    '// For PI declaration:',
                    '#include <common>',
                    'uniform sampler2D texturePosition;',
                    'uniform sampler2D textureVelocity;',
                    'uniform float cameraConstant;',
                    'uniform float density;',
                    'varying vec4 vColor;',
                    'varying vec2 vUv;',
                    'varying float alpha;',
                    'uniform float radius;',
                    'void main() {',
                    '    // 位置情報の取り出し',
                    '    vec4 posTemp = texture2D( texturePosition, uv );',
                    '    alpha = posTemp.w;',
                    '    vec3 pos = posTemp.xyz;',
                    '    // 色の決定',
                    '    vColor = vec4( 1.0, 0.7, 1.0, 1.0 );',
                    '    vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );',
                    '    gl_PointSize = 0.5 * cameraConstant / ( - mvPosition.z );',
                    '    vUv = uv;',
                    '    //gl_PointSize = 2.0',
                    '    gl_Position = projectionMatrix * mvPosition;',
                    '}',
                ].join('\n'),
                fragmentShader: [
                    'varying vec4 vColor;',
                    'uniform sampler2D map;',
                    'varying vec2 vUv;',
                    'varying float alpha;',
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
                    '    float f = length( gl_PointCoord - vec2( size, size ) );',
                    '    if ( f > size ) {',
                    '        discard;',
                    '    }',
                    '    gl_FragColor = vec4(vColor.xyz,alpha);',
                    '}',
                ].join('\n')
            };
        this.renderer = renderer;
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 5, 15000);
        this.camera.position.y = 120;
        this.camera.position.z = 400;
        this.scene = new THREE.Scene();
        this.createParticle();
    }
    GPGPUParticle.prototype.createParticle = function () {
        this.effectController = {
            time: 0.0
        };
        this.WIDTH = 100;
        this.PARTICLES = this.WIDTH * this.WIDTH;
        this.initComputeRenderer();
        this.initPosition();
    };
    GPGPUParticle.prototype.initComputeRenderer = function () {
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
        this.velocityVariable = this.gpuCompute.addVariable("textureVelocity", this.computeShaderVelocity.shader, dtVelocity);
        this.positionVariable = this.gpuCompute.addVariable("texturePosition", this.computeShaderPosition.shader, dtPosition);
        this.offsetVariable = this.gpuCompute.addVariable("offsetValue", this.offsetValueShader.shader, dtOffset);
        this.gpuCompute.setVariableDependencies(this.velocityVariable, [this.positionVariable, this.velocityVariable, this.offsetVariable]);
        this.gpuCompute.setVariableDependencies(this.positionVariable, [this.positionVariable, this.velocityVariable, this.offsetVariable]);
        this.gpuCompute.setVariableDependencies(this.offsetVariable, [this.positionVariable, this.velocityVariable, this.offsetVariable]);
        // uniform変数の登録？
        this.positionUniforms = this.positionVariable.material.uniforms;
        this.velocityUniforms = this.velocityVariable.material.uniforms;
        this.offsetUniforms = this.offsetVariable.material.uniforms;
        this.velocityUniforms.time = { value: 1.0 };
        var seed = 0.1;
        this.positionUniforms.time = { value: 0.0 };
        this.velocityUniforms.offseX = { value: Math.random() * seed };
        this.velocityUniforms.offseY = { value: Math.random() * seed };
        this.velocityUniforms.offseZ = { value: Math.random() * seed };
        this.velocityUniforms.scale = { value: (Math.random() * 0.02) };
        // var error = this.gpuCompute.init();
        // if ( error !== null ) {
        //     console.error( error );
        // }
    };
    GPGPUParticle.prototype.initPosition = function () {
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
        // particleの位置と移動方向を収めるuinform変数の初期化
        this.particleUniforms = {
            map: { value: new THREE.TextureLoader().load("./textures/circle.png") },
            texturePosition: { value: null },
            textureVelocity: { value: null },
            cameraConstant: { value: this.getCameraConstant(this.camera) }
        };
        // ShaderMaterial の設定
        var material = new THREE.ShaderMaterial({
            uniforms: this.particleUniforms,
            vertexShader: this.particleShader.vertexShader,
            fragmentShader: this.particleShader.fragmentShader,
            transparent: true
        });
        // おまじない
        material.extensions.drawBuffers = true;
        // Points オブジェクトを生成
        var particles = new THREE.Points(this.geometry, material);
        particles.matrixAutoUpdate = false;
        particles.updateMatrix();
        // シーンに追加
        this.scene.add(particles);
    };
    GPGPUParticle.prototype.fillTextures = function (dtPosition, dtVelocity, dtOffset) {
        // 場所と移動方向を保存するテクスチャーの初期化
        var posArray = dtPosition.image.data;
        var velArray = dtVelocity.image.data;
        var offsetArray = dtOffset.image.data;
        var phi = 0;
        var theta = 0;
        var xoff = 0;
        var yoff = 0;
        var zoff = 0;
        for (var k = 0, kl = posArray.length; k < kl; k += 4) {
            // Position
            var x, y, z;
            phi = Math.random() * Math.PI * 2;
            theta = Math.random() * Math.PI * 2;
            var width = 50;
            x = Math.random() * width - width / 2;
            z = Math.random() * width - width / 2;
            y = Math.random() * width - width / 2;
            // Fill in texture values
            posArray[k + 0] = x;
            posArray[k + 1] = y;
            posArray[k + 2] = z;
            posArray[k + 3] = 1.0;
            velArray[k + 0] = Math.random() * 0.2 - 0.1;
            velArray[k + 1] = Math.random() * 0.2 - 0.1;
            velArray[k + 2] = Math.random() * 0.2 - 0.1;
            velArray[k + 3] = Math.random() * 0.2 - 0.1;
            // x
            xoff += 0.1;
            offsetArray[k + 0] = x;
            // y
            yoff += 0.2;
            offsetArray[k + 1] = y;
            // z
            zoff += 0.15;
            offsetArray[k + 2] = z;
            offsetArray[k + 3] = 0;
        }
    };
    GPGPUParticle.prototype.getCameraConstant = function () {
        // カメラ情報を計算。
        return window.innerHeight / (Math.tan(THREE.Math.DEG2RAD * 0.5 * 75) / this.camera.zoom);
    };
    GPGPUParticle.prototype.resize = function () {
        this.particleUniforms.cameraConstant.value = this.getCameraConstant();
    };
    GPGPUParticle.prototype.remove = function () {
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
    GPGPUParticle.prototype.endEnabled = function () {
        this.UPDATE = false;
    };
    GPGPUParticle.prototype.update = function () {
        //console.log(this.END);
        if (this.UPDATE == false) {
            //this.scene.remove(this.scene.children[0]);
            this.remove();
            if (this.scene.children.length == 0) {
                this.END = true;
            }
        }
    };
    return GPGPUParticle;
}());
//# sourceMappingURL=GPGPUParticle.js.map