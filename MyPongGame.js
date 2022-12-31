//ce document à le même but que sketch_Processing.js mais simplement sans la technologie processing.js


/*LE CANVAS*/


//PS: si question sur ce genre de chose consulter le doc canvas de le drive programmation>vscodeproject>canvas.
const canvas = document.querySelector(".canvas");
const width = canvas.width = 800;
const height = canvas.height = 300;
const ctx = canvas.getContext('2d');

//on ajoute un fond noir
ctx.fillStyle = 'black';
ctx.fillRect(0, 0, width, height);


/*LES VARIABLES SPECIFIQUES*/


let tolerance = 3.8;//la tolérance pour les valeurs des étoiles(évitent que certaines étoiles soient trop proche).
var GameOverJ1 = false;//c'est gameover pour le joueur 1
var GameOverJ2 = false;//c'est gameover pour le joueur 2
var HowManyXnYModif = 0;//c'est le nombre de fois qu'on a modifier un x ou un y des cordonnées des étoiles.
var NumbStars = 120;//le nombre d'étoiles
var KeyIsPress;//la touche qui est pressée.
var InitiallingGame = false;//installation est prête à démarrer.
var StoppingGame = false;//arrêt de l'installation
var RematchingGame = false;//relance la game après un game over
var ScoreJ1 = 0;//le score de J1
var ScoreJ2 = 0;//le score de J2


/*LES FONCTIONS SPECIFIQUES*/


//fonction qui convertit les angles en radiants
var DegToRad = function(degrees){
    return degrees * Math.PI / 180;
}

// fonction qui créer des valeurs aléatoires entre 2 valeurs
function getRandomNumb (min, max) {
    return Math.random() * (max - min) + min;//peut-être égal au min mais sera toujours plus petit que le max.
}

//fonction qui donne le nombre le plus bas en fonction du nombre de départ et de la tolérance
function MinNumb (number) {
    return number - tolerance;
}

//fonction qui donne le nombre le plus haut en fonction du nombre de départ et de la tolérance
function MaxNumb (number) {
    return number + tolerance;
}

//fonction qui donne quel touche à été pressée (KeyIsPress).
function KeyPressed(event) {
    KeyIsPress = event.key;
    console.log('the key pressed: ' + KeyIsPress);
}


/*LES OBJETS ET LEURS FONCTIONS*/


// Objet balle (config évite d'écrir x, y, width, height, color)
var Ball = function(config) {
    this.x = config.x;
    this.y = config.y;
    this.ray = config.ray;
    this.StartAngle = config.StartAngle;
    this.FinishAngle = config.FinishAngle;
    this.color = config.color;
    this.VelocityX = config.VelocityX;
    this.VelocityY = config.VelocityY;
}

//on ajoute la fonction drawB

Ball.prototype.drawB = function() {
    
    //Dessin de la balle

    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.ray, DegToRad(this.StartAngle), DegToRad(this.FinishAngle), false);
    ctx.fill();
    
    //calcul des rebonds et l'avancée de la balle

    if(this.y >= height - this.ray || this.y <= 0 + this.ray) {//si la balle touche le haut ou le bas du terrain, on inverse la vitesse (donc elle rebondit).
        this.VelocityY = this.VelocityY * (-1);
    }

    //rebond de la balle si elle touche le rectangle du joueur 1 et 2
    if ( (this.x <= rectJ1.x + rectJ1.widthR1 + this.ray + 1 && this.x >= rectJ1.x + rectJ1.widthR1 + this.ray - 1) && this.y >= rectJ1.y - this.ray && this.y <= (rectJ1.y + rectJ1.heightR1) - this.ray || ( (this.x <= rectJ2.x - this.ray + 1 && this.x >= rectJ2.x -this.ray - 1) && (this.y >= (rectJ2.y - this.ray) && this.y <= (rectJ2.y + rectJ2.heightR1) - this.ray))) {
        //si le x de la balle est presque égal au bord droite du J1 et que le y correspond au bord droite de J1. Le même principe pour J2 mais la reférence est le bord gauche.
        //le (this.x <= rectJ1.x + rectJ1.widthR1 + this.ray + 0.2 && this.x >= rectJ1.x + rectJ1.widthR1 + this.ray - 0.2) permet d'avoir une sorte de zone de tolérance (min et max), ce qui évite que le x doive être à LA bonne cordonnée pour que la balle rebondisse.
        this.VelocityX = this.VelocityX * (-1);
    }

    //Si la balle touche les lignes de fonds

    if (this.x >= width - this.ray) {//GameOver J2 est activé si la balle atteint la ligne de fond du joueur 2.
        GameOverJ2 = true;
    }

    if (this.x <= 0 + this.ray) {//GameOver J1 est activé si la balle atteint la ligne de fond du jouer 1.
        GameOverJ1 = true;
    }

    this.x = this.x + this.VelocityX;//on ajoute la valeur de la vitesse à la cordonnée x, donne l'effet d'avancer ou de reculer.
    this.y = this.y + this.VelocityY;//la même chose pour y.

    //console.log(this.y);
    //console.log(this.x);
}

