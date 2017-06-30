// initialize Argon
var app = Argon.init();

//app.context.setDefaultReferenceFrame(app.context.localOriginEastUpSouth);

// initialize THREE
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera();
var stage = new THREE.Object3D;
scene.add(camera);
scene.add(stage);

var boxGeoObject = new THREE.Object3D();
var box = new THREE.Object3D();
var loader = new THREE.TextureLoader();
loader.load( "box.png", function ( texture ) {
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial( { map: texture } );
    var mesh = new THREE.Mesh( geometry, material );
    box.add( mesh );
    console.log("box.png loaded success");
});
boxGeoObject.add(box);
stage.add(boxGeoObject);
//scene.add(boxGeoObject);

// The CSS3DArgonRenderer supports mono and stereo views, and
// includes both 3D elements and a place to put things that appear
// fixed to the screen (heads-up-display)
var renderer = new THREE.CSS3DArgonRenderer();
app.view.element.appendChild(renderer.domElement);

// to easily control stuff on the display
var hud = new THREE.CSS3DArgonHUD();
// var description = document.getElementById('description');
// hud.hudElements[0].appendChild(description);
// app.view.element.appendChild(hud.domElement);


// the updateEvent is called each time the 3D world should be
// rendered, before the renderEvent.  The state of your application
// should be updated here.
app.updateEvent.addEventListener(function () {
    // get the pose of the "stage" to anchor our content.
    // The "stage" defines an East-Up-South coordinate system
    // (assuming geolocation is available).
    var stagePose = app.context.getEntityPose(app.context.stage);
    // set the pose of our THREE stage object
    if (stagePose.poseStatus & Argon.PoseStatus.KNOWN) {
        stage.position.copy(stagePose.position);
        stage.quaternion.copy(stagePose.orientation);
    }
});



// var renderer = new THREE.WebGLRenderer({
//     alpha: true,
//     logarithmicDepthBuffer: true
// });
// renderer.setPixelRatio(window.devicePixelRatio);
// app.view.element.appendChild(renderer.domElement);
