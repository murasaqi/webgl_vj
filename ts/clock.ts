/// <reference path="typings/index.d.ts" />
class Clock {

    public scene: THREE.Scene;
    public camera: THREE.Camera;

    public UPDATE:boolean = true;
    public END:boolean = false;
    private rendererc
    private r:any;

    private group:THREE.Group;
    private maxParticleCount:any;
    private particlePositions:any;
    private lineMesh:any;
    private particles:any;
    private pointCloud:any;
    private NUM:any;
    private linePos:any;
    private rotate:any;
    private nowRotate:any;
    private preSec:any = 0;
    private colors:any;
    private groupPos:any;
    private nowGroupPos:any;
    private renderColor:any;
    private bWhite:any = false;
    private nowbgcolor:any;
    private nextbgcolor:any;
    private whitebgcolor:any;
    private blackbgcolor:any;
    private isClick:boolean = false;
    private arraynow:any;
    private arraywhite:any;
    private arrayblack:any;
    private arraynext:any;
    private planematerial:any;

    private textTexture:any;
    private texture:any;
    private textAlpha:any = 1.0;
    private timer:any= 0.0;
    private planeMesh:any;
    private canvas:any;
    private context:any;
    private lineGeometry:any;
    private alphaTimer:any;
    private textPos:any;
    private renderer:THREE.WebGLRenderer;

    private bgColor:any = {r:0,g:0,b:0};
    private bgColorNext:any = {r:0,g:0,b:0};

    constructor(renderer) {

        this.renderer = renderer;
        this.createScene();

    }




