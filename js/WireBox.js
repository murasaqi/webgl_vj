/// <reference path="typings/index.d.ts" />
var Uint16Attribute = THREE.Uint16Attribute;
var WierBox = (function () {
    function WierBox(scene, width, depth, height, position, color, isCreateFace) {
        this.width = 100;
        this.height = 100;
        this.depth = 100;
        this.alpah = 0.5;
        this.position = new THREE.Vector3(0, 0, 0);
        this.Obj = new THREE.Group();
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.scene = scene;
        this.position = this.Obj.position;
        this.position.set(position.x, position.y, position.z);
        this.color = color;
        this.isCreateFace = isCreateFace;
        this.rotation = this.Obj.rotation;
        this.init();
    }
    WierBox.prototype.init = function () {
        this.geometry = new THREE.BufferGeometry();
        this.material = new THREE.LineBasicMaterial({
            // vertexColors: THREE.VertexColors,
            color: this.color,
            side: THREE.DoubleSide
        });
        var vertices = new Float32Array(24);
        var colors = [];
        var indices_array = [];
        for (var i = 0; i < 8; i++) {
            // colors.push(Math.random()*0.5+0.5, Math.random()*0.5+0.5, 1);
            colors.push(this.color.r, this.color.g, this.color.b, 1.0);
        }
        vertices[0] = -this.width / 2;
        vertices[1] = -this.height / 2;
        vertices[2] = this.depth / 2;
        vertices[3] = this.width / 2;
        vertices[4] = -this.height / 2;
        vertices[5] = this.depth / 2;
        vertices[6] = this.width / 2;
        vertices[7] = -this.height / 2;
        vertices[8] = -this.depth / 2;
        vertices[9] = -this.width / 2;
        vertices[10] = -this.height / 2;
        vertices[11] = -this.depth / 2;
        vertices[12] = -this.width / 2;
        vertices[13] = this.height / 2;
        vertices[14] = this.depth / 2;
        vertices[15] = this.width / 2;
        vertices[16] = this.height / 2;
        vertices[17] = this.depth / 2;
        vertices[18] = this.width / 2;
        vertices[19] = this.height / 2;
        vertices[20] = -this.depth / 2;
        vertices[21] = -this.width / 2;
        vertices[22] = this.height / 2;
        vertices[23] = -this.depth / 2;
        indices_array.push(0);
        indices_array.push(1);
        indices_array.push(2);
        indices_array.push(3);
        indices_array.push(0);
        indices_array.push(3);
        indices_array.push(1);
        indices_array.push(2);
        indices_array.push(4);
        indices_array.push(5);
        indices_array.push(6);
        indices_array.push(7);
        indices_array.push(4);
        indices_array.push(7);
        indices_array.push(5);
        indices_array.push(6);
        indices_array.push(0);
        indices_array.push(4);
        indices_array.push(1);
        indices_array.push(5);
        indices_array.push(2);
        indices_array.push(6);
        indices_array.push(3);
        indices_array.push(7);
        this.geometry.setIndex(new THREE.BufferAttribute(new Uint16Array(indices_array), 1));
        this.geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
        this.geometry.addAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));
        this.geometry.computeBoundingSphere();
        this.mesh = new THREE.LineSegments(this.geometry, this.material);
        // this.mesh.position.set(this.position.x,this.position.y,this.position.z);
        this.Obj.add(this.mesh);
        this.positions = this.geometry.attributes.position;
        console.log(this.geometry);
        this.triangleGeomery = new THREE.BufferGeometry();
        var triangleindices = new Uint16Array([
            0, 1, 3,
            1, 3, 2,
            0 + 4, 1 + 4, 3 + 4,
            1 + 4, 3 + 4, 2 + 4,
            0, 1, 4,
            1, 4, 5,
            2, 6, 7,
            2, 3, 7,
            0, 3, 4,
            4, 7, 3
        ]);
        for (var i = 0; i < 3; i++) {
        }
        this.triangleGeomery.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
        // this.triangleGeomery.setIndex( new THREE.BufferAttribute( triangle_indices_array, 1 ) );
        this.triangleGeomery.addAttribute('index', new THREE.BufferAttribute(triangleindices, 1));
        // this.triangleGeomery.addAttribute( 'color', new THREE.BufferAttribute( colors, 4, true ) );
        // material
        var material = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            transparent: true,
            opacity: this.alpah,
            color: 0xffffff
        });
        var triagnleMesh = new THREE.Mesh(this.triangleGeomery, material);
        this.Obj.add(triagnleMesh);
        this.triangleVertices = this.triangleGeomery.attributes.position;
        this.Obj.position.set(this.position.x, this.position.y, this.position.z);
        this.scene.add(this.Obj);
    };
    WierBox.prototype.updateVertex = function () {
    };
    WierBox.prototype.setPosition = function (position) {
        this.Obj.position.set(position.x, position.y, position.z);
    };
    WierBox.prototype.updateHeadVertex = function (y) {
        console.log(this.mesh);
        this.positions.array[13] = y;
        this.positions.array[16] = y;
        this.positions.array[19] = y;
        this.positions.array[22] = y;
        this.triangleVertices.array[13] = y;
        this.triangleVertices.array[16] = y;
        this.triangleVertices.array[19] = y;
        this.triangleVertices.array[22] = y;
        this.triangleVertices.needsUpdate = true;
        this.positions.needsUpdate = true;
    };
    WierBox.prototype.update = function () {
        var p = this.Obj.position;
        p.z--;
        // this.Obj.rotateX(0.1)
        // this.Obj.position.set(
    };
    return WierBox;
}());
//# sourceMappingURL=WireBox.js.map