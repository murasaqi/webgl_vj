


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
        '        //w = 0.0;',
        '        pos =offsetV.xyz;',
        '        //pos.x = rnd(offset.xy)*100.0-50.0;',
        '        //pos.y = rnd(offset.yz)*100.0-50.0;',
        '        //pos.z = rnd(offset.zx)*100.0-50.0;',
        '    }',
        '    gl_FragColor = vec4( pos.xyz, w );',
        '}'
    ].join("\n")
};

var computeShaderVelocity_frame = {
    shader:
        [
            '#include <common>',
            '#define delta ( 1.0 / 200.0 )',
            'uniform float time;',
            'uniform float offsetX;',
            'uniform float offsetY;',
            'uniform float offsetZ;',
            'uniform float scale;',
            'uniform vec3 translate;',
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
            '    vec3 n = normalize(translate)+normalize(pos);',
            '    vel.x=snoise(vec3(pos.x*scale, pos.y*scale,time*scalex+offsetX));',
            '    vel.y=snoise(vec3(pos.x*scale, pos.y*scale,time*scaley+offsetY));',
            '    vel.z=snoise(vec3(pos.x*scale, pos.y*scale,time*scalez+offsetZ));',
            '    vel += n*1.0;',
            '    vel.z +=0.3;',
            '    // ノイズの値を位置情報から生成',
            '    gl_FragColor = vec4( vec3(vel.x,vel.y,vel.z), 1.0 );',
            '}',


        ].join('\n')
};

