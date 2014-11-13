var W = 600;
var H = 600;

var player;
var bolle = [];

function setup() {
    createCanvas(W, H);

    player = new Player();

    for(var i=0; i<2; i++)
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

function mousePressed() {
    player.destX = (mouseX - W/2) + player.x;
    player.destY = (mouseY - H/2) + player.y;
}
function mouseDragged() {
    player.destX = (mouseX - W/2) + player.x;
    player.destY = (mouseY - H/2) + player.y;
}

function distMod(a, b, mod) {
    return (a - b) / mod;
}


function Player() {
    this.x = random(-W/2, W/2);
    this.y = random(-H/2, H/2);
    this.r = 8;

    this.destX = this.x;
    this.destY = this.y;

    this.update = function() {

        if( mouseX>=0 && mouseX<W && mouseY>=0 && mouseY<H ) {
            player.destX = (mouseX - W/2) + player.x;
            player.destY = (mouseY - H/2) + player.y;
            v = dist(0,0, mouseX-W/2, mouseY-H/2)/100;
            this.v = 10;
        } else {
            this.v *= 0.8;
        }

        var d = dist(this.x, this.y, this.destX, this.destY)
        var v = this.v;
        if( d < this.r ) {
            v = d;
        } else if(d < 2) {
            v = 0;
        }

        bolle.forEach(function(b) {
            var d = dist(this.x, this.y, b.x, b.y) - b.r - this.r;
            if( d < 0 ) {
                b.collide();
            }
        }, this);

        var dir = atan2(this.destY - this.y, this.destX - this.x);
        this.x += v * cos(dir);
        this.y += v * sin(dir);
    };

    this.draw = function() {
        fill(128);
        noStroke();
        ellipse( W/2, H/2, this.r*2, this.r*2);
    };
}


function Bolla(x=0, y=0, r=100) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.alive = true;

    this.color = function() {
        fill(255, 100);
        noStroke();
    };

    this.update = function() {
    };

    this.collide = function() {
        if(this.alive) {
            this.alive = false;

            this.color = function() {
                fill(128, 100);
                noStroke();
            };

            var N = 7;
            for(var i=0; i<N; i++) {
                var r = random(this.r*4, this.r*16) + dist(0,0, this.x, this.y);
                var th = random(-PI/N, PI/N);
                bolle[bolle.length] = new Bolla(
                    this.x + r*sin(i*2*PI/N + th),
                    this.y + r*cos(i*2*PI/N + th),
                    random(this.r/2, this.r*2)
                );
            }
        }
    };

    this.draw = function() {
        this.color();
        ellipse( this.x - (player.x-W/2), this.y - (player.y-H/2), this.r*2, this.r*2);
    };
}
