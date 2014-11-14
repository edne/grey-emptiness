var W = 600;
var H = 600;

var player;
var bolle;

function setup() {
    createCanvas(W, H);

    player = new Player();

    bolle = [];
    bolle[0] = new Bolla();

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
}
function mouseDragged() {
}

function distMod(a, b, mod) {
    return (a - b) / mod;
}


function Player() {
    this.x = random(-W/2, W/2);
    this.y = random(-H/2, H/2);
    this.r0 = 8;
    this.r = 8;

    this.destX = this.x;
    this.destY = this.y;

    this.update = function() {
        this.r = min(this.r0, this.r+0.1);

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

        var dir = atan2(this.destY - this.y, this.destX - this.x);
        var x = v * cos(dir);
        var y = v * sin(dir);

        bolle.forEach(function(b) {
            var d = dist(this.x, this.y, b.x, b.y) - b.r - this.r;
            var th = atan2(this.y - b.y, this.x - b.x);
            if( d < 0 ) {
                b.collide();
                this.x = b.x + (b.r + this.r*2)*cos(th);
                this.y = b.y + (b.r + this.r*2)*sin(th);
                this.r -= 0.2;
            }
        }, this);

        this.x += v * cos(dir);
        this.y += v * sin(dir);

        if( this.r <= 0 ) {
            setup(); // GAME OVER
        }
    };

    this.draw = function() {
        if( dist(this.x, this.y, player.x, player.y)-this.r < 2*max(W,H) ) {
            fill(128);
            noStroke();
            ellipse( W/2, H/2, this.r*2, this.r*2);
        }
    };
}


function Bolla(x=0, y=0, r=100) {
    this.x = x;
    this.y = y;
    this.r0 = r;
    this.r = r;
    this.t0 = millis()/1000;
    this.alive = true;

    this.color = function() {
        fill(255, 100);
        noStroke();
    };

    this.update = function() {
        this.r = this.r0 + (this.r0/8)*sin(0.1*millis()/1000 - this.t0);
    };

    this.collide = function() {
        if(this.alive) {
            this.alive = false;

            this.color = function() {
                fill(128, 64);
                noStroke();
            };

            var N = 7;
            for(var i=0; i<N; i++) {
                var r = random(this.r*2, this.r*20);//+random(dist(0,0, this.x, this.y));
                var th = random(-PI/N, PI/N);
                bolle[bolle.length] = new Bolla(
                    this.x + r*sin(i*2*PI/N + th),
                    this.y + r*cos(i*2*PI/N + th),
                    max(2, random(this.r/8, min(this.r*2, min(W,H))))
                );
            }
        }
    };

    this.draw = function() {
        this.color();
        ellipse( this.x - (player.x-W/2), this.y - (player.y-H/2), this.r*2, this.r*2);
    };
}
