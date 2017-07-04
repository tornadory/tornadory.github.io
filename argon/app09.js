var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera();
var stage = new THREE.Object3D;
scene.add(camera);
scene.add(stage);

var renderer = new THREE.WebGLRenderer();
var box = new THREE.Object3D();
var loader = new THREE.TextureLoader();
loader.load('box.png', function (texture) {
    var geometry = new THREE.BoxGeometry(10, 10, 10);
    var material = new THREE.MeshBasicMaterial({ map: texture });
    var mesh = new THREE.Mesh(geometry, material);
    box.add(mesh);
});
box.position.x = 0;
box.position.y = 2;
box.position.z = 1;

scene.add(box);

function anim(){
  requestAnimationFrame(anim);
  box.rotateY += 0.1;
  renderer.render(scene, camera);
}

anim();
