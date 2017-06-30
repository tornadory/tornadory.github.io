// initialize Argon
var app = Argon.init();

// this app uses geoposed content, so subscribe to geolocation updates
app.context.subscribeGeolocation();
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

//1
// The CSS3DArgonRenderer supports mono and stereo views, and
// includes both 3D elements and a place to put things that appear
// fixed to the screen (heads-up-display)
// var renderer = new THREE.CSS3DArgonRenderer();
// app.view.element.appendChild(renderer.domElement);


//2
// We use the standard WebGLRenderer when we only need WebGL-based content
var renderer = new THREE.WebGLRenderer({
    alpha: true,
    logarithmicDepthBuffer: true,
    antialias: Argon.suggestedWebGLContextAntialiasAttribute
});

// to easily control stuff on the display
//var hud = new THREE.CSS3DArgonHUD();
// var description = document.getElementById('description');
// hud.hudElements[0].appendChild(description);
// app.view.element.appendChild(hud.domElement);


var sunMoonLights = new THREE.SunMoonLights();
// the SunMoonLights.update routine will add/remove the sun/moon lights depending on if
// the sun/moon are above the horizon
scene.add(sunMoonLights.lights);
// add some ambient so things aren't so harshly illuminated
var ambientlight = new THREE.AmbientLight(0x404040); // soft white ambient light
scene.add(ambientlight);

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

    // get sun and moon positions, add/remove lights as necessary
    var date = app.context.time;
    sunMoonLights.update(date, app.context.defaultReferenceFrame);
});


// renderEvent is fired whenever argon wants the app to update its display
app.renderEvent.addEventListener(function () {
    // set the renderer to know the current size of the viewport.
    // This is the full size of the viewport, which would include
    // both views if we are in stereo viewing mode
    var view = app.view;
    renderer.setSize(view.renderWidth, view.renderHeight, false);
    renderer.setPixelRatio(app.suggestedPixelRatio);
    var viewport = view.viewport;
    //hud.setSize(viewport.width, viewport.height);
    // There is 1 subview in monocular mode, 2 in stereo mode.
    // If we are in mono view, show the description.  If not, hide it,
    if (app.view.subviews.length > 1) {
        holder.style.display = 'none';
    }
    else {
        holder.style.display = 'block';
    }
    // there is 1 subview in monocular mode, 2 in stereo mode
    for (var _i = 0, _a = app.view.subviews; _i < _a.length; _i++) {
        var subview = _a[_i];
        // set the position and orientation of the camera for
        // this subview
        camera.position.copy(subview.pose.position);
        camera.quaternion.copy(subview.pose.orientation);
        // the underlying system provide a full projection matrix
        // for the camera.
        camera.projectionMatrix.fromArray(subview.frustum.projectionMatrix);
        // set the viewport for this view
        var _b = subview.renderViewport, x = _b.x, y = _b.y, width = _b.width, height = _b.height;
        renderer.setViewport(x, y, width, height);
        // set the webGL rendering parameters and render this view
        renderer.setScissor(x, y, width, height);
        renderer.setScissorTest(true);
        renderer.render(scene, camera);
        // adjust the hud
        var _c = subview.viewport, x = _c.x, y = _c.y, width = _c.width, height = _c.height;
        //hud.setViewport(x, y, width, height, subview.index);
        //hud.render(subview.index);
    }
    stats.update();
});


// for the CSS renderer, we want to use requestAnimationFrame to
// limit the number of repairs of the DOM.  Otherwise, as the
// DOM elements are updated, extra repairs of the DOM could be
// initiated.  Extra repairs do not appear to happen within the
// animation callback.
// var viewport = null;
// var subViews = null;
// var rAFpending = false;
// app.renderEvent.addEventListener(function () {
//     // only schedule a new callback if the old one has completed
//     if (!rAFpending) {
//         rAFpending = true;
//         viewport = app.view.viewport;
//         subViews = app.view.subviews;
//         window.requestAnimationFrame(renderFunc);
//     }
// });
// the animation callback.
function renderFunc() {
    // if we have 1 subView, we're in mono mode.  If more, stereo.
    var monoMode = subViews.length == 1;
    rAFpending = false;
    // set the renderer to know the current size of the viewport.
    // This is the full size of the viewport, which would include
    // both views if we are in stereo viewing mode
    renderer.setSize(viewport.width, viewport.height);
    hud.setSize(viewport.width, viewport.height);
    // there is 1 subview in monocular mode, 2 in stereo mode
    for (var _i = 0, subViews_1 = subViews; _i < subViews_1.length; _i++) {
        var subview = subViews_1[_i];
        // set the position and orientation of the camera for
        // this subview
        camera.position.copy(subview.pose.position);
        camera.quaternion.copy(subview.pose.orientation);
        // the underlying system provides a full projection matrix
        // for the camera.  Use it, and then update the FOV of the
        // camera from it (needed by the CSS Perspective DIV)
        camera.projectionMatrix.fromArray(subview.frustum.projectionMatrix);
        camera.fov = subview.frustum.fovy * 180 / Math.PI;
        // set the viewport for this view
        var _a = subview.viewport, x = _a.x, y = _a.y, width = _a.width, height = _a.height;
        renderer.setViewport(x, y, width, height, subview.index);
        // render this view.
        renderer.render(scene, camera, subview.index);
        // adjust the hud, but only in mono
        if (monoMode) {
            hud.setViewport(x, y, width, height, subview.index);
            hud.render(subview.index);
        }
    }
}



// var renderer = new THREE.WebGLRenderer({
//     alpha: true,
//     logarithmicDepthBuffer: true
// });
// renderer.setPixelRatio(window.devicePixelRatio);
// app.view.element.appendChild(renderer.domElement);
