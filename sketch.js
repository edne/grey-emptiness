// TODO collisioni player con bolle: non deve starci SOPRA
var W = 600;
var H = 600;

var player;
var bolle = [];

function setup() {
    createCanvas(W, H);

    player = new Player();

    for(var i=0; i<16; i++)
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


function Player() {
    this.x = random(W);
    this.y = random(H);
    this.r = 8;

    this.vx = 0;
    this.vy = 0;

    this.update = function() {
        for(var i=0; i<bolle.length; i++) {
            this.vx += (this.x + this.r - bolle[i].x - bolle[i].r) / W;
            this.vy += (this.y + this.r - bolle[i].y - bolle[i].r) / H;
        }

        this.vx /= 3;
        this.vy /= 3;

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
    this.r = random( (W+H) ) + (W+H)>>4;

    this.vx = 0;
    this.vy = 0;

    this.update = function() {
        for(var i=0; i<bolle.length; i++) {
            this.vx += (this.x + this.r - bolle[i].x - bolle[i].r) / W;
            this.vy += (this.y + this.r - bolle[i].y - bolle[i].r) / H;
        }

        this.vx /= 3;
        this.vy /= 3;

        this.x += this.vx;
        this.y += this.vy;

        if(dist(player.x, player.y, this.x, this.y) < player.r+this.r) {
            //this.vx = this.x ...
            //player.vx += ...
            //y
            // e qualcosa...
        }

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
