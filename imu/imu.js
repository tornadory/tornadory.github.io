var imudatainfo = $('#imudata');

if (window.DeviceOrientationEvent) {
  console.log("window.DeviceOrientationEvent supported"); //this way
    window.addEventListener("deviceorientation", function () {
        imudatainfo.innerHTML = event.beta + " - " + event.gamma;
        console.log("window.DeviceOrientationEvent " + event.beta + " - " + event.gamma);
        console.log(event);
        // tilt([event.beta, event.gamma]);
    }, true);
} else if (window.DeviceMotionEvent) {
  console.log("window.DeviceMotionEvent supported");
    window.addEventListener('devicemotion', function () {
        // tilt([event.acceleration.x * 2, event.acceleration.y * 2]);
        imudatainfo.innerHTML = event.acceleration.x * 2 + " - " + event.acceleration.y * 2;
    }, true);
} else {
    console.log("no gyro supported");
    imudatainfo.innerHTML = "no gyro support";
    // window.addEventListener("MozOrientation", function () {
    //     // tilt([orientation.x * 50, orientation.y * 50]);
    //     imudatainfo.innerHTML = orientation.x * 50 +"- " + orientation.y * 50;
    // }, true);
}