// Objet rectangle 

var Rect = function(config) {
    this.x = config.x;
    this.y = config.y;
    this.widthR1 = config.width || 30;
    this.heightR1 = config.height || 100;
    this.widthR2 = config.widthR2 || 20;
    this.heightR2 = config.heightR2 || 90;
    // Couleur Stroke
    this.colorS1 = config.colorS || 'rgb(255, 255, 255)';
    this.colorS2 = config.colorS2 || 'rgb(255, 255, 255)';
    // Couleur Rect (Aire)
    // colorR doit être écrit lors de la création de l'objet(line 98) et pas colorR1
    this.colorR1 = config.colorR;
    this.colorR2 = config.colorR2 || config.colorR;
}

//on ajoute la fonction drawR à l'objet Rect.

Rect.prototype.drawR = function() {            
    
    //rectangle bleu(joueur1) ou rouge(joueur2).
    ctx.fillStyle = this.colorR1;
    ctx.fillRect(this.x, this.y, this.widthR1, this.heightR1);

    //rectangle de ligne en blanc
    ctx.strokeStyle = this.colorS1;
    ctx.strokeRect(this.x, this.y, this.widthR1, this.heightR1);
    
    //rectangle de ligne en blanc plus petit que celui d'avant
    ctx.strokeStyle = this.colorS2;
    ctx.strokeRect(this.x + 5, this.y + 5, this.widthR2, this.heightR2);

    //les mouvements des rectangles commandés par les touches du calvier.
    
    //Pour le joueur 1
    if(KeyIsPress === 'w' && rectJ1.y >= 0) {//si on appuie sur la touche w et que le rectangle n'est pas en haut (y = 0), le rectangle monte.
        rectJ1.y--;
    }else if (KeyIsPress === 's' && rectJ1.y <= height - rectJ1.heightR1) {//si on appuie sur la touche s et que le rectangle n'est pas en bas (y = 200), le rectangle descend.
        rectJ1.y++;
    }

    //Pour le joueur 2
    if (KeyIsPress === 'ArrowUp' && rectJ2.y >= 0) {//si on appuie sur la flèche du haut et que le rectangle n'est pas en haut (y = 0), le rectangle monte.
        rectJ2.y--;
    }else if (KeyIsPress === 'ArrowDown' && rectJ2.y <= height - rectJ2.heightR1) {//si on appuie sur la flèche du bas et que le rectangle n'est pas en bas (y = 200), le rectangle descend.
        rectJ2.y++;
    }
}

// Objet étoile

var Star = function(x, y){
    this.x = x;
    this.y = y;
}

//on ajoute à l'objet étoile la fonction qui le dessine.

Star.prototype.draw = function(){
    ctx.fillStyle = 'rgb(255, 255, 0)';//couleur jaune
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3, DegToRad(0), DegToRad(360), false);
    ctx.fill();
}

// Objet qui contient un tableau d'étoile qui contient 120 objets Star avec des cordonnées x et y

