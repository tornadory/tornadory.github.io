
var app = Argon.init();

var container = document.querySelector('#hud');

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75,
container.clientWidth / container.clientHeight,
0.1, 1000);
// var stage = new THREE.Object3D;
scene.add(camera);
// scene.add(stage);

var renderer = new THREE.WebGLRenderer();

// var boxGeoObject = new THREE.Object3D;
// var box = new THREE.Object3D();
// var loader = new THREE.TextureLoader();
// loader.load('box.png', function (texture) {
//     var geometry = new THREE.BoxGeometry(2, 2, 2);
//     var material = new THREE.MeshBasicMaterial({ map: texture });
//     var mesh = new THREE.Mesh(geometry, material);
//     box.add(mesh);
// });
// scene.add(box);

var geometry = new THREE.BoxGeometry(2,2,2);
var material = new THREE.MeshBasicMaterial({color:'red'});
var mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);
mesh.position.z = -3;

app.view.setLayers([
    { source: renderer.domElement }
]);


// boxGeoObject.add(box);
// boxGeoObject.position.z = 2;
// boxGeoObject.position.x = 2;
// boxGeoObject.position.y = 2;

// boxGeoObject.position = new THREE.Vector3(5,0,5);
camera.position.z = 10;
container.appendChild(renderer.domElement);
app.updateEvent.addEventListener(function (frame) {

    // get the pose of the "stage" to anchor our content.
    // The "stage" defines an East-Up-South coordinate system
    // (assuming geolocation is available).
    // var stagePose = app.context.getEntityPose(app.context.stage);
    // // set the pose of our THREE stage object
    // if (stagePose.poseStatus & Argon.PoseStatus.KNOWN) {
    //     stage.position.copy(stagePose.position);
    //     stage.quaternion.copy(stagePose.orientation);
    // }

    mesh.rotateY(3 * frame.deltaTime / 10000);
});


// renderEvent is fired whenever argon wants the app to update its display
app.renderEvent.addEventListener(function () {

    // set the renderers to know the current size of the viewport.
    // This is the full size of the viewport, which would include
    // both views if we are in stereo viewing mode
    // var view = app.view;
    // renderer.setSize(view.renderWidth, view.renderHeight, false);
    // renderer.setPixelRatio(app.suggestedPixelRatio);
    // var viewport = view.viewport;
    // // there is 1 subview in monocular mode, 2 in stereo mode
    // for (var _i = 0, _a = app.view.subviews; _i < _a.length; _i++) {
    //     var subview = _a[_i];
    //     var frustum = subview.frustum;
    //     // set the position and orientation of the camera for
    //     // this subview
    //     console.log("subview pos " + subview.pose.position);
    //     camera.position.copy(subview.pose.position);
    //     camera.quaternion.copy(subview.pose.orientation);
    //     // the underlying system provide a full projection matrix
    //     // for the camera.
    //     // camera.projectionMatrix.fromArray(subview.frustum.projectionMatrix);
    //     // set the webGL rendering parameters and render this view
    //     // set the viewport for this view
    //     var _b = subview.renderViewport, x = _b.x, y = _b.y, width = _b.width, height = _b.height;
    //     renderer.setViewport(x, y, width, height);
    //     renderer.setScissor(x, y, width, height);
    //     renderer.setScissorTest(true);
    //     renderer.render(scene, camera);
    //
    // }
});


var loop = function(){
  //console.log('hello');
  requestAnimationFrame(loop);
  //box.rotation.x += 0.1;
  //box.rotation.y += 0.1;
  renderer.render(scene, camera);
}

loop();
renderer.setSize(300, 300);
