var W = 600;
var H = 600;

var player;
var bolle;
var scores;
var gameOver;

var osc, env;
var delay, reverb, filter;

function setup() {
    createCanvas(W, H);

    player = new Player();

    bolle = [];
    bolle[0] = new Bolla(0, 0, 100);

    scores = 0;
    gameOver = false;

    osc = new p5.TriOsc();
    osc.start();
    osc.amp(0);

    env = new p5.Env(0.01, 0.8, 0.2, 0.1, 0);

    delay = new p5.Delay();
    delay.process(osc, 2, .8, 200);

    reverb = new p5.Reverb();
    reverb.process(osc, 3, 2);

    filter = new p5.LowPass();
    filter.freq(1000);
    osc.connect(filter);

    frameRate(30);
}

function draw() {
    if( gameOver ) {
        background(200);

        fill(255, 128);
        noStroke();
        textAlign(CENTER)
        textSize(64);
        text(''+scores, W/2+4, H/2+8, W, H);
    } else {
        bolle.forEach(function(b) {
            b.update();
        });
        player.update();

        background(200);

        fill(255, 128);
        noStroke();
        textSize(32);
        text(''+scores, 8,16,W,32);

        bolle.forEach(function(b) {
            b.draw();
        });
        player.draw();
    }
}

function mousePressed() {
    if( gameOver ) {
        delay.amp(0);
        setup();
    }
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

        if( mouseX>=0 && mouseX<W &&
            mouseY>=0 && mouseY<H &&
            dist(mouseX, mouseY, W/2, H/2) > this.r*4
         ) {
            player.destX = (mouseX - W/2) + player.x;
            player.destY = (mouseY - H/2) + player.y;
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
            gameOver = true;
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


function Bolla(x, y, r) {
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
            scores++;

            this.color = function() {
                fill(128, 64);
                noStroke();
            };

            var N = 7;
            for(var i=0; i<N; i++) {
                var r = random(this.r*2, this.r*20);
                var th = random(-PI/N, PI/N);
                bolle[bolle.length] = new Bolla(
                    this.x + r*sin(i*2*PI/N + th),
                    this.y + r*cos(i*2*PI/N + th),
                    max(2, random(this.r/8, min(this.r*2, min(W,H))))
                );
            }

            osc.freq(max(20, 20000/this.r));
            env.play(osc);
        } else {
        }
    };

    this.draw = function() {
        this.color();
        ellipse( this.x - (player.x-W/2), this.y - (player.y-H/2), this.r*2, this.r*2);
    };
}
