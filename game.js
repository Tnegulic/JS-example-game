const numTarget = 5;
const radiusTarget = 50;
const radiusPlayer = 40;
const maxScore = 9;
const canvasX = 600;
const canvasY = 600;

class Target {
	//konstruktor za metu
    constructor(x, y, score) {
        this.x = x;
        this.y = y;
        this.score = score;
    }
	
	//crtanje mete u kanvas
    drawCircle() {
        var c = document.getElementById("myCanvas");
        var ctx = c.getContext("2d");
        ctx.beginPath();
        ctx.arc(this.x, this.y, radiusTarget, 0, 2 * Math.PI);
        ctx.fillStyle = 'green';
        ctx.fill();
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#003300';
        ctx.fillStyle = 'red';
        ctx.font = "50px Arial";
        ctx.fillText(this.score.toString(), this.x - 12, this.y + 20);
        ctx.stroke();
    }
}

class Player {
	//definiranje igraceve pocetne pozicije moze i 0,0 al onda je slicica malo izvan canvasa
    constructor() {
        this.x = radiusPlayer / 2;
        this.y = radiusPlayer / 2;
    }
	
	//setter za x koristimo ga kod pomicanja igraca nakon onclick listenera
    setx(x) {
        this.x = x;
    }
	
	//setter za y koristimo ga kod pomicanja igraca nakon onclick listenera
    sety(y) {
        this.y = y;
    }
	
	//iscrtavanje igraca u canvas
    drawPlayer() {
        var c = document.getElementById("myCanvas");
        var ctx = c.getContext("2d");
        var img = document.getElementById("player");
        ctx.drawImage(img, this.x - radiusPlayer / 2, this.y - radiusPlayer / 2, 40, 40);
    }
	
}

class Game {
	//definicija varijabli unutar konstruktora
    constructor() {
        this.player = new Player();
        this.arrayTargets = [];
        this.score = 0;
    }
	//funkcija koja pokreće igru
    startGame() {
        this.drawCanvas();
        this.createTargets();
        this.drawFrame();
    }
	
	//crtanje samog kanvasa i dodavanje event click listenera
    drawCanvas() {
        var self = this;
        var canvas = document.createElement('canvas');

        canvas.id = "myCanvas";
        canvas.width = canvasX;
        canvas.height = canvasY;
        canvas.style.zIndex = 8;
        canvas.style.position = "absolute";
        canvas.style.border = "2px solid";
        document.body.appendChild(canvas);
		
        //dodavanje event listenera onclick
        var offsetTop = canvas.offsetTop;
        var offsetLeft = canvas.offsetLeft;
        document.getElementById('myCanvas').addEventListener('click', function(evt) {
            //logika pomicanja
            //alert((evt.clientX - offsetLeft) + ',' + (evt.clientY - offsetTop));
            self.player.setx(evt.clientX - offsetLeft);
            self.player.sety(evt.clientY - offsetTop);
            self.checkCollision();
            self.drawFrame();
            self.checkEnd();
        }, false);
    }
	
	//inicijalno stvaranje odogvarajučeg broja meti (random x,y pozicija unutar kanvasa i random vrijednost bodova mete)
    createTargets() {
        var a, b, c, target;
		//stvaramo odgovarajući broj meta definiranih constantom numTarget
        for (var i = 0; i < numTarget; i++) {
			//Math.random() izbacuje random brojeve u intervalu <0,1> tako da ih moramo skalirat na odgovarajuću veličinu kanvasa(implementirana logika da mete nemogu bit izvan okvira)
            a = Math.floor((Math.random() * (canvasX - 2 * radiusTarget)) + radiusTarget);
            b = Math.floor((Math.random() * (canvasY - 2 * radiusTarget)) + radiusTarget);
            c = Math.floor((Math.random() * maxScore) + 1);
			//kreacija novog objekta target
            target = new Target(a, b, c);
			//dodavanje objekta u polje
            this.arrayTargets.push(target);
        }
    }
	
	//iscrtavanje okvira unutar kanvasa (sve preostale mete i igrac)
    drawFrame() {
        var canvas = document.getElementById("myCanvas");
        const context = canvas.getContext('2d');
		//brisanje starog okvira
        context.clearRect(0, 0, canvas.width, canvas.height);
		//crtanje svih meta
        for (var i = 0; i < this.arrayTargets.length; i++) {
            this.arrayTargets[i].drawCircle();
        }
		//crtanje igraca
        this.player.drawPlayer();
		//ispis novog rezultata
        document.getElementById("score").innerHTML = this.score.toString();
    }
	
	//funkicja koja provijerava "koliziju" igraca(lokacije klika) i svih meti
    checkCollision() {
        for (var i = this.arrayTargets.length - 1; i >= 0; i--) {
			//logika provijere dali se klik nalazi u radijus, TODO elegantinij nacin sqrt((x1-x2)^2+(y1-y2)^2) < radiuTarget
            if (((this.arrayTargets[i].x - radiusTarget) < this.player.x) && (this.player.x < (this.arrayTargets[i].x + radiusTarget)) && ((this.arrayTargets[i].y - radiusTarget) < this.player.y) && (this.player.y < (this.arrayTargets[i].y + radiusTarget))) {
                //povećanje rezultata za odgovarajuće bodove mete
				this.score += this.arrayTargets[i].score;
                //splice funkcija briše elemente(br elemenata 2 parametar) na poziciji u polju(prvog parametra)
                this.arrayTargets.splice(i, 1);
                //izlaz iz for petlje zadovoljen uvijet 
                break;
            }
        }
    }
	
	//funkcija koja provijerava kraj igre, provijerava broj preostalih meta i ispisuje poruku
    checkEnd() {
        if (this.arrayTargets.length == 0) {
            var c = document.getElementById("myCanvas");
            var ctx = c.getContext("2d");
            ctx.fillStyle = 'red';
            ctx.font = "64px Arial";
            ctx.fillText("You won!", c.height / 2 - 140, c.width / 2 - 32);
            ctx.stroke();
        }
    }

}
//main funkcija koja instancira objekt i pokrece igru
function start() {
    g = new Game();
    g.startGame();
}