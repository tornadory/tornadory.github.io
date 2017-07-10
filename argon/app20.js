var Cesium = Argon.Cesium;
var Cartesian3 = Argon.Cesium.Cartesian3;
var ReferenceFrame = Argon.Cesium.JulianDate;
var CesiumMath = Argon.Cesium.CesiumMath;

var app = Argon.init();

app.context.setDefaultReferenceFrame(app.context.localOriginEastUpSouth);

var scene = new THREE.Scene();
var camera = THREE.PerspectiveCamera();
var userLocation = new THREE.Object3D;
scene.add(camera);
scene.add(userLocation);

var renderer = new THREE.WebGLRenderer({
  alpha: true,
  logarithmicDepthBuffer: true
});
renderer.setPixelRatio(window.devicePixelRatio);
app.view.element.appendChild(renderer.domElement);

//location
var locationElement = document.getElementById("location");
var boxGeoObject = new THREE.Object3D();
var box = new THREE.Object3D();
var loader = new THREE.TextureLoader();
loader.load('box.png', function(texture){
  var geometry = new THREE.BoxGeometry(1,1,1);
  var material = new THREE.MeshBasicMaterial({map:texture});
  var mesh = new THREE.Mesh(geometry, material);
  box.add(mesh);
});
boxGeoObject.add(box);

var boxGeoEntity = new Argon.Cesium.Entity({
  name:"box entity",
  position: Cartesian3.ZERO,
  orientation: Cesium.Quaternion.IDENTITY
});

var boxInit = false;

app.updateEvent.addEventListener(function(frame){
  //
  var userPos = app.context.getEntityPose(app.context.user);
  if(userPos.poseStatus & Argon.PoseStatus.KNOWN){
    userLocation.position.copy(userPos.position);
  }else{
    return;
  }

  if(!boxInit){
    var defaultFrame = app.context.getDefaultReferenceFrame();
    var boxPos = userPos.position.clone();
    boxPos.x += 10;
    boxGeoEntity.position.setValue(boxPos, defaultFrame);
    boxGeoEntity.orientation.setValue(Cesium.Quaternion.IDENTITY);
    if(Argon.convertEntityReferenceFrame(boxGeoEntity, frame.time, ReferenceFrame.FIXED)){
      scene.add(boxGeoEntity);
      boxInit = true;
    }
  }
  var boxPos = app.context.getEntityPose(boxGeoEntity);
  boxGeoObject.position.copy(boxPos.position);
  boxGeoObject.quaternion.copy(boxPos.orientation);
  box.rotationY(3*frame.deltaTime/10000);
});

app.renderEvent.addEventListener(function(){
  var viewport = app.view.getViewport();
  renderer.setSize(viewport.width, viewport.height);
  for(var _i =0, _a = app.view.getSubviews(); _i < _a.length; _i++){
    var subview = _a[_i];
    var frustum = subview.frustum;
    camera.position.copy(subview.pose.position);
    camera.position.copy(subview.pose.position);
    camera.projectionMatrix.fromArray(subview.projectionMatrix);
    var _b = subview.viewport,x=_b.x, y=_b.y,width=_b.width,height=_b.height;

    renderer.setViewport(x,y,width,height);
    renderer.setScissor(x,y,width,height);
    renderer.setScissorTest(true);
    renderer.render(scene, camera);
  }
});
