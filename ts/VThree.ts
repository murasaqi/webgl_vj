/// <reference path="typings/index.d.ts" />

class VThree
{
    // 現在のシーンの番号
    public NUM:number = 0;
    // シーンを格納する配列
    public scenes:any[] = [];
    // Renderer
    public renderer:THREE.Renderer;

    constructor()
    {
        // 初期化処理後、イベント登録
        this.init();

        window.addEventListener( 'resize', this.onWindowResize, false );
        document.addEventListener("keydown", this.onKeyDown, true);

    }


    public init()
    {


        // Rendererを作る

        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.sortObjects = false;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowMap;
        this.renderer.domElement.id = "main";
        document.body.appendChild( this.renderer.domElement );

    }

    // 管理したいシーンを格納する関数

    public addScene(scene:Object)
    {

        this.scenes.push(scene);

    }




    // ウィンドウの幅が変わったときの処理
    public onWindowResize = () =>
    {
        var windowHalfX = window.innerWidth / 2;
        var windowHalfY = window.innerHeight / 2;
        this.scenes[this.NUM].camera.aspect = window.innerWidth / window.innerHeight;
        this.scenes[this.NUM].camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );

        console.log("resize");
    }

    // 現在のシーン番号が、不適切な値にならないようにチェック
    public checkNum = () =>
    {
        if(this.NUM <0)
        {
            this.NUM = this.scenes.length-1;
        }

        if(this.NUM >= this.scenes.length)
        {
            this.NUM = 0;
        }

    }

    // ←→キーでシーン番号を足し引き

    public onKeyDown = (e:KeyboardEvent) => {

        console.log(e);
        // console.log(this.NUM);
        if(e.key == "ArrowRight")
        {
            this.NUM++;
            this.checkNum();
        }
        if( e.key == "ArrowLeft")
        {

            this.NUM--;
            this.checkNum();
        }

        console.log(this.NUM);

    }

    // 最終的な描写処理と、アニメーション関数をワンフレームごとに実行
    public draw() {

        this.scenes[this.NUM].update();
        this.renderer.render(this.scenes[this.NUM].scene, this.scenes[this.NUM].camera);
        requestAnimationFrame(this.draw.bind(this));

    }
}

