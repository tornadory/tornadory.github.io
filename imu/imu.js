var imudatainfo = $('#imudata');

if (window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", function () {
        imudatainfo.innerHTML = event.beta + " - " + event.gamma;
        tilt([event.beta, event.gamma]);
    }, true);
} else if (window.DeviceMotionEvent) {
    window.addEventListener('devicemotion', function () {
        tilt([event.acceleration.x * 2, event.acceleration.y * 2]);
        imudatainfo.innerHTML = event.acceleration.x * 2 + " - " + event.acceleration.y * 2;
    }, true);
} else {
    window.addEventListener("MozOrientation", function () {
        tilt([orientation.x * 50, orientation.y * 50]);
        imudatainfo.innerHTML = orientation.x * 50 +"- " + orientation.y * 50;
    }, true);
}
