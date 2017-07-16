var camera, scene, renderer;
var mesh;
var verticalMirror;
init();
animate();

function init() {
    
    //make an array camera
    var AMOUNT = 2;
	var SIZE = 1 / AMOUNT;
	var ASPECT_RATIO = window.innerWidth / 2 / window.innerHeight;
	var cameras = [];
    for ( var x = 0; x < AMOUNT; x ++ ) {
		var subcamera = new THREE.PerspectiveCamera( 40, ASPECT_RATIO, 0.1, 10 );
		subcamera.bounds = new THREE.Vector4( x / AMOUNT, 0, SIZE, 1 );
		subcamera.position.x = ( x / AMOUNT ) - 0.5;
		subcamera.position.y = 0;
		subcamera.position.z = 1.5;
		subcamera.position.multiplyScalar( 2 );
		subcamera.lookAt( new THREE.Vector3() );
		subcamera.updateMatrixWorld();
		cameras.push( subcamera );
    }
	/*for ( var y = 0; y < AMOUNT; y ++ ) {
		for ( var x = 0; x < AMOUNT; x ++ ) {
			var subcamera = new THREE.PerspectiveCamera( 40, ASPECT_RATIO, 0.1, 10 );
			subcamera.bounds = new THREE.Vector4( x / AMOUNT, y / AMOUNT, SIZE, SIZE );
			subcamera.position.x = ( x / AMOUNT ) - 0.5;
			subcamera.position.y = 0.5 - ( y / AMOUNT );
			subcamera.position.z = 1.5;
			subcamera.position.multiplyScalar( 2 );
			subcamera.lookAt( new THREE.Vector3() );
			subcamera.updateMatrixWorld();
			cameras.push( subcamera );
		}
	}*/
	//camera = new THREE.ArrayCamera( cameras );
    camera = new THREE.PerspectiveCamera( 40, ASPECT_RATIO, 0.1, 10 );
	camera.position.z = 3;
	scene = new THREE.Scene();
    
	scene.add( new THREE.AmbientLight( 0x222244 ) );
    
	var light = new THREE.DirectionalLight();
	light.position.set( 0.5, 0.5, 1 );
	light.castShadow = true;
	light.shadow.camera.zoom = 4; // tighter shadow map
	scene.add( light );
    
	var geometry = new THREE.PlaneBufferGeometry( 100, 100 );
    var material = new THREE.MeshPhongMaterial( { color: 0x000066 } );
    var background = new THREE.Mesh( geometry, material );
	background.receiveShadow = true;
	background.position.set( 0, 0, - 1 );
	scene.add( background );
	
    
    var geometry = new THREE.CylinderBufferGeometry( 0.5, 0.5, 1, 32 );
	//var material = new THREE.MeshPhongMaterial( { color: 0xff0000 } );
//    var textureLoader = new THREE.TextureLoader();
//    var creatureImage = textureLoader.load('texture.png');
//    creatureImage.magFilter = THREE.NearestFilter;
//    var material = new THREE.ShaderMaterial({
//        uniforms: THREE.UniformsUtils.merge([
//            THREE.UniformsLib['lights'],
//            {
//                lightIntensity: {type: 'f', value: 1.0},
//                textureSampler: {type: 't', value: null}
//            }
//        ]),
//        vertexShader: document.getElementById('vertShader').text,
//        fragmentShader: document.getElementById('fragShader').text,
//        transparent: true,
//        lights: true
//    });
    var textureLoader = new THREE.TextureLoader();
    var uniforms = {

					fogDensity: { value: 0.45 },
					fogColor:   { value: new THREE.Vector3( 0, 0, 0 ) },
					time:       { value: 1.0 },
					resolution: { value: new THREE.Vector2() },
					uvScale:    { value: new THREE.Vector2( 3.0, 1.0 ) },
					texture1:   { value: textureLoader.load( "cloud.png" ) },
					texture2:   { value: textureLoader.load( "lavatile.jpg" ) }

				};

    uniforms.texture1.value.wrapS = uniforms.texture1.value.wrapT = THREE.RepeatWrapping;
	uniforms.texture2.value.wrapS = uniforms.texture2.value.wrapT = THREE.RepeatWrapping;
    
    var material = new THREE.ShaderMaterial( {

					uniforms: uniforms,
					vertexShader: document.getElementById( 'vertexShader' ).textContent,
					fragmentShader: document.getElementById( 'fragmentShader' ).textContent

				} );
    //material.uniforms.textureSampler.value = creatureImage;
	mesh = new THREE.Mesh( geometry, material );
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	scene.add( mesh );
    
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.shadowMap.enabled = true;
    //renderer.vr.enabled = true;
    
    //to create stere mode
    //effect = new THREE.StereoEffect( renderer );
    //effect.setSize( window.innerWidth, window.innerHeight );
    
    
    // MIRROR

//    verticalMirror = new THREE.Mirror( renderer, camera, { clipBias: 0.003, textureWidth: 1024, textureHeight: 1024, color:0x889999 } );
//
//    var verticalMirrorMesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 300, 300 ), verticalMirror.material );
//    verticalMirrorMesh.add( verticalMirror );
//    verticalMirrorMesh.position.y = 100;
//    verticalMirrorMesh.position.z = -500;
//    scene.add( verticalMirrorMesh );
    
	//document.body.appendChild( renderer.domElement );
    $("#webgl-container").append(renderer.domElement);
	//
	window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
	mesh.rotation.x += 0.005;
	mesh.rotation.z += 0.01;
    
    //stere effect
    //effect.render( scene, camera );
	
    renderer.render( scene, camera );
    
    //verticalMirror.render();
	
    requestAnimationFrame( animate );
}







