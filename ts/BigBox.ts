/// <reference path="typings/index.d.ts" />


import SphereBufferGeometry = THREE.SphereBufferGeometry;
class LineBoxScene {

    public scene: THREE.Scene;
    public camera: THREE.Camera;

    public UPDATE:boolean = true;
    public END:boolean = false;
    private Box:Object;
    private Boxs:Object[] = [];
    private renderer:THREE.WebGLRenderer;
    private timer:number;
    private lookAt:THREE.Vector3;

    private isPlay:boolean = false;
    private zNum:number;
    private xNum:number;
    private zStep:number;
    private xStep:number;
    private phi:number = Math.random()*Math.PI*2;
    private theta:number = Math.random()*Math.PI*2;


    private butterflyPosition:THREE.Vector3 = new THREE.Vector3(0,300,0);
    private butterfly:THREE.Mesh = new THREE.Mesh();

    constructor(renderer) {
        this.renderer = renderer;

        this.createScene();

    }



    private createScene(){


        this.scene = new THREE.Scene();
        this.timer = 0.0;
        this.scene.fog = new THREE.Fog(0x000000,-500,3000);


        // カメラを作成
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 10000 );
        this.camera.position.z = 800;
        this.camera.position.y = 500;
        this.lookAt = new THREE.Vector3();
        this.lookAt.set(this.camera.position.x,this.camera.position.y,this.camera.position.z);
        this.lookAt.z +=  -500;
        // this.camera.lookAt()
        this.camera.lookAt(this.lookAt);

        this.xStep = 400;
        this.xNum = 4;
        this.zStep = 200;
        this.zNum = 13;
        // for(var x = 0; x < this.xNum; x++)
        // {
        //     // for(var y = 0; y < 5; y++)
        //     // {
        //         for(var z = 0; z < this.zNum; z++)
        //         {
        //             var pos = new THREE.Vector3(x*this.xStep+50-(this.xStep*this.xNum/2-100),50,-z*this.zStep-150);
        //             var box = new WierBox(this.scene,100,100,100,pos,new THREE.Color(255,255,255));
        //             this.Boxs.push(box);
        //
        //         }
        //
        //
        //     // }
        //
        // }


        for(var i = 0; i < 15; i++)
        {

            var x = this.getRandom(-7,8) * 100+50;
            var y = 50;
            var z = this.getRandom(-14,0)*100+50-100;
            var pos = new THREE.Vector3(x,y,z);
            var box = new WierBox(this.scene,100,100,100,pos,new THREE.Color(255,255,255));
            this.Boxs.push(box);


        }


        var size = 100000;
        var step = 100;
        var spehereWidth = 50;
        var gridHelper = new THREE.GridHelper( size, step );
        this.scene.add( gridHelper );
        this.scene.position.x = 50;





        var sphereGeo = new SphereBufferGeometry(spehereWidth,spehereWidth,6,6);
        var spheremat = new THREE.MeshBasicMaterial(
            {
                color:0xffffff,
                wireframe:true
            });


        this.butterfly = new THREE.Mesh(sphereGeo,spheremat);

        this.butterfly.position.set(-spehereWidth,this.butterflyPosition.y,this.butterflyPosition.z);
        this.scene.add(this.butterfly);





        // それぞれの面の箱
        var geometry = new THREE.BoxGeometry(100, 100, 100);
//材質を配列で指定する(箱型なので6面分)
        var materials = [
            new THREE.MeshBasicMaterial({color: 0x00ff00}),
            new THREE.MeshBasicMaterial({color: 0x00ff00}),
            new THREE.MeshBasicMaterial({color: 0x0000ff}),
            new THREE.MeshBasicMaterial({color: 0x0000ff}),
            new THREE.MeshBasicMaterial({color: 0xff0000}),
            new THREE.MeshBasicMaterial({color: 0xff0000})
        ];
//MeshFaceMaterialで材質を宣言
        var material = new THREE.MeshFaceMaterial(materials);
//オブジェクトの生成
        var _mesh = new THREE.Mesh(geometry, material);
//シーンへの追加
        this.scene.add(_mesh);

    }



    public update() {
        this.timer += 0.02;

        //console.log(this.END);
        if (this.UPDATE == false) {
            //this.scene.remove(this.scene.children[0]);
            this.remove();
            if (this.scene.children.length == 0) {
                this.END = true;
            }

        }

        for(var i = 0; i < this.Boxs.length; i++)
        {

            //this.Boxs[i].update();

            if(this.butterfly.position.z - this.Boxs[i].position.z <= -350)
            {
                // var p = this.Boxs[i].Obj.position;
                this.Boxs[i].Obj.position.x = this.getRandom(-12,11) * 100+50;
                // var y = 50;
                this.Boxs[i].Obj.position.z -= 800- this.getRandom(-1,-8)*200;
                // this.Boxs[i].setPosition(p.x,p.y,p.z);
                this.Boxs[i].updateHeadVertex( 20+200*Math.sin(Math.random()*Math.PI) );
            }
        }

        if(this.isPlay)
        {
            this.camera.position.z -=4;
            this.butterfly.position.z -=4;

            this.lookAt.set(this.camera.position.x,this.camera.position.y,this.camera.position.z);
            this.lookAt.z +=  -500+50;
            this.camera.lookAt(this.lookAt);

            //(r sinsθ cosΦ, r cosθ, r sinθ sinΦ)
            // this.phi += (Math.random()*0.02+Math.random()*0.02+Math.random()*0.02)/3;
            // this.theta += (Math.random()*0.02+Math.random()*0.02+Math.random()*0.02)/3;
            this.phi += 0.02;
            this.theta += 0.02;
            // var rad = Math.abs(this.butterfly.position.z - this.camera.position.z);
            // var x = rad * Math.sin(this.theta) * Math.cos(this.phi);
            // var y = rad * Math.cos(this.theta);
            // var z = rad * Math.sin(this.theta) * Math.sin(this.phi);
            // this.camera.position.set(x,y,z);
            this.camera.position.x = Math.sin(this.phi)*20;
            this.camera.position.y = 350+Math.sin(this.theta)*Math.sin(this.theta/2)*20;
            this.camera.position.z +=Math.cos(this.phi);

        }






    }

    public  initOrbitControls()
    {
        // this.controls = new THREE.OrbitControls(this.camera,this.renderer.domElement);
        // this.controls.enableKeys = false;
    }

    public click()
    {
        this.isPlay = !this.isPlay;
    }



    public endEnabled()
    {
        this.UPDATE = false;
    }

    public resize()
    {

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

    private getRandom(min,max)
    {
        var num = Math.floor( ( Math.random() * ( ( max + 1 ) - min ) ) + min);
        console.log(num);
        return num;
    }


}

