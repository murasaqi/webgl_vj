

// ************************ main scene ************************ //


class Frame01 {

    public scene: THREE.Scene;
    public camera: THREE.Camera;

    public UPDATE:boolean = true;
    public END:boolean = false;

    public renderer:THREE.Renderer;
    public particles:any[] = [];
    public boxs:any[] = [];
    private controls:any;
    private isUpdate:boolean = false;

    private time_scene01:number = 0.0;
    private time_scene02:number = 0.0;
    private scene01FramePositions:Object;
    // private scene01FramePositions_next:any[] = [];
    private rotattion:Object;
    private radian:Object;
    private frame_boxs:any[] = [];
    private speed:number = 0.0;
    private scene01Update:Boolean = false;
    private scene02Update:Boolean = false;
    private sceneUpdate:Boolean = false;
    private scene01Speed:Object;
    private scene01FrameVector:any[];
    private scene01CameraRotation:any[];
    private clickCount:number = 0;
    private isSpeedDown:number = true;



    constructor(renderer) {

        this.renderer = renderer;
        this.createScene();

    }




    private createScene(){



        // **** Audio setting ****** //
        // this.rythm = new SoundPlayer();


        this.radian = {value:0.0};

        this.scene = new THREE.Scene();
        // this.scene.fog = new THREE.Fog(0x000000,-500,3000);
        this.scene.add(new THREE.AmbientLight(0xffffff,0.8));




        this.scene01FramePositions ={
            now:
                [
                    new THREE.Vector3(-200,0,3),
                    new THREE.Vector3(0,0,3),
                    new THREE.Vector3(200,0,3)

                ],
            next:
                [
                    new THREE.Vector3(-200,0,3),
                    new THREE.Vector3(0,0,3),
                    new THREE.Vector3(200,0,3)

                ];
    };



        var xRotateRange = Math.PI/2;
        this.rotattion = {
            now:
                [
                    new THREE.Vector3(0,0,0),
                    new THREE.Vector3(0,0,0),
                    new THREE.Vector3(0,0,0)
                ],
            next:
                [
                    new THREE.Vector3(Math.random()*Math.PI/2*-Math.PI/4, Math.random()*Math.PI*-0.5,Math.random()*Math.PI/2*-Math.PI/4),
                    new THREE.Vector3(Math.random()*Math.PI/2*-Math.PI/4,Math.random()*Math.PI/2-Math.PI/4,Math.random()*Math.PI/2*-Math.PI/4),
                    new THREE.Vector3(Math.random()*Math.PI/2*-Math.PI/4,Math.random()*Math.PI*0.5,Math.random()*Math.PI/2*-Math.PI/4)
                ]
        };

        this.scene01FrameVector =
            [
                new THREE.Vector3(-0.5,0,0.0),
                new THREE.Vector3(0.0,0,0.0),
                new THREE.Vector3(0.5,0,0.0)
            ];

        this.scene01CameraRotation = new THREE.Vector3(Math.random()*Math.PI-Math.PI/2,Math.random()*Math.PI-Math.PI/2,-Math.random()*Math.PI/2).normalize();


        this.scene01Speed =
        {
            now:5.0,
            slow:0.01

        };


        // カメラを作成
        this.camera = new THREE.PerspectiveCamera( 110, window.innerWidth/window.innerHeight, 0.1, 10000 );
        this.camera.position.z = 500;

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







        var frameA = new THREE.PlaneGeometry(2.5,3.3,2,2);
        var blackMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            // transparent:true,
            // opacity:0.5
        });

        var frameAMesh = new THREE.Mesh(frameA,blackMaterial);
        frameAMesh.position.x -=3;
        frameAMesh.position.y = 1.3;


        var particleposition = new THREE.Vector3(-200,0,3);
        var wireposition = new THREE.Vector3(-200,0,0);
        var color = new THREE.Color(0.05,0.05,0.05);

        this.particles.push(new GPGPUParticle_frame(this.scene,this.camera,this.renderer,140,210,particleposition,color));
        this.boxs.push(new WierBox(this.scene,140,2,210,wireposition,color,false));

        var particlepositionCenter = new THREE.Vector3(0,0,3);
        var wirepositionCenter = new THREE.Vector3(0,0,3);
        this.boxs.push(new WierBox(this.scene,140,2,210,wirepositionCenter,color,false));
        this.particles.push(new GPGPUParticle_frame(this.scene,this.camera,this.renderer,140,210,particlepositionCenter,color));


        var particlepositionRight = new THREE.Vector3(200,0,3);
        var wirepositionRight = new THREE.Vector3(200,0,3);
        this.boxs.push(new WierBox(this.scene,140,2,210,wirepositionRight,color,false));
        this.particles.push(new GPGPUParticle_frame(this.scene,this.camera,this.renderer,140,210,particlepositionRight,color));




        // if(!this.scene01 && this.scene02)
        // {
        //
        // }

        for(var i = 0; i < this.boxs.length; i++)
        {
            var x = this.scene01FramePositions.now[i].x;
            var y = this.scene01FramePositions.now[i].y;
            var z = this.scene01FramePositions.now[i].z;

            this.boxs[i].position.set(x,y,z);
            this.particles[i].setPosition(this.scene01FramePositions.now[i]);
        }

        // this.boxs[1].rotation.set(0, Math.PI, 0);
        // this.particles[1].rotation.set(0, Math.PI, 0);
    }

    private initPosition()
    {


        this.scene01FramePositions ={
            now:
                [
                    new THREE.Vector3(-300,00,3),
                    new THREE.Vector3(0,500,3),
                    new THREE.Vector3(300,00,3)

                ],
            next:
                [
                    new THREE.Vector3(-300,0,3),
                    new THREE.Vector3(0,0,3),
                    new THREE.Vector3(300,0,3)

                ];
    };



        var xRotateRange = Math.PI/2;
        this.rotattion = {
            now:
                [
                    new THREE.Vector3(0,0,0),
                    new THREE.Vector3(0,0,0),
                    new THREE.Vector3(0,0,0)
                ],
            next:
                [
                    new THREE.Vector3(
                        Math.random()*Math.PI/2*-Math.PI/4,
                        -Math.random()*Math.PI,
                        Math.random()*Math.PI/2*-Math.PI/4),
                    new THREE.Vector3(
                        Math.random()*Math.PI/2*-Math.PI/4,
                        Math.random()*Math.PI*2-Math.PI/2,
                        Math.random()*Math.PI/2*-Math.PI/4),
                    new THREE.Vector3(
                        Math.random()*Math.PI/2*-Math.PI/4,
                        Math.random()*Math.PI,
                        Math.random()*Math.PI/2*-Math.PI/4)
                ]
        };

        this.scene01FrameVector =
            [
                new THREE.Vector3(-0.5,0,0.0),
                new THREE.Vector3(0.0,0,0.0),
                new THREE.Vector3(0.5,0,0.0)
            ];

        this.scene01CameraRotation = new THREE.Vector3(Math.random()*Math.PI-Math.PI/2,Math.random()*Math.PI-Math.PI/2,-Math.random()*Math.PI/2).normalize();


        this.scene01Speed =
        {
            now:3.0,
            slow:0.1,

        };




        for(var i = 0; i < this.boxs.length; i++)
        {
            var x = this.scene01FramePositions.now[i].x;
            var y = this.scene01FramePositions.now[i].y;
            var z = this.scene01FramePositions.now[i].z;

            this.boxs[i].position.set(x,y,z);
            this.particles[i].setPosition(this.scene01FramePositions.now[i]);

            this.particles[i].rotation.set(0,0,0);
            this.boxs[i].rotation.set(0,0,0);
            this.particles[i].initUpdate();

        }

        this.time_scene02 = 0.0;




    }
    public update() {


        this.renderer.setClearColor ( 0xffffff, 1.0 );
        if (this.sceneUpdate) {
            this.time_scene02 += 0.01;


            if (this.isSpeedDown) {
                this.speed += (0.001 - this.speed) * 0.3;

            } else {
                this.speed += (0.015 - this.speed) * 0.1;
                // this.tween
            }

            this.radian.value += this.speed;

            for (var i = 0; i < this.particles.length; i++) {
                this.particles[i].update();
                {

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

    }


    public initOrbitControls()
    {
        this.controls = new THREE.OrbitControls(this.camera,this.renderer.domElement);
        this.controls.enableKeys = false;
    }

    public click()
    {
        // this.rythm.play();
    }

    public keyUp()
    {
        this.disableSpeedDown();

    }

    public keyDown(event)
    {

        console.log(event);
        switch (event.code){
            case "Comma":
                this.sceneUpdate = true;
                for(var i = 0; i < this.particles.length; i++)
                {
                    this.particles[i].enableUpdate();
                }
                break;
            case "Period":
                this.enableSpeedDown();

                break;
        }


    }

    public enableSpeedDown()
    {
        this.isSpeedDown = true;
        for (var i = 0; i < this.particles.length; i++) {
            this.particles[i].enableSpeedDown();
        }

    }

    public disableSpeedDown()
    {
        this.isSpeedDown = false;
        for (var i = 0; i < this.particles.length; i++) {
            this.particles[i].disableSpeedDown();
        }

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