var Field = function() {
    this.stars = [];//Création tableau
    var xStars = [];//tableau pour les cordonnées x des étoiles
    var yStars = [];// tableau pour les cordonnées y des étoiles
    
    for(var i = 0; i < NumbStars; i++){// On insère les objets Star avec leurs cordonnées dans le tableau
        xStars.push(getRandomNumb(40, width - 60));//on incrémente des valeurs 120 fois dans un tableau.
        yStars.push(getRandomNumb(15,height - 20));//la même chose
    }

    //boucles qui permettent le tri des valeurs.

    for(let i = 0; i < NumbStars; i++) {//fait varier la valeur de référence.
                
        for (let o = 0; o < NumbStars; o++) {//fait varier la valeur comparée.
            
            if(i !== o) {//vérifie que i n'est pas égale à o.

                console.log('le i: ' + i + 'le o: ' + o);//le i et le o(pour comprendre)

                if (xStars[i] <= MaxNumb(xStars[o]) &&  xStars[i] >= MinNumb(xStars[o])) {
                    xStars[o] = -200;
                    HowManyXnYModif++;
                }

                if (yStars[i] <= MaxNumb(yStars[o]) && yStars[i] >= MinNumb(yStars[o])) {
                    yStars[o] = -200;
                    HowManyXnYModif++;
                }
            }
        }
        this.stars.push(new Star(xStars[i], yStars[i]));
    }

    console.log(this.stars);
    console.log('le nombre de x et y modifié: '+ HowManyXnYModif);
}

//on ajoute la fonction draw à l'objet Field

Field.prototype.draw = function(){
    // Le ciel
    ctx.fillStyle = 'rgb(15, 5,107)';  //Le ciel (bleu nuit)
    ctx.fillRect(0, 0, width, height);

    // Le contour du terrain 
    ctx.strokeStyle = 'white';//couleur des bordures du rectangle
    ctx.lineWidth = 2;//épaisseur de la bordure
    ctx.strokeRect(5, 5, 790, 290);//dimensions du rectangle
    
    // boucle for qui dessine les 100 étoiles qui ont des cordonnées x et y aléatoire 
    for(i = 0; i < this.stars.length; i++) {
        this.stars[i].draw();
    }

    //PS: Amélioration possible en faisant qu'on puisse modifier les éléments du terrains et qu'il ait de valeurs par défaut.
}


/*FONCTION DU SCORE*/


//variables canvas
const ScoreCanvas = document.querySelector('.ScoreCanvas');
const ScoreWidth = ScoreCanvas.width = 800;
const ScoreHeight = ScoreCanvas.height = 150;
const Sctx = ScoreCanvas.getContext('2d');

ScoreCanvas.style.position = 'absolute';
ScoreCanvas.style.top = 410 + 'px';
ScoreCanvas.style.left = 20 + 'px';

function Score() {

    if(GameOverJ1 === true) {
        ScoreJ2++;
    }

    if(GameOverJ2 === true) {
        ScoreJ1++;
    }
    //Score joueur 1
    
    //le rectangle bleu
    Sctx.fillStyle = 'rgb(7, 58, 118)';
    Sctx.fillRect(210, 0, 180, height);
    //le texte
    Sctx.fillStyle = 'white';
    Sctx.font = '80px roboto';
    Sctx.fillText(ScoreJ1, 279, 105);

    //Score joueur 2

    //le rectangle rouge
    Sctx.fillStyle = 'rgb(110, 0, 0)';
    Sctx.fillRect(400, 0, 180, height);
    //le texte
    Sctx.fillStyle = 'white';
    Sctx.font = '80px roboto';
    Sctx.fillText(ScoreJ2, 469, 105);
}


/*FONCTION FIN DE PARTIE "GAMEOVER"*/


function GameIsOver () {//ce qui s'affiche quand la balle touche une des 2 lignes de fonds.
    //si une des deux variables GameOverJ1 et J2.
    if(GameOverJ1 === true || GameOverJ2 === true) {    
        //fond noir transparent
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, width, height);
        
        //texte game over
        
        //texte noir rempli
        ctx.fillStyle = 'black';
        ctx.font = 'italic 70px creepster';
        ctx.fillText('Game Over', 267, 165);
        
        //texte blanc en ligne
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;
        ctx.font = 'italic 70px creepster';
        ctx.strokeText('Game Over', 267, 165);

        //texte rouge rempli
        ctx.fillStyle = 'red';
        ctx.font = 'italic 70px creepster';
        ctx.fillText('Game Over', 270, 165);
    }
}


