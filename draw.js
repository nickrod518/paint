var mouseDown = false;
var x1 = 0;
var y1 = 0;
var r = 0;
var loaded = false;
var currentPicture = 0;

function draw() {
    var canvas  = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var tool = document.getElementById("tools");
    var color = document.getElementById("color");
    var width = document.getElementById("width");
    var pictureButton = document.getElementById("picture");
    var clearButton = document.getElementById("clear");
    var saveButton = document.getElementById("save");
    ctx.lineJoin = "round";
    ctx.strokeStyle = color.value;
    ctx.fillStyle = color.value;
    ctx.lineWidth = width.value;
    
    if (!loaded || (currentPicture != picture.value)) {
        var img = new Image();
        img.onload = function(){
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
        }
        img.src = "http://nickrod518.dyndns.org/images/" + picture.value + ".jpg";
        loaded = true;
        currentPicture = picture.value;
    }
    
    saveButton.onclick = function save() {
        window.location = canvas.toDataURL();
    }
    
    clearButton.onclick = function clear() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        loaded = false;
    }
    
    canvas.onmousedown = function(mouseEvent) {
        if (tool.value == "brush") {
            mouseDown = true;
            
            ctx.beginPath();
            ctx.arc(mouseEvent.clientX-canvas.offsetLeft, mouseEvent.clientY-canvas.offsetTop, width.value/2, 0, 2*Math.PI);
            ctx.closePath();
            ctx.fill();
            ctx.beginPath();
            ctx.stroke();
        }
        if (tool.value == "line") {
            ctx.beginPath();
            ctx.moveTo(mouseEvent.clientX-canvas.offsetLeft, mouseEvent.clientY-canvas.offsetTop);
        }
        if ((tool.value == "circle") || (tool.value == "rectangle")) {
            x1 = mouseEvent.clientX-canvas.offsetLeft;
            y1 = mouseEvent.clientY-canvas.offsetTop;
        }
    }
    
    canvas.onmousemove = function(mouseEvent) {
        if (tool.value == "brush" && mouseDown) {
            ctx.lineTo(mouseEvent.clientX-canvas.offsetLeft, mouseEvent.clientY-canvas.offsetTop);
            ctx.stroke();
        }
    }
    
    canvas.onmouseup = function(mouseEvent) {
        if (tool.value == "brush") {
            ctx.closePath();
            mouseDown = false;
            ctx.beginPath();
            ctx.arc(mouseEvent.clientX-canvas.offsetLeft, mouseEvent.clientY-canvas.offsetTop, width.value/2, 0, 2*Math.PI);
            ctx.closePath();
            ctx.fill();
        }
        if (tool.value == "line") {
            ctx.lineTo(mouseEvent.clientX-canvas.offsetLeft, mouseEvent.clientY-canvas.offsetTop);
            ctx.stroke();
            ctx.closePath();
        }
        if (tool.value == "circle") {
            ctx.beginPath();
            r = Math.sqrt(Math.pow(mouseEvent.clientX-canvas.offsetLeft-x1, 2) + Math.pow(mouseEvent.clientY-canvas.offsetTop-y1, 2));
            ctx.arc(x1, y1, r, 0, 2*Math.PI);
            ctx.closePath();
            ctx.fill();
            x1 = 0;
            y1 = 0;
            r = 0;
        }
    }
    
    canvas.onmouseout = function(mouseEvent) {
        if (tool.value == "brush" && mouseDown) {
            ctx.closePath();
        }
    }
    
    canvas.onmouseover = function(mouseEvent) {
        if (tool.value == "brush" && mouseDown) {
            ctx.beginPath();
            ctx.stroke();
        }
    }
    
    window.onmouseup = function(mouseEvent) {
        mouseDown = false;
    }

    setTimeout(draw, 10);
}

window.onload = draw;