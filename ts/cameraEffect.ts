class CameraEffect {

    public scene: THREE.Scene;
    public camera: THREE.Camera;

    public UPDATE:boolean = true;
    public END:boolean = false;

    public lineGeometry:THREE.Geometry;
    public vertixes:any[] = [];


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
        // this.scene.fog = new THREE.Fog(0x000000,0,1000);


        // カメラを作成
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 10000 );
        this.camera.position.z = 1;



        var geometry = new THREE.Geometry();


        for ( i = 0; i < 10; i ++ ) {
            geometry.vertices.push( new THREE.Vector3(Math.random()*100,Math.random()*100,Math.random()*100) );
            // colors[ i ] = new THREE.Color( 0xffffff );
            // colors[ i ].setHSL( 0.6, 1.0, Math.max( 0, ( 200 - points[ i ].x ) / 400 ) * 0.5 + 0.5 );
            // colors2[ i ] = new THREE.Color( 0xffffff );
            // colors2[ i ].setHSL( 0.3, 1.0, Math.max( 0, ( 200 + points[ i ].x ) / 400 ) * 0.5 );
            // colors3[ i ] = new THREE.Color( 0xffffff );
            // colors3[ i ].setHSL( i / points.length, 1.0, 0.5 );
        }

        var material = new THREE.LineBasicMaterial( { color: 0xffffff, opacity: 1, linewidth: 3} );
        var line = new THREE.Line(geometry,material);
        this.scene.addEventListener(line);
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

    }


}

