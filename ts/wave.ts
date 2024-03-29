///<reference path="typings/index.d.ts" />
class Wave {

    public scene: THREE.Scene;
    public camera: THREE.Camera;

    public waveGeomery:THREE.Geometry;
    public waveMaterial:THREE.Geometry;
    public waveMesh:THREE.Mesh;
    public UPDATE:boolean = true;
    public END:boolean = false;
    private controls:any;
    private timer:number = 0;
    private noiseSeeds:Object[] = [];
    private noisex:number = 0.3;
    private noisey:number = 0;
    private noisez:number = 0;
    private noisestepx:number = 0.05;
    private noisestepy:number = 0.08;
    private noisestepz:number = 0.06;


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
        this.scene.fog = new THREE.Fog(0x000000,0,4000);
        var ambient = new THREE.AmbientLight(0xffffff);
        this.scene.add(ambient);


        // カメラを作成
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 10000 );
        this.camera.position.z = 0;
        this.camera.position.y = 1000;


        this.waveGeomery = new THREE.PlaneGeometry(17000,17000,60,80);
        this.waveMaterial = new THREE.MeshLambertMaterial({
            color:0xffffff,
            wireframe:true,
            wireframeLinewidth:2
        });



        console.log(this.waveGeomery.vertices);


        for(var i = 0; i < this.waveGeomery.vertices.length; i++)
        {
            this.noisex += this.noisestepx;
            this.noisey += this.noisestepy;
            this.noisez += this.noisestepz;
            this.noiseSeeds.push({x:this.noisex,y:this.noisey,z:this.noisez});
            var value = noise.perlin3(this.noisex, this.noisey,this.noisez)*100;
            this.waveGeomery.vertices[i].z = value;
        }
        this.waveGeomery.verticesNeedUpdate = true;
        this.waveMesh = new THREE.Mesh(this.waveGeomery,this.waveMaterial);
        this.waveMesh.rotation.x = -Math.PI/2;
        this.waveMesh.rotation.z = -Math.PI/2;
        this.waveMesh.position.z = -2000;


        this.scene.add(this.waveMesh);

        //controls = new THREE.OrbitControls(this.camera, renderer.domElement);
    }



    public endEnabled()
    {
        this.UPDATE = false;
    }


    public update() {
        var date = new Date;
        this.timer += 0.01;

        //console.log(this.END);
        if (this.UPDATE == false) {
            //this.scene.remove(this.scene.children[0]);
            this.remove();
            if (this.scene.children.length == 0) {
                this.END = true;
            }

        }

        for(var i = 0; i < this.waveGeomery.vertices.length; i++)
        {
            this.noiseSeeds[i].x += this.noisestepx*0.5;
            this.noiseSeeds[i].y = this.noiseSeeds[i].x*0.5;
            this.noiseSeeds[i].z = this.timer;
            var value = noise.perlin3(this.noiseSeeds[i].x, this.noiseSeeds[i].y,this.noiseSeeds[i].z)*300;
            this.waveGeomery.vertices[i].z = value;
            this.waveGeomery.vertices[i].x += Math.sin(this.timer+i*0.1)*1;
        }
        this.waveGeomery.verticesNeedUpdate = true;

        this.scene.rotateX(this.noisestepx*0.05);
        this.scene.rotateY(this.noisestepy*0.05);
        this.scene.rotateZ(this.noisestepz*0.05);

        this.camera.position.y = 1300+2000*Math.sin(this.timer);
        this.camera.position.x = 1000* Math.cos(this.timer);

        // this.camera.lookAt(new THREE.Vector3(100*Math.sin(this.timer*0.003),100*Math.cos(this.timer*0.001),100*Math.cos(this.timer*0.005)));
        this.camera.lookAt(new THREE.Vector3(0,0,1000*Math.cos(this.timer*0.005)));

    }




}

