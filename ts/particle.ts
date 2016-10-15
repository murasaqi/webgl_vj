class Particle {

    public scene: THREE.Scene;
    public camera: THREE.Camera;

    public UPDATE:boolean = true;
    public END:boolean = false;

    public cube:THREE.Mesh;
    public cubes:any[] =[];

    constructor() {

        this.createScene();

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


    private createScene(){

        this.scene = new THREE.Scene();
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x000000,0,1200);

        this.scene.add(new THREE.AmbientLight(0xffffff));


        // カメラを作成
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 10000 );
        this.camera.position.z = 500;

        var geo = new THREE.CubeGeometry(50,50,50);
        var mat = new THREE.MeshPhongMaterial({
            wireframe:true,
            color:0xffffff
        });

        // this.cube = new THREE.Mesh(geo,mat);

        for(var i = 0; i < 100; i++)
        {
            var c = new THREE.Mesh(geo,mat);
            c.position.x = Math.random()*1000 -500;
            c.position.y = Math.random()*1000 -500;
            c.position.z = Math.random()*1200-600;

            c.rotation.x = Math.random()*Math.PI*2;
            c.rotation.y = Math.random()*Math.PI*2;
            c.rotation.z = Math.random()*Math.PI*2;

            this.cubes.push(c);
            this.scene.add(c);

        }



    }



    public endEnabled()
    {
        this.UPDATE = false;
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

        for (var i = 0; i < this.cubes.length; i++)
        {
            this.cubes[i].position.z+=3;
            this.cubes[i].rotateX(0.001);
            this.cubes[i].rotateX(0.002);
            this.cubes[i].rotateX(0.001);

            if(this.cubes[i].position.z > 500)
            {
               this.cubes[i].position.z = -800Math.random()200-100;
            }
        }

    }


}

