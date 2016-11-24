class BoxParticle {

    public scene: THREE.Scene;
    public camera: THREE.Camera;

    private controls:any;


    public UPDATE:boolean = true;
    public END:boolean = false;
    public renderer:any;
    private gpuparticle:any[]= [];
    private startUpdate:boolean;

    private material:any;
    private clickCounter:number = 0;
    private isUpdate:boolean = false;
    private animateSetting:Object[]=[];
    private speed:number = 1.0;
    private time:number = 0.0;




    constructor(renderer) {



        this.renderer = renderer
        this.camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 1,50000 );
        this.camera.position.y = 0;
        this.camera.position.z = 600;
        this.scene = new THREE.Scene();
        var yStep = 150;
        var offsetRad = Math.random()*Math.PI-Math.PI/2;
        var _width = 700;
        var _height = 600;
        for(var i = 0; i < 6; i++)
        {
            var vec = 1;
            offsetRad += Math.PI*2/6;

            if(i%2 == 0){
                vec = -1;
            } else {
                vec = 1;
            }

            var setting =
            {
                // moveToY:200,
                time:-9.0,
                rotateX:Math.random()*0.02-0.001,
                rotateY:Math.random()*0.02-0.001,
                rotateZ:Math.random()*0.02-0.001
            };
            this.animateSetting.push(setting);

            var x = _width * Math.cos(offsetRad);
            // x = 100;
            var y = _height * Math.sin(offsetRad);
            // y = 100;

            //var position = new THREE.Vector3(yStep*i-(yStep*6)/2+100,-200,0);
            var position = new THREE.Vector3(x,y,0);
            this.startUpdate = false;
            var color = new THREE.Color(0xffffff);
            // scene, camera, renderer,width,position,color
            this.gpuparticle.push( new GPGPUParticle(this.scene,this.camera,this.renderer,100,position,color));



        }



        this.scene.add(new THREE.AmbientLight(0xffffff,0.5));
        var dLight = new THREE.DirectionalLight(0xffffff,0.8);
        dLight.position.set(0,800,0);
        this.scene.add(dLight);

        var dLight = new THREE.DirectionalLight(0xffffff,0.8);
        dLight.position.set(0,0,300);
        this.scene.add(dLight);



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

    public resize()
    {
        for(var i = 0; i < this.gpuparticle.length; i++)
        {
            this.gpuparticle[i].resize();
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

    public click()
    {


        if(this.clickCounter == 0)
        {
            this.isUpdate = true;

        }


        // particle start
        // this.gpuparticle[this.clickCounter].startUpdate = true;



        if(this.clickCounter < this.gpuparticle.length)
        {
            this.clickCounter++;
        }






    }

    private easeOutCubic (t, b, c, d) {
        // t : 時間(進行度) 0~1
        // b : 開始の値(開始時の座標やスケールなど)
        // c : 開始と終了の値の差分
        // d : Tween(トゥイーン)の合計時間
        if(t>=1.0){
            t = 1.0;
        }
            return c*((t=t/d-1)*t*t + 1) + b;
        // }


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

        this.time += 0.1;




        // this.camera.position.z -= 1;


        if(this.isUpdate)
        {
            this.speed = 0.01;
            for(var i = 0; i < this.clickCounter; i++)
            {


                // var value = this.easeOutCubic(this.animateSetting[i].time,-200,400,1.0);
                // console.log(value);
                // console.log(this.animateSetting[i].time);
                // this.animateSetting[i].time += 0.01;


                if(this.gpuparticle[i].position.distanceTo(new THREE.Vector3(0,0,0)) < 10)
                {
                    this.gpuparticle[i].startUpdate = true;
                } else {
                    this.animateSetting[i].time += (0-this.animateSetting[i].time)*0.01;

                    // if(this.animateSetting[i].rotateX < 0.007)
                    // {
                    //     this.animateSetting[i].rotateX = 0;
                    // }
                    // if(this.animateSetting[i].rotateY < 0.007)
                    // {
                    //     this.animateSetting[i].rotateY = 0;
                    // }
                    // if(this.animateSetting[i].rotateZ < 0.007)
                    // {
                    //     this.animateSetting[i].rotateZ = 0;
                    // }
                    this.animateSetting[i].rotateX += (0-this.animateSetting[i].rotateX)*0.02;
                    this.animateSetting[i].rotateY += (0-this.animateSetting[i].rotateY)*0.02;
                    this.animateSetting[i].rotateZ += (0-this.animateSetting[i].rotateZ)*0.02;



                }

                var vec = new THREE.Vector3(
                    this.gpuparticle[i].position.x,
                    this.gpuparticle[i].position.y,
                    this.gpuparticle[i].position.z);
                //vec.multiplyScalar(-10);
                vec.normalize();

                this.gpuparticle[i].position.add(vec.multiplyScalar(this.animateSetting[i].time));
                this.gpuparticle[i].setRotateXYZ(
                    this.animateSetting[i].rotateX,
                    this.animateSetting[i].rotateY,
                    this.animateSetting[i].rotateZ
                );

                // if(Math.abs(this.gpuparticle[i].position.x)<=10)
                // {
                //     for(var i = 0; i < this.gpuparticle.length; i++)
                //     {
                //         this.gpuparticle[i].startUpdate = true;
                //     }
                // }



            }

        }
        var radius = 500+200*Math.sin(this.time*0.2);

        var camX = Math.cos(this.time*0.1) *radius;
        var camZ = Math.sin(this.time*0.1) *radius;
        var camY = Math.sin(this.time*0.07) *300;

        this.camera.position.x = camX;
        this.camera.position.z = camZ;
        this.camera.position.y = camY;
        this.camera.lookAt(new THREE.Vector3(0,0,0));



        for(var i = 0; i < this.gpuparticle.length; i++)
        {
            this.gpuparticle[i].update();
        }



    }


}