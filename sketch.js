var W = 600;
var H = 600;

var player;
var bolle = [];

function setup() {
    createCanvas(W, H);

    player = new Player();

    for(var i=0; i<8; i++)
        bolle[i] = new Bolla();

    frameRate(30);
}

function draw() {
    bolle.forEach(function(b) {
        b.update();
    });
    player.update();

    background(200);

    bolle.forEach(function(b) {
        b.draw();
    });
    player.draw();
}

var mx, my;
function mousePressed() {
    mx = mouseX;
    my = mouseY;
}
function mouseReleased() {
    player.vx += 100*(mouseX - mx)/W;
    player.vy += 100*(mouseY - my)/H;
}

function distMod(a, b, mod) {
    return (a - b) / mod;
}


function Player() {
    this.x = random(W);
    this.y = random(H);
    this.r = 8;

    this.vx = 0;
    this.vy = 0;

    this.update = function() {
        bolle.forEach(function(b) {
            var d = dist(this.x, this.y, b.x, b.y);
            if(d < this.r + b.r) {
                theta = atan2(this.y - b.y, this.x - b.x);

                this.vx += min(10, this.x - b.x);
                this.vy += min(10, this.y - b.y);

                this.vx *= 0.5;
                this.vy *= 0.5;

                b.vx += b.x - this.x;
                b.vy += b.y - this.y;
            }
        }, this);

        this.vx *= 0.9;
        this.vy *= 0.9;

        this.vx = min(this.vx, 10);
        this.vy = min(this.vy, 10);

        this.x += this.vx;
        this.y += this.vy;

        this.x %= W;
        this.y %= H;
    };

    this.draw = function() {
        fill(128);
        noStroke();
        for(var i=-1; i<=1; i++)
        for(var j=-1; j<=1; j++)
            ellipse( i*W + this.x, j*H + this.y, this.r*2, this.r*2);
    };
}


function Bolla() {
    this.x = random(W);
    this.y = random(H);
    this.r = random( (W+H) * 2) + (W+H)>>4;

    this.vx = 0;
    this.vy = 0;

    this.update = function() {
        bolle.forEach(function(b) {
            this.vx += distMod(this.x + this.r, b.x + b.r, W);
            this.vy += distMod(this.y + this.r, b.y + b.r, H);
        }, this);

        this.vx /= 3;
        this.vy /= 3;

        this.x += this.vx;
        this.y += this.vy;

        this.x %= W;
        this.y %= H;

        this.r += (this.vx/W + this.vy/H)/2;
    };

    this.draw = function() {
        fill(255, 50);
        //stroke(230);
        noStroke();
        for(var i=-1; i<=1; i++)
        for(var j=-1; j<=1; j++)
            ellipse( i*W + this.x, j*H + this.y, this.r*2, this.r*2);
    };
}