/*LES DIFFERENTS BOUTONS*/


//le panneau de commande
var ControlPannel = document.getElementById('ControlPannel');
ControlPannel.style.position = 'absolute';
ControlPannel.style.top = 80 + 'px';
ControlPannel.style.left = 890 + 'px';
ControlPannel.style.width = 250 + 'px';
ControlPannel.style.height = 300 + 'px';
ControlPannel.style.backgroundColor = 'grey';
ControlPannel.style.borderStyle = 'double';

//le bouton start
var StartButton = document.getElementById('StartButton');
StartButton.style.position ='absolute';
StartButton.style.top = 90 + 'px';
StartButton.style.left = 900 + 'px';
StartButton.style.backgroundColor = 'green';
StartButton.style.color = 'white';
StartButton.style.fontSize = 40 + 'px';

//le bouton stop
var StopButton = document.getElementById('StopButton');
StopButton.style.position ='absolute';
StopButton.style.top = 200 + 'px';
StopButton.style.left = 900 + 'px';
StopButton.style.backgroundColor = 'red';
StopButton.style.color = 'white';
StopButton.style.fontSize = 40 + 'px';

//le bouton de rematch après game over
var RematchButton = document.getElementById('RematchButton');
RematchButton.style.position ='absolute';
RematchButton.style.top = 310 + 'px';
RematchButton.style.left = 900 + 'px';
RematchButton.style.backgroundColor = 'blue';
RematchButton.style.color = 'white';
RematchButton.style.fontSize = 40 + 'px';

//fonction qui modifie la valeur de la variable
function StartingGame () {
    InitiallingGame = true;//cette variable lance l'installation
    StoppingGame = false;
}

//fonction qui modifie la valeur de la variable
function StopGame () {
    StoppingGame = true;//cette variable arrête l'installation
}

//fonction qui modifie la valeur de la variable
function RematchGame () {
    RematchingGame = true;//cette variable relance le jeu après un game over.
}

//si on clique sur le bouton Start, lance la fonction StartingGame.
StartButton.addEventListener('click', StartingGame);

//si on clique sur le bouton Stop, lance la fonction StopGame.
StopButton.addEventListener('click', StopGame);

//si on clique sur le bouton rematch, lance la fonction RematchGame.
RematchButton.addEventListener('click', RematchGame);


/*FONCTION REMATCH*/


//fonction qui permet de lancer un nouveau round après un game over.
function RematchFunc () {
    //si la variable est activée
    if (RematchingGame === true) {
        //on reviens à la position de base
        ball.x = 400;
        ball.y = 150;
        //la fonction s'éxecute après 1000 millisecondes
        setTimeout(function () {
            GameOverJ1 = false;//reset la variable game over J1
            GameOverJ2 = false;//reset la variable game over J2
        }, 400);
    }else if (ball.x === 400 && ball.y === 150) {
        RematchingGame = false;
    }
}


/*CREATION VARIABLE AVEC LES OBJETS*/


//rectangle joueur 1
var rectJ1 = new Rect({
    x: 20,
    y: 100,
    colorR: 'rgb(21, 96, 189)'
});

//rectangle joueur 2
var rectJ2 = new Rect({
    x: 750,
    y: 100,
    colorR: 'rgb(187, 11, 11)'
});

// la balle de tennis 
var ball = new Ball({
    x: 400,
    y: 150,
    ray: 15,
    StartAngle: 0,
    FinishAngle: 360,
    VelocityX: 2,
    VelocityY: 2,
    color: 'white'
});

// le terrain
var field = new Field();

// fonction excécute les autres fonctions
draw = function(){
    window.requestAnimationFrame(draw);
    field.draw();
    rectJ1.drawR();
    rectJ2.drawR();
    RematchFunc();
    GameIsOver();
    Score();
    if (GameOverJ1 === false && GameOverJ2 === false && InitiallingGame === true && StoppingGame !== true) {//arrête le jeu si un des joueurs est en game over ou alors si le bouton start n'est pas activé ou si le bouton stop est activé.
        ball.drawB();
    }
}

draw();