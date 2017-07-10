var container = document.querySelector('#webgl-container');
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
  75,
  container.clientWidth / container.clientHeight,
  0.1, 1000
);
var renderer = new THREE.WebGLRenderer();

var geometry = new THREE.BoxGeometry(2,2,2);
var material = new THREE.MeshBasicMaterial({color:'red'});
var mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);
camera.position.z = 10;

var loop = function(){
  //console.log('hello');
  requestAnimationFrame(loop);
  mesh.rotation.x += 0.1;
  mesh.rotation.y += 0.1;

  renderer.render(scene, camera);
}

loop();
renderer.setSize(300, 300);
container.appendChild(renderer.domElement);