//// Global variables
//
//// scene size
//var WIDTH = 800;
//var HEIGHT = 600;
//
//// camera
//var VIEW_ANGLE = 45;
//var ASPECT = WIDTH / HEIGHT;
//var NEAR = 1;
//var FAR = 500;
//
//// scene
//var camera;
//var renderer;
//var scene;
//
//var cameraControls;
//
//var verticalMirror;
//var sphereGroup;
//
//var doAnimate = true;
//
//$("#animate").click(
//    function () {
//        doAnimate = !doAnimate;
//});
//
//function init() {
//
//    //RENDERER
//    renderer = new THREE.WebGLRenderer();
//    renderer.setSize(WIDTH, HEIGHT);
//
//    renderer.autoClear = true;
//    renderer.setClearColor(0x000000, 1.0);
//
//    //SCENE
//    scene = new THREE.Scene();
//
//    //CAMERA
//    camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
//    camera.position.set(0, 75, 160);
//
//    cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
//    cameraControls.target.set(0.0, 40.0, 0.0);
//    cameraControls.autoRotate = !true;
//    cameraControls.maxDistance = 400;
//    cameraControls.minDistance = 10;
//    cameraControls.update();
//
//    var $container = $('#container');
//    $container.append(renderer.domElement);
//}
//
//function fillScene() {
//    
//   //MIRORR plane
//	verticalMirror = new THREE.FlatMirror(renderer, camera, {clipBias: 0.003, textureWidth: 800, textureHeight: 600, color:0x889999} );
//	
//    var verticalMirrorMesh = new THREE.Mesh(new THREE.PlaneGeometry(60, 40 ), verticalMirror.material );
//	verticalMirrorMesh.add(verticalMirror);
//	verticalMirrorMesh.position.y = 25;
//	verticalMirrorMesh.position.z = -45;
//	scene.add(verticalMirrorMesh);	
//
//	// some decorative spheres
//    var sphereCap = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 15*Math.cos(Math.PI/180*30), 0.1, 24 , 1), new THREE.MeshPhongMaterial({color: 0x673454}) );
//	sphereCap.position.y = -15 * Math.sin(Math.PI/180*30) - 0.05;
//	sphereCap.rotateX(-Math.PI);
//	
//	var halfSphere = new THREE.Mesh(new THREE.SphereGeometry(15, 24, 24, Math.PI/2, Math.PI*2.0, 0, Math.PI/180*120), new THREE.MeshPhongMaterial({color: 0x673454, ambient: 0xFFFFFF, emissive: 0x111111}) );
//	halfSphere.add(sphereCap);
//	halfSphere.rotateX(-Math.PI / 180*135); 
//	halfSphere.rotateZ(-Math.PI / 180*20); 
//	halfSphere.position.y = 7.5 + 15 * Math.sin(Math.PI/180*30);
//	
//	sphereGroup = new THREE.Object3D();
//	sphereGroup.add(halfSphere)
//	scene.add(sphereGroup);	
//	
//    var smallSphere = new THREE.Mesh(new THREE.SphereGeometry(5, 4, 4), new THREE.MeshBasicMaterial({color: 0xFFFFFF, wireframe: true}) );
//	smallSphere.position.set(-45,4.9,45);
//    scene.add(smallSphere);	
//	
//	// walls
//    var planeGeo = new THREE.PlaneGeometry(100.1, 100.1);
//    
//    var planeFloor = new THREE.Mesh( planeGeo, new THREE.MeshPhongMaterial({color: 0xffffff}) );
//	planeFloor.rotateX(-Math.PI/2);
//	scene.add(planeFloor);
//    
//    var planeTop = new THREE.Mesh( planeGeo, new THREE.MeshPhongMaterial({color: 0xffffff}) );
//	planeTop.position.y = 100;
//	planeTop.rotateX(Math.PI/2);
//	scene.add(planeTop);
//	
//	var planeBack = new THREE.Mesh( planeGeo, new THREE.MeshPhongMaterial({color: 0xffffff}) );
//	planeBack.position.z = -50;
//	planeBack.position.y = 50;
//	scene.add(planeBack);
//	
//	var planeFront = new THREE.Mesh( planeGeo, new THREE.MeshPhongMaterial({color: 0x7f7fff}) );
//	planeFront.position.z = 50;
//	planeFront.position.y = 50;
//	planeFront.rotateY(Math.PI);
//	scene.add(planeFront);
//	
//	var planeRight = new THREE.Mesh( planeGeo, new THREE.MeshPhongMaterial({color: 0x00ff00}) );
//	planeRight.position.x = 50;
//	planeRight.position.y = 50;
//	planeRight.rotateY(-Math.PI/2);
//	scene.add(planeRight);
//	
//	var planeLeft = new THREE.Mesh( planeGeo, new THREE.MeshPhongMaterial({color: 0xff0000}) );
//	planeLeft.position.x = -50;
//	planeLeft.position.y = 50;
//	planeLeft.rotateY(Math.PI/2);
//	scene.add(planeLeft);
//    
//    //lights
//    var mainLight = new THREE.PointLight(0xcccccc, 1.2, 250);
//	mainLight.position.y = 80.0;
//	scene.add(mainLight);
//
//	var greenLight = new THREE.PointLight(0x00ff00, 30.0, 540);
//	greenLight.position.set(550.0, 50.0, 0.0);
//	scene.add(greenLight);
//
//	var redLight = new THREE.PointLight(0xff0000, 30.0, 540);
//	redLight.position.set(-550.0, 50.0, 0.0);
//	scene.add(redLight);
//}
//
//
//function render() {
//    //render (update) the mirror
//    verticalMirror.render();
//    
//    renderer.render(scene, camera);
//}
//
//function update() {
//    
//    window.requestAnimationFrame(update);
//
//    if (doAnimate) {
//        sphereGroup.rotation.y -= 0.002;
//    }
//
//    cameraControls.update();
//    
//    render();
//}
//
//init();
//fillScene();
//update();