    private createScene(){



        this.scene = new THREE.Scene();
        this.rotate = new THREE.Vector3(0,0,0);
        this.nowRotate = new THREE.Vector3(0,0,0);
        this.groupPos = new THREE.Vector3(0,0,0);
        this.nowGroupPos = new THREE.Vector3(0,0,0);
        this.renderColor = new THREE.Color(0,0,0);
        this.nowbgcolor = new Array(7);
        this.whitebgcolor = new Array(7);
        this.blackbgcolor = new Array(7);
        this.arraynow = new Float32Array(7*3);
        this.arraynext = new Float32Array(7*3);
        this.arraywhite = new Float32Array(7*3);
        this.arrayblack = new Float32Array(7*3);

        this.alphaTimer = new Float32Array(2);
        this.alphaTimer[0] = 0.0;
        this.alphaTimer[1] = 0.0;


        this.nowbgcolor[0] = new THREE.Color(250,250,250);
        this.nowbgcolor[1] = new THREE.Color(240,240,240);
        this.nowbgcolor[2] = new THREE.Color(230,230,230);
        this.nowbgcolor[3] = new THREE.Color(220,220,220);
        this.nowbgcolor[4] = new THREE.Color(200,200,200);
        this.nowbgcolor[5] = new THREE.Color(180,180,180);
        this.nowbgcolor[6] = new THREE.Color(140,140,140);

        this.whitebgcolor[0] = new THREE.Color(250,250,250);
        this.whitebgcolor[1] = new THREE.Color(240,240,240);
        this.whitebgcolor[2] = new THREE.Color(230,230,230);
        this.whitebgcolor[3] = new THREE.Color(220,220,220);
        this.whitebgcolor[4] = new THREE.Color(200,200,200);
        this.whitebgcolor[5] = new THREE.Color(180,180,180);
        this.whitebgcolor[6] = new THREE.Color(140,140,140);


        this.blackbgcolor[0] = new THREE.Color(140,140,140);
        this.blackbgcolor[1] = new THREE.Color(130,130,130);
        this.blackbgcolor[2] = new THREE.Color(120,120,120);
        this.blackbgcolor[3] = new THREE.Color(90,90,90);
        this.blackbgcolor[4] = new THREE.Color(80,80,80);
        this.blackbgcolor[5] = new THREE.Color(70,70,70);
        this.blackbgcolor[6] = new THREE.Color(60,60,60);
        this.nextbgcolor = this.whitebgcolor;

        for(var i = 0; i < this.nowbgcolor.length; i++){
            this.arraynow[i*3 + 0] = this.nowbgcolor[i].r;
            this.arraynow[i*3 + 1] = this.nowbgcolor[i].r;
            this.arraynow[i*3 + 2] = this.nowbgcolor[i].r;

            this.arraywhite[i*3 + 0] = this.whitebgcolor[i].r;
            this.arraywhite[i*3 + 1] = this.whitebgcolor[i].r;
            this.arraywhite[i*3 + 2] = this.whitebgcolor[i].r;

            this.arrayblack[i*3 + 0] = this.blackbgcolor[i].r;
            this.arrayblack[i*3 + 1] = this.blackbgcolor[i].r;
            this.arrayblack[i*3 + 2] = this.blackbgcolor[i].r;

            this.arraynext[i*3 + 0] = this.whitebgcolor[i].r;
            this.arraynext[i*3 + 1] = this.whitebgcolor[i].r;
            this.arraynext[i*3 + 2] = this.whitebgcolor[i].r;


        }

        // カメラを作成
        this.camera = new THREE.PerspectiveCamera( 110, window.innerWidth/window.innerHeight, 0.1, 10000 );
        this.camera.position.z = 2000;


        // Groupでオブジェクトをまとめる
        this.group = new THREE.Group();
        this.scene.add( this.group );


        this.r = 800;

        // ====================== create particle line ====================== //

        this.particles = new THREE.BufferGeometry();
        this.lineGeometry = new THREE.BufferGeometry();
        this.NUM = 20;
        this.maxParticleCount = this.NUM*this.NUM;
        this.particlePositions = new Float32Array( this.maxParticleCount * 3 );
        var numIndices = this.maxParticleCount * (this.maxParticleCount-1);
        var counter = 0;
        this.colors = new Float32Array(this.maxParticleCount * 3 );
        for(var i = 1; i<=this.NUM; i++)
        {
            //var color = new THREE.Color();
            var phi = Math.PI*2/this.NUM * i;
            for(var j = 1; j<= this.NUM; j++)
            {
                var radius = this.r/2;
                var theta = Math.PI*2/this.NUM *j;
                var date = new Date();
                var x = radius * Math.sin(theta * date.getHours()+4)*Math.cos(phi);
                var y = radius * Math.cos(theta * date.getSeconds() * 0.3);
                var z = radius * Math.sin(theta * date.getSeconds()) * Math.sin(phi);
                this.particlePositions[ counter * 3     ] = x;
                this.particlePositions[ counter * 3 + 1 ] = y;
                this.particlePositions[ counter * 3 + 2 ] = z;
                this.colors[counter*3+0] = 1.0;
                this.colors[counter*3+1] = 0.0;
                this.colors[counter*3+2] = 0.0;

                // colors[3] = 0.0;
                // colors[4] = 0.0;
                // colors[5] = 0.0;

                counter ++;
            }
        }



        var pMaterial = new THREE.PointsMaterial( {
            color: "rgb(30,30,30)",
            size: 3,
            transparent: true,
            sizeAttenuation: false
        } );


        var lMaterial = new THREE.LineBasicMaterial( {
            color: "rgb(0,0,0)",
            transparent: true,

        } );


        var indices = new THREE.BufferAttribute( new Uint16Array( numIndices ), 1 );
        for (var i = 0; i < numIndices; i++) {
            indices.array[i] = 0;
        }

        this.lineGeometry.setIndex(indices);
        this.lineGeometry.setDrawRange(0, 0);
        this.lineGeometry.setDrawRange(0,0);


        this.linePos = this.particlePositions;
        this.particles.addAttribute( 'position', new THREE.BufferAttribute( this.particlePositions, 3 ).setDynamic( true ) );
        //particles.addAttribute('color', new THREE.BufferAttribute(colors, 3));

        this.lineGeometry.addAttribute('position',new THREE.BufferAttribute( this.linePos, 3 ).setDynamic( true ));

        this.pointCloud = new THREE.Points( this.particles, pMaterial );
        this.lineMesh = new THREE.LineSegments(this.lineGeometry, lMaterial);
        this.group.add( this.pointCloud );
        this.group.add( this.lineMesh );


        this.canvas = document.createElement('canvas');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.context = this.canvas.getContext('2d');
        this.textPos = new THREE.Vector2(Math.random()*window.innerWidth/3-innerWidth/6 + innerWidth/2,  Math.random()*window.innerHeight/2);

        this.createTexture('test', "rgba(255,255,255,0.1)");

        this.texture = new THREE.CanvasTexture(this.canvas);
        this.texture.minFilter = THREE.LinearFilter;
        this.texture.magFilter = THREE.LinearFilter;

        this.planematerial = new THREE.MeshBasicMaterial({map: this.texture,alpha:true});
        this.planematerial.transparent = true;
        this.planematerial.blending = THREE["AdditiveBlending"];

        var planegeometry = new THREE.PlaneGeometry(200*window.innerWidth/window.innerHeight,200,8,8);
        this.planeMesh = new THREE.Mesh(planegeometry,this.planematerial);
        this.planeMesh.position.z = 1900;
        this.scene.add(this.planeMesh);


    }

