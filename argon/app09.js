
var app = Argon.init();
//app.view.element.style.zIndex = 0;
// this app uses geoposed content, so subscribe to geolocation updates
// app.context.subscribeGeolocation({ enableHighAccuracy: true });

// app.context.setDefaultReferenceFrame(app.context.localOriginEastUpSouth);



var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera();
var stage = new THREE.Object3D;
scene.add(camera);
scene.add(stage);

var renderer = new THREE.WebGLRenderer({
    alpha: true,
    logarithmicDepthBuffer: true,
    antialias: Argon.suggestedWebGLContextAntialiasAttribute
});
renderer.setPixelRatio(window.devicePixelRatio);

app.context.setDefaultReferenceFrame(app.context.localOriginEastUpSouth);

var boxGeoObject = new THREE.Object3D;
var box = new THREE.Object3D();
var loader = new THREE.TextureLoader();
loader.load('box.png', function (texture) {
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({ map: texture });
    var mesh = new THREE.Mesh(geometry, material);
    box.add(mesh);
});

boxGeoObject.add(box);
boxGeoObject.position.z = -10;
boxGeoObject.position.x = 5;
boxGeoObject.position.y = 5;
scene.add(boxGeoObject);


app.updateEvent.addEventListener(function (frame) {

    // get the pose of the "stage" to anchor our content.
    // The "stage" defines an East-Up-South coordinate system
    // (assuming geolocation is available).
    var stagePose = app.context.getEntityPose(app.context.stage);
    // set the pose of our THREE stage object
    if (stagePose.poseStatus & Argon.PoseStatus.KNOWN) {
        stage.position.copy(stagePose.position);
        stage.quaternion.copy(stagePose.orientation);
    }
    // the first time through, we create a geospatial position for
    // the box somewhere near us
    if (!boxInit) {
        var userPose = app.context.getEntityPose(app.context.user);

        var defaultFrame = app.context.getDefaultReferenceFrame();
        // set the box's position to 10 meters away from the user.
        // First, clone the userPose postion, and add 10 to the X
        var boxPos_1 = userPose.position.clone();
        boxPos_1.z -= 10;
        // set the value of the box Entity to this local position, by
        // specifying the frame of reference to our local frame
        boxGeoEntity.position.setValue(boxPos_1, defaultFrame);
        if (Argon.convertEntityReferenceFrame(boxGeoEntity, frame.time, ReferenceFrame.FIXED)) {
            // we will keep trying to reset it to FIXED until it works!
            boxInit = true;
        }
    }
    // get the local coordinates of the local box, and set the THREE object
    var boxPose = app.context.getEntityPose(boxGeoEntity);
    if (boxPose.poseStatus & Argon.PoseStatus.KNOWN) {
        boxGeoObject.position.copy(boxPose.position);
        boxGeoObject.quaternion.copy(boxPose.orientation);
    }
    // get the local coordinates of the GT box, and set the THREE object
    var geoPose = app.context.getEntityPose(gatechGeoEntity);
    if (geoPose.poseStatus & Argon.PoseStatus.KNOWN) {
        gatechGeoTarget.position.copy(geoPose.position);
    }
    else {
        // initialize to a fixed location in case we can't convert to geospatial
        gatechGeoTarget.position.y = 0;
        gatechGeoTarget.position.z = -4000;
        gatechGeoTarget.position.x = 1000;
    }
    // rotate the boxes at a constant speed, independent of frame rates
    // to make it a little less boring
    box.rotateY(3 * frame.deltaTime / 10000);
});
// renderEvent is fired whenever argon wants the app to update its display
app.renderEvent.addEventListener(function () {
    // set the renderers to know the current size of the viewport.
    // This is the full size of the viewport, which would include
    // both views if we are in stereo viewing mode
    var view = app.view;
    renderer.setSize(view.renderWidth, view.renderHeight, false);
    renderer.setPixelRatio(app.suggestedPixelRatio);
    var viewport = view.viewport;
    // there is 1 subview in monocular mode, 2 in stereo mode
    for (var _i = 0, _a = app.view.subviews; _i < _a.length; _i++) {
        var subview = _a[_i];
        var frustum = subview.frustum;
        // set the position and orientation of the camera for
        // this subview
        camera.position.copy(subview.pose.position);
        camera.quaternion.copy(subview.pose.orientation);
        // the underlying system provide a full projection matrix
        // for the camera.
        camera.projectionMatrix.fromArray(subview.frustum.projectionMatrix);
        // set the webGL rendering parameters and render this view
        // set the viewport for this view
        var _b = subview.renderViewport, x = _b.x, y = _b.y, width = _b.width, height = _b.height;
        renderer.setViewport(x, y, width, height);
        renderer.setScissor(x, y, width, height);
        renderer.setScissorTest(true);
        renderer.render(scene, camera);
        // set the viewport for this view
        var _c = subview.viewport, x = _c.x, y = _c.y, width = _c.width, height = _c.height;
        // set the CSS rendering up, by computing the FOV, and render this view
        camera.fov = THREE.Math.radToDeg(frustum.fovy);
        // adjust the hud
        hud.setViewport(x, y, width, height, subview.index);
        hud.render(subview.index);
    }
});
