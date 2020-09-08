var width = window.innerWidth;
var height = window.innerHeight;
const canvas = document.querySelector(".mfuckingDragon");
canvas.width = width, canvas.height = height;
var sc = 1;
var fractalPath;

class VirtualPen {
    x=0
    y=0
    /**@type {Path2D}*/
    ctx
    dir=3

    constructor(ctx) {
        if(!ctx) {this.ctx = new Path2D();} else {
            this.ctx = ctx;
            ctx.beginPath();
        };
    }

    move(x, y) {
        this.virtualMove(x,y);
        this.ctx.moveTo(this.x,this.y);
    }
    virtualMove(x, y) {
        this.x += x;
        this.y += y;
    }
    line(x, y) {
        this.virtualMove(x,y);
        this.ctx.lineTo(this.x, this.y)
        //console.log(this.x, this.y);
    }
    left() {
        this.dir = this.dir-1>0 ? this.dir-1 : 4;
    }
    right() {
        this.dir = this.dir+1<5 ? this.dir+1 : 1;
    }
    fwdLine(lineLength) {
        var x = this.dir == 1 ? 1 : this.dir == 3 ? -1 : 0;
        var y = this.dir == 4 ? -1 : this.dir == 2 ? 1 : 0;
        x *= lineLength;
        y *= lineLength;
        

        this.line(x, y)
    }
    getPath() {
        return this.ctx;
    }
}
var debugX = 0;
function debugRect(val, it) {
    ctx.fillStyle = `rgb(${!val ? 255 : 0}, ${val ? 255 : 0}, 0)`;
    ctx.fillRect(debugX, it*2, 2, 2);
    debugX+= 2;
}

/**@type {CanvasRenderingContext2D}*/
const ctx = canvas.getContext("2d");
ctx.fillStyle = "rgb(0,0,0)"

//fractal draw
function fractal() {
    ctx.lineWidth = 5*sc;
    ctx.lineJoin = "round";

    var pen = new VirtualPen();
    pen.move(width/2, height/2);
    dragonFractal(12, pen);
    fractalPath= pen.getPath();
    ctx.stroke(fractalPath);
}

/**
 * @param {*} iterations 
 * @param {VirtualPen} pen 
 */
function dragonFractal(iterations, pen, left=false) {
    if(iterations == 0) {
        //console.log("draw");
        return pen.fwdLine(20*sc);
    }
    dragonFractal(iterations-1, pen, false);

    if(left) pen.left(); else pen.right(); console.log(left, iterations); debugRect(left, iterations);

    dragonFractal(iterations-1, pen, true)
}

fractal();

document.addEventListener("wheel", (wevt) => {
    moveCanvas(wevt.x, wevt.y, wevt.deltaY*0.1+1, wevt.deltaY*0.1+1);
});

function moveCanvas(x=0, y=0, scX=1, scY=1) {
    console.log(x, y, scX, scY)
    if(!fractalPath) return;
    ctx.save();

    // Use the identity matrix while clearing the canvas
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Restore the transform
    ctx.restore();
    
    ctx.translate(x, y);
    ctx.scale(scX, scY);
    ctx.stroke(fractalPath);
}

var mousedown=false;
var dragging = false;
var deltaX = 0, deltaY = 0;

document.addEventListener("mousedown", ()=>{mousedown=true});
document.addEventListener("mouseup", ()=>{
    mousedown=false;
    dragging = false;
    deltaX = 0, deltaY = 0;
});
document.addEventListener("mousemove", (evt)=> {
    if(mousedown==false) return false;
    deltaX += evt.movementX;
    deltaY += evt.movementY;
    console.log(deltaX, deltaY);
    if(Math.abs(deltaX)+Math.abs(deltaY)>10 || dragging== true) {
        dragging = true;
        moveCanvas(deltaX*2, deltaY*2);
        deltaX = 0, deltaY = 0;
    }
});