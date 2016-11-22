/// <reference path="typings/index.d.ts" />
class FontSwimming {

    public scene: THREE.Scene;
    public camera: THREE.Camera;

    public UPDATE:boolean = true;
    public END:boolean = false;

    private canvas:any;
    private context:any;
    private textPos:any;
    private text:string;
    private textColor:string;
    private textPosx:any;
    private texture:THREE.CanvasTexture;
    private renderer:any;
    private controls:any;
    private planeGeometry:THREE.PlaneGeometry;
    private groundGeometry:THREE.PlaneGeometry;

    private mainCanvas:any;
    constructor(renderer) {

        this.renderer = renderer;
        this.createScene();

    }




    private createScene(){

        this.renderer.setClearColor ( 0x000000, 1.0 );
        this.scene = new THREE.Scene();
        this.scene.add( new THREE.AmbientLight( 0x444444 ) );
        this.scene.fog = new THREE.Fog(0x000000,-1000,2000);


        // カメラを作成
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 10000 );
        this.camera.position.z = 500;

        var light1 = new THREE.DirectionalLight( 0xffffff, 0.5 );
        light1.position.set( 1, 1, 1 );
        this.scene.add( light1 );

        var light2 = new THREE.DirectionalLight( 0xffffff, 1.5 );
        light2.position.set( 0, -1, 1 );
        this.scene.add( light2 );



        // -------- create texture -------
        this.canvas = document.createElement('canvas');
        this.mainCanvas = document.getElementById('main');
        // document.body.appendChild( this.canvas );
        this.canvas.width = 8192*0.5;
        this.canvas.height = 256*0.5;
        this.context = this.canvas.getContext('2d');
        this.textPos = new THREE.Vector2(Math.random()*window.innerWidth,  Math.random()*window.innerHeight/2);

        this.text = 'まあ向さんを煩悶世の中まだ意見をあるたお蔭その天然私か増減をというお発展んなくあるだと';
        this.textColor = "rgba(255,255,255,1.0)";
        this.createTexture(this.text, this.textColor);

        this.texture = new THREE.CanvasTexture(this.canvas);
        this.texture.minFilter = THREE.LinearFilter;
        this.texture.magFilter = THREE.LinearFilter;

        this.texture.wrapS = this.texture.wrapT = THREE.RepeatWrapping;
        this.texture.anisotropy = 16;




        // create object

        var planematerial = new THREE.MeshPhongMaterial( {
            map:this.texture,
            transparent:true,
            side: THREE.DoubleSide,
            shading: THREE.SmoothShading,
            wireframe: false,
            blending:THREE["AdditiveBlending"]
        } );






        var widthsegments = 121;
        this.planeGeometry = new THREE.PlaneGeometry( this.canvas.width/2, this.canvas.height/2, widthsegments, 1 );
        var planeMesh = new THREE.Mesh( this.planeGeometry, planematerial );
        planeMesh.position.set( 0, 0, 0 );
        this.scene.add( planeMesh );

        // console.log(planeMesh);





        var grundmaterial = new THREE.MeshPhongMaterial( {
            map:this.mainCanvas,
            transparent:true,
            side: THREE.DoubleSide,
            shading: THREE.SmoothShading,
            wireframe: false,
            blending:THREE["AdditiveBlending"]
        } );

        this.groundGeometry = new THREE.PlaneGeometry( this.canvas.width/2, this.canvas.height/2, widthsegments, 1 );

        var _mesh = new THREE.Mesh(this.groundGeometry, planematerial);
        _mesh.rotation.x = Math.PI/2;
        _mesh.position.y = -200;


        this.scene.add(_mesh);





    }

    private time:number = 0.0;


    public update() {

        this.time += 0.01;
        this.renderer.setClearColor ( 0x000000, 1.0 );
        //console.log(this.END);
        if (this.UPDATE == false) {
            //this.scene.remove(this.scene.children[0]);
            this.remove();
            if (this.scene.children.length == 0) {
                this.END = true;
            }

        }



        var vertices = this.planeGeometry.vertices;

        for(var i = 0; i < vertices.length; i++)
        {
            vertices[i].z = 10*Math.sin(vertices[i].x + this.time);
        }

        this.planeGeometry.verticesNeedUpdate = true;


        // var vertices = this.groundGeometry.vertices;

        // for(var i = 0; i < vertices.length; i++)
        // {
        //     vertices[i].y = 10*Math.sin(this.time);
        // }
        //
        // this.groundGeometry.verticesNeedUpdate = true;



    }

    private  createTexture(text,color)
    {

        this.textPosx = 0.0;


        this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.context.textAlign = "center";
        this.context.beginPath();
        this.context.fillStyle = color;
        this.context.font = " bold 50px 'Yu Gothic'";
        var textWidth = this.context.measureText(text).width;
        this.context.fillText(text, this.canvas.width/2+this.textPosx,  this.canvas.height/2);
        this.context.fill();
    }

    public click()
    {

    }

    public keyUp()
    {

    }

    public keyDown(event)
    {

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