var particleShader_frame =
{
    vertexShader :
        [
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
    fragmentShader :
        [
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


class GPGPUParticle_frame {

    private WIDTH:number;
    private geometry:any;
    private PARTICLES:number;



    private gpuCompute:any;
    private velocityVariable:any;
    private positionVariable:any;
    private offsetVariable:any;
    private velocityUniforms:any;
    private positionUniforms:any;
    private offsetUniforms:any;
    private particleUniforms:any;

    private scene:THREE.Scene;
    private camera:THREE.Camera;
    private renderer:THREE.Renderer;
    private position:any;
    private boxWidth:number;
    public startUpdate:boolean;
    private particle:any;

    private boxMaterial:THREE.Material;
    private boxGeomery:THREE.Geometry;
    private boxMesh:THREE.Mesh;
    private color:THREE.Color;
    private boxRemove:boolean;
    private PARTICLE_NUM:number = 400;
    private group:THREE.Group;

    private time:number = 0.0;

    private HEIGHT:any;

    constructor(scene, camera, renderer,width,height,position,color)
    {

        this.WIDTH = width;
        this.HEIGHT = height;
        this.PARTICLES =  this.PARTICLE_NUM * this.PARTICLE_NUM;

        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.color = color;
        this.position = position;
        this.group = new THREE.Group();
        this.initComputeRenderer();
        this.initPosition();

        this.createBox();

        this.boxRemove = false;
    }

    private createBox()
    {
        this.boxGeomery = new THREE.BoxGeometry(this.WIDTH,this.HEIGHT,10,1,1);
        // var color = new THREE.Color(0xBF53F8);
        this.boxMaterial = new THREE.MeshLambertMaterial({
            color:this.color.getHex(),
            //map:new THREE.TextureLoader().load( "textures/sea02.jpg" ),
            wireframe:false,
            transparent:true,
            opacity:1.0
        });
        this.boxMesh = new THREE.Mesh(this.boxGeomery,this.boxMaterial);
        this.group.add(this.boxMesh)
        // this.scene.add(this.boxMesh);
    }


    private initComputeRenderer()
    {
        // 画面サイズだけGPU Rendererを生成
        this.gpuCompute = new GPUComputationRenderer( this.WIDTH, this.WIDTH, this.renderer );
        // 位置情報用のテクスチャ
        var dtPosition = this.gpuCompute.createTexture();
        // パーティクルごとの移動方向を保存するテクスチャ
        var dtVelocity = this.gpuCompute.createTexture();
        // noiseに使うoffset
        var dtOffset = this.gpuCompute.createTexture();

        // おまじない
        this.fillTextures(dtPosition, dtVelocity,dtOffset);

        // shader Programの登録
        this.velocityVariable = this.gpuCompute.addVariable( "textureVelocity",computeShaderVelocity_frame.shader, dtVelocity );
        this.positionVariable = this.gpuCompute.addVariable( "texturePosition", computeShaderPosition_frame.shader, dtPosition );
        this.offsetVariable = this.gpuCompute.addVariable( "offsetValue", offsetValueShader_frame.shader, dtOffset );


        this.gpuCompute.setVariableDependencies( this.velocityVariable, [ this.positionVariable, this.velocityVariable, this.offsetVariable ] );
        this.gpuCompute.setVariableDependencies( this.positionVariable, [ this.positionVariable, this.velocityVariable, this.offsetVariable ] );
        this.gpuCompute.setVariableDependencies( this.offsetVariable,   [ this.positionVariable, this.velocityVariable, this.offsetVariable ] );


        // uniform変数の登録？
        this.velocityUniforms = this.velocityVariable.material.uniforms;
        this.offsetUniforms   = this.offsetVariable.material.uniforms;
        this.positionUniforms = this.positionVariable.material.uniforms;
        this.velocityUniforms.time = { value: 1.0 };
        this.positionUniforms.alpha = { value: 1.0 };
        this.positionUniforms.time = { value: 0.0 };
        var seed = 0.1;
        this.velocityUniforms.offseX = {value: Math.random()*seed};
        this.velocityUniforms.offseY = {value: Math.random()*seed};
        this.velocityUniforms.offseZ = {value: Math.random()*seed};
        this.velocityUniforms.scale = {value: (0.01+Math.random()*0.01-0.005)};
        this.velocityUniforms.translate = {value: this.position};

        var error = this.gpuCompute.init();
        if ( error !== null ) {
            console.error( error );
        }

    }
    private initPosition()
    {
        // particleの初期位置を決める
        this.geometry = new THREE.BufferGeometry();
        var positions = new Float32Array( this.PARTICLES * 3 );
        var p = 0;

        // 一旦0でうめる。texturePositionの値を参照するためとりあえず埋めれば良い。
        for ( var i = 0; i < this.PARTICLES; i++ ) {
            // x
            positions[ p++ ] = 0;
            // y
            positions[ p++ ] = 0;
            // z
            positions[ p++ ] = 0;
        }

        // テクスチャーに保存した情報を取り出すためにvec2(x,y)座標を記録
        var uvs = new Float32Array( this.PARTICLES * 2 );
        p = 0;
        for ( var j = 0; j < this.WIDTH; j++ ) {
            for ( var i = 0; i < this.WIDTH; i++ ) {
                uvs[ p++ ] = i / ( this.WIDTH - 1 );
                uvs[ p++ ] = j / ( this.WIDTH - 1 );
            }
        }


        // vertex-shaderに登録
        this.geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
        this.geometry.addAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) );



        var colorVec =  new THREE.Vector3(this.color.r,this.color.g,this.color.b);
        // particleの位置と移動方向を収めるuinform変数の初期化
        this.particleUniforms = {
            map: { value: new THREE.TextureLoader().load( "./textures/circle.png" ) },
            texturePosition: { value: null },
            textureVelocity: { value: null },
            alpha:{value:1.0},
            color: {value: colorVec},
            cameraConstant: { value: this.getCameraConstant(this.camera) },
            texture:    { value: new THREE.TextureLoader().load( "textures/sea02.jpg" ) }
        };

        // ShaderMaterial の設定
        var material = new THREE.ShaderMaterial( {
            uniforms:       this.particleUniforms,
            vertexShader:   particleShader_frame.vertexShader,
            fragmentShader: particleShader_frame.fragmentShader,
            transparent: true
        });
        // おまじない
        material.extensions.drawBuffers = true;
        // Points オブジェクトを生成
        this.particle = new THREE.Points( this.geometry, material );
        this.particle.matrixAutoUpdate = false;
        this.particle.updateMatrix();
        this.particle.frustumCulled = false;
        // シーンに追加
        // particles.position.set(50,5,0);
        this.group.add(this.particle);
        // group.translateX(this.position.x);
        // group.translateY(this.position.y);
        // group.translateZ(this.position.z);
        this.group.position.set(this.position.x,this.position.y,this.position.z);
        //particles.position.set(this.position.x,this.position.y,this.position.z);
        this.scene.add( this.group );

    }

    private fillTextures(texturePosition, textureVelocity,offsetValue)
    {
        // 場所と移動方向を保存するテクスチャーの初期化
        var posArray = texturePosition.image.data;
        var velArray = textureVelocity.image.data;
        var offsetArray = offsetValue.image.data;

        for ( var k = 0, kl = posArray.length; k < kl; k += 4 ) {
            // Position
            var x, y, z;
            var width = this.WIDTH;
            var height = this.HEIGHT;

            x = Math.random()*width-width/2;
            //z = Math.random()*width-width/2;
            z = 0.0;
            y =Math.random()*height-height/2;
            // Fill in texture values
            posArray[ k + 0 ] = x;
            posArray[ k + 1 ] = y;
            posArray[ k + 2 ] = z;
            posArray[ k + 3 ] = 1.0;
            velArray[ k + 0 ] = Math.random()*0.2-0.1;
            velArray[ k + 1 ] = Math.random()*0.2-0.1;
            velArray[ k + 2 ] = Math.random()*0.2-0.1;
            velArray[ k + 3 ] = Math.random()*0.2-0.1;

            offsetArray[ k + 0 ] = x;
            offsetArray[ k + 1 ] = y;
            offsetArray[ k + 2 ] = z;
            offsetArray[ k + 3 ] = 0;
        }

    }

    public getCameraConstant(camera) {
        // カメラ情報を計算。
        return window.innerHeight / ( Math.tan( THREE.Math.DEG2RAD * 0.5 * camera.fov*0.6 ) / camera.zoom );
    }

    public resize() {

        this.particleUniforms.cameraConstant.value = this.getCameraConstant(this.camera);
    }

    public setPosition(pos)
    {
        this.group.position.set(pos.x,pos.y,pos.z)

    }

    public enableUpdate()
    {
        this.startUpdate = true;
    }

    public update()
    {



        // this.resize();
        if(this.startUpdate)
        {

            this.time += 0.01;







            if(this.particleUniforms.alpha.value >= 0.0) {


                // gpuComputeをアップデート
                this.gpuCompute.compute();
                // 前のフレームの情報でパーティクルの位置情報を上書き
                this.particleUniforms.texturePosition.value = this.gpuCompute.getCurrentRenderTarget(this.positionVariable).texture;
                // 前のフレームの情報でパーティクルの移動方向情報を上書き
                this.particleUniforms.textureVelocity.value = this.gpuCompute.getCurrentRenderTarget(this.velocityVariable).texture;
                // this.particleUniforms.alpha.value -= 0.001;
                this.positionUniforms.alpha.value = this.particleUniforms.alpha.value;
                // uniform変数の値を更新
                this.velocityUniforms.time.value = new Date().getSeconds() * 0.01;
                this.positionUniforms.time.value = Math.abs(Math.sin(this.time));
            } else {
                // this.scene.remove(this.particle);
                // this.particle.geomery.dispose();
                // this.particle.material.dispose();
            }


            if(this.boxMaterial.opacity > 0.0)
            {
            this.boxMaterial.opacity = 0.02;
            //this.boxMaterial.wireframe = true;
            // this.boxMaterial.opacity *= 0.998;
            // if(this.boxMaterial.opacity < 0.01)
            // {
            //     this.boxMaterial.opacity = 0.0;
            }

            // } else{
            if(!this.boxRemove)
            {
                // this.scene.remove(this.boxMesh);
                // this.boxGeomery.dispose();
                // this.boxMaterial.dispose();
                // this.boxRemove = true;
            }
            // }

        }

    }

}




class Frame {

    public scene: THREE.Scene;
    public camera: THREE.Camera;

    public UPDATE:boolean = true;
    public END:boolean = false;

    public renderer:THREE.Renderer;
    public particles:any[] = [];
    private controls:any;

    constructor(renderer) {

        this.renderer = renderer;
        this.createScene();

    }




    private createScene(){

        this.scene = new THREE.Scene();
        // this.scene.fog = new THREE.Fog(0x000000,-500,3000);
        this.scene.add(new THREE.AmbientLight(0xffffff,0.8));
        this.renderer.setClearColor ( 0xffffff, 1.0 );


        // カメラを作成
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 10000 );
        this.camera.position.z = 300;

        var textureLoader = new THREE.TextureLoader();

        var image = textureLoader.load( "textures/frame.jpg" );

        var scale = 0.7;
        var geomery = new THREE.PlaneGeometry(1000,800,21,21);
        var material = new THREE.MeshPhongMaterial({
            map:image
        });

        var mesh = new THREE.Mesh(geomery,material);
        // this.scene.add(mesh);

        var wirematerial = new THREE.MeshBasicMaterial({
           color:0x000000,
            wireframe:true
        });

        // mesh = new THREE.Mesh(geomery,wirematerial);
        // this.scene.add(mesh);







        var frameA = new THREE.PlaneGeometry(2.5,3.3,2,2);
        var blackMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent:true,
            // opacity:0.5
        });

        var frameAMesh = new THREE.Mesh(frameA,blackMaterial);
        frameAMesh.position.x -=3;
        frameAMesh.position.y = 1.3;

        // this.scene.add(frameAMesh);


        //scene,width,depth,height,position,color,isCreateFace


        var particleposition = new THREE.Vector3(-200,0,3);
        var wireposition = new THREE.Vector3(-200,0,0);
        var color = new THREE.Color(0.05,0.05,0.05);

        this.particles.push(new GPGPUParticle_frame(this.scene,this.camera,this.renderer,140,210,particleposition,color));
        var wireBox = new WierBox(this.scene,140,2,210,wireposition,color,false);

        particleposition.x = 0;
        wireposition.x = 0;
        var wireBox01 = new WierBox(this.scene,140,2,210,wireposition,color,false);
        this.particles.push(new GPGPUParticle_frame(this.scene,this.camera,this.renderer,140,210,particleposition,color));


        particleposition.x = 200;
        wireposition.x =200
        var wireBox02 = new WierBox(this.scene,140,2,210,wireposition,color,false);
        this.particles.push(new GPGPUParticle_frame(this.scene,this.camera,this.renderer,140,210,particleposition,color));



    }

public update() {

    //console.log(this.END);
    if (this.UPDATE == false) {
        //this.scene.remove(this.scene.children[0]);
        this.remove();
        if (this.scene.children.length == 0) {
            this.END = true;
        }

    }

    for(var i = 0; i < this.particles.length; i++)
    {
        this.particles[i].update();
    }

}

    public click()
    {

        for(var i = 0; i < this.particles.length; i++)
        {
            this.particles[i].enableUpdate();
        }



    }

    public  initOrbitControls()
    {
        this.controls = new THREE.OrbitControls(this.camera,this.renderer.domElement);
        this.controls.enableKeys = false;
    }



    public remove()
    {


        //console.log(this.scene.children);
        while(this.scene.children.length != 0)
        {
            this.scene.remove(this.scene.children[0]);
            if(this.scene.children[0] == THREE.Mesh){
                this.scene.children[0].geometry.dispose();
                this.scene.children[0].material.dispose();
            }



        };


    }






    public endEnabled()
    {
        this.UPDATE = false;
    }





}

