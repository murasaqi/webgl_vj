/// <reference path="typings/index.d.ts" />
class Template {

    public scene: THREE.Scene;
    public camera: THREE.Camera;

    public UPDATE:boolean = true;
    public END:boolean = false;

    constructor() {

        this.createScene();

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

    }

    private createScene(){

        this.scene = new THREE.Scene();
        this.scene = new THREE.Scene();
        // this.scene.fog = new THREE.Fog(0x000000,-500,3000);


        // カメラを作成
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 10000 );
        this.camera.position.z = 1000;






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