    public createTexture(text,color)
    {

        this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.context.textAlign = "center";
        this.context.beginPath();
        this.context.fillStyle = color
        this.context.font = " bold 150px 'Source Sans Pro'";
        this.context.fillText(text, this.textPos.x,  this.textPos.y);
        this.context.fill();
    }

    public update() {

        this.bgColor.r += (this.bgColorNext.r - this.bgColor.r) * 0.05;
        this.bgColor.g += (this.bgColorNext.g - this.bgColor.g) * 0.05;
        this.bgColor.b += (this.bgColorNext.b - this.bgColor.b) * 0.05;

        // this.renderer.setPixelRatio( window.devicePixelRatio );
        // this.renderer.setSize( window.innerWidth, window.innerHeight );
        // var color = new THREE.Color(this.arraynow[0]*255.0,this.arraynow[0]*255.0,this.arraynow[0]*255.0);
        // console.log(color);
        var color = new THREE.Color(this.bgColor.r ,this.bgColor.g ,this.bgColor.b);
        if(this.bWhite)
        {
            this.renderer.setClearColor( color.getHex(), 1.0 );
        } else {
            this.renderer.setClearColor( color.getHex(), 1.0 );
        }


        // this.renderer.gammaInput = true;
        // this.renderer.gammaOutput = true;


        //console.log(this.END);
        if (this.UPDATE == false) {
            //this.scene.remove(this.scene.children[0]);
            this.remove();
            if (this.scene.children.length == 0) {
                this.END = true;
            }

        }


        this.timer += 0.1;
        var counter = 0;
        var speed = 0.1;
        for(var i = 1; i<= this.NUM; i++)
        {
            var phi = Math.PI*2/this.NUM * i;
            for(var j = 1; j<= this.NUM; j++)
            {
                var radius = this.r/2;
                var theta = Math.PI*2/this.NUM *j;
                var date = new Date();
                var _x = radius * Math.sin(theta * (date.getHours()*1.1))*Math.cos(phi);
                var _y = radius * Math.cos(theta * date.getSeconds() * 0.8);
                var _z = radius * Math.sin(theta * date.getSeconds()*0.5) * Math.sin(phi);
                var x = this.particlePositions[ counter * 3     ];
                var y = this.particlePositions[ counter * 3  +1  ];
                var z = this.particlePositions[ counter * 3   +2  ];
                this.particlePositions[ counter * 3     ] += (_x - x)*speed;
                this.particlePositions[ counter * 3 + 1 ] += (_y - y)*speed;
                this.particlePositions[ counter * 3 + 2 ] += (_z - z)*speed;

                this.linePos[ counter * 3     ] += (_x - x)*speed;
                this.linePos[ counter * 3 + 1 ] += (_y - y)*speed;
                this.linePos[ counter * 3 + 2 ] += (_z - z)*speed;

                counter ++;
            }
        }

        var date = new Date();
        if(this.alphaTimer[0] <= Math.PI*2){
            this.alphaTimer[0] += 0.1;
        }

        this.textAlpha = Math.sin(this.alphaTimer[0]);
        var rgb = "rgba(255,255,255," + String(this.textAlpha*0.4) + ")";
        var sec = date.getSeconds().toString();
        if(date.getSeconds() < 10)
        {
            sec = "0"+sec.toString();
        }
        var textureText = String(date.getHours()) + ":" + String(date.getMinutes()) + ":" + sec);
        this.createTexture(textureText, rgb);
        this.texture.needsUpdate = true;


        var nowColor =  this.pointCloud.material.color;
        nowColor.r += (this.renderColor.r - nowColor.r) * 0.05;
        nowColor.g += (this.renderColor.g - nowColor.g) * 0.05;
        nowColor.b += (this.renderColor.b - nowColor.b) * 0.05;
        this.pointCloud.material.color = nowColor;
        this.lineMesh.material.color = nowColor;

