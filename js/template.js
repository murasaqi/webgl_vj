var Template = (function () {
    function Template() {
        this.UPDATE = true;
        this.END = false;
        this.createScene();
    }
    Template.prototype.remove = function () {
        //console.log(this.scene.children);
        while (this.scene.children.length != 0) {
            this.scene.remove(this.scene.children[0]);
            if (this.scene.children[0] == THREE.Mesh) {
                this.scene.children[0].geometry.dispose();
                this.scene.children[0].material.dispose();
            }
        }
        ;
    };
    Template.prototype.createScene = function () {
        this.scene = new THREE.Scene();
        this.scene = new THREE.Scene();
        // this.scene.fog = new THREE.Fog(0x000000,-500,3000);
        // カメラを作成
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
        this.camera.position.z = 1000;
    };
    Template.prototype.endEnabled = function () {
        this.UPDATE = false;
    };
    Template.prototype.update = function () {
        //console.log(this.END);
        if (this.UPDATE == false) {
            //this.scene.remove(this.scene.children[0]);
            this.remove();
            if (this.scene.children.length == 0) {
                this.END = true;
            }
        }
    };
    return Template;
}());
//# sourceMappingURL=template.js.map