        var lIndicesCount = 0;
        var lIndices = this.lineMesh.geometry.index;
        for (var i = 0; i < this.maxParticleCount; i++) {
            for (var j = i + 1; j < this.maxParticleCount; j++) {
                var x1 = this.particlePositions[i * 3 + 0];
                var x2 = this.particlePositions[j * 3 + 0];
                var y1 = this.particlePositions[i * 3 + 1];
                var y2 = this.particlePositions[j * 3 + 1];
                var z1 = this.particlePositions[i * 3 + 2];
                var z2 = this.particlePositions[j * 3 + 2];
                var dist = Math.pow( (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1) + (z2-z1)*(z2-z1), 0.5 );

                if (dist > 20 && dist < 120) {
                    lIndices.array[lIndicesCount++] = i;
                    lIndices.array[lIndicesCount++] = j;
                }
            }
        }

        for(var i = 0; i < this.nowbgcolor.length; i++)
        {

            this.arraynow[i*3+0] += (this.arraynext[i*3+0] - this.arraynow[i*3+0]) * 0.05;
            this.arraynow[i*3+1] += (this.arraynext[i*3+1] - this.arraynow[i*3+1]) * 0.05;
            this.arraynow[i*3+2] += (this.arraynext[i*3+2] - this.arraynow[i*3+2]) * 0.05;
        }




        this.pointCloud.geometry.attributes.position.needsUpdate = true;
        this.lineMesh.geometry.attributes.position.needsUpdate = true;

        this.lineMesh.geometry.setDrawRange(0,lIndicesCount-1)
        lIndices.needsUpdate = true;

        var date = new Date();
        if(this.preSec != date.getSeconds()) {
            clock();
            if(date.getSeconds()%4 == 0)
            {
                this.isCick = true;
                randomRingPlay();
            }
        }
        if(this.isCick){
            this.rotate.y = Math.random() * 5 - 2.5;
            this.rotate.x = Math.random() * 5 - 2.5;
            this.rotate.z = Math.random() * 5 - 2.5;

            this.groupPos.x = Math.random() * 500 - 250;
            this.groupPos.y = Math.random() * 500 - 250;
            this.groupPos.z = (Math.random() * 2000 );
            //console.log(groupPos);
            this.bWhite = !this.bWhite;
            //console.log(bWhite);
            var scale = 0.9;
            if(this.bWhite){
                this.renderColor = new THREE.Color(0.9,0.9,0.9);
                this.nextbgcolor = this.blackbgcolor;
                this.arraynext = this.arrayblack;
                this.bgColorNext.r = 0.05;
                this.bgColorNext.g = 0.05;
                this.bgColorNext.b = 0.05;

            } else{
                this.renderColor = new THREE.Color(0.02,0.02,0.02);
                this.nextbgcolor = this.whitebgcolor;
                this.arraynext = this.arraywhite;
                this.bgColorNext.r = 0.95;
                this.bgColorNext.g = 0.95;
                this.bgColorNext.b = 0.95;
            }
            console.log(this.arraynext);

            this.alphaTimer[0] = 0.0;

            var _x = window.innerWidth/2 + Math.random()*window.innerWidth*0.4 - Math.random()*window.innerWidth*0.4;
            var _y = window.innerHeight/2 + Math.random()*window.innerHeight*0.4 - Math.random()*window.innerHeight*0.2;
            this.textPos.set(_x,_y);


            this.isCick = false;


        }



        this.nowRotate.y += (this.rotate.y - this.nowRotate.y) * 0.1;
        this.nowRotate.x += (this.rotate.x - this.nowRotate.x) * 0.1;
        this.nowRotate.z += (this.rotate.z - this.nowRotate.z) * 0.1;

        this.nowGroupPos.y += (this.groupPos.y - this.nowGroupPos.y) * 0.1;
        this.nowGroupPos.x += (this.groupPos.x - this.nowGroupPos.x) * 0.1;
        this.nowGroupPos.z += (this.groupPos.z - this.nowGroupPos.z) * 0.1;
        //var time = Date.now() * 0.001;

        this.group.rotation.y = this.nowRotate.y;
        this.group.rotation.x = this.nowRotate.x;
        this.group.rotation.z = this.nowRotate.z;


        this.group.position.set(this.nowGroupPos.x, this.nowGroupPos.y, this.nowGroupPos.z);




        this.preSec = date.getSeconds();

    }


    public click()
    {
        this.isCick = true;

    }

    public keyUp()
    {

    }

    public keyDown(event)
    {

    }

    public  initOrbitControls()
    {
        // this.controls = new THREE.OrbitControls(this.camera,this.renderer.domElement);
        // this.controls.enableKeys = false;
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

