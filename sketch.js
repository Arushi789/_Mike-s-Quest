var groundImg,ground,iGround;
var player,playerRunning,playerCollided;
var gameState;
var score;
var play,playImg;
var bg1,bg2;
var screamCanister, scream,screams,screamCollection,screamsGrp,totalScreams=0;
var rand;
var toyBox,toy1Img,toysGrp;
var over, reset,resetImg,overImg;
var startSound,jump,overSound,hit;
var welcome,MU;

function preload(){
    groundImg = loadImage('Pics/ground6.png');
    playerRunning= loadAnimation('Pics/3.png','Pics/2.png','Pics/1.png');
    bg1= loadImage('Pics/bg3.jpg');
    bg2 = loadImage('Pics/bg2.jpg');
    playImg = loadImage('Pics/play.png');
    screamCanister = loadImage('Pics/screamcanister.png');
    toy1Img = loadImage('Pics/toys.png');
    overImg = loadImage('Pics/over.png');
    resetImg = loadImage('Pics/reset.png');
    playerCollided = loadAnimation('Pics/mike_collided.png');
    startSound = loadSound('start.wav');
    jump= loadSound('jump.wav');
    overSound = loadSound('over.wav');
    hit = loadSound('hit.mp3');
    welcome=loadImage('Pics/welcome.png');
    MU= loadImage('Pics/MU.png');
}

function setup(){
    createCanvas(1000,400)

    gameState = "setup";



    ground = createSprite(500,405,600,10);
    ground.scale = 1.5;
    ground.addImage(groundImg);
    

    iGround = createSprite(ground.x,ground.y-10,1000,10);
    iGround.visible = false;

    player = createSprite(120,340,50,50);
    player.scale= 1.5;
    player.addAnimation('running',playerRunning);
    player.addAnimation('collided',playerCollided);
    //player.debug= true;

    play = createSprite(880,150,70,20);
    play.addImage('button',playImg);
    play.scale = 0.2;

        resetButton= createSprite(550,300,50,50);
        resetButton.addImage(resetImg);
        resetButton.scale= 0.25;
        resetButton.visible = false;

        over = createSprite(550,150,100,100);
        over.addImage(overImg);
        over.scale = 0.5;
        over.visible = false;
        

    screamsGrp = new Group();
    toysGrp = new Group();

}

function draw(){

    background('white');

    clear();
  let display = touches.length + ' touches';
  text(display, 5, 10);
    
    player.collide(iGround);

    if(gameState==="setup"){
        image(bg1,0,0,width,height);
        image(welcome,0,100,200,300);
        image(MU,750,30,250,100);
        textSize(20);
        textFont('Lobster');
        textStyle(BOLD);
        strokeWeight(3);
        stroke('Black');
        fill(255, 114, 54);
    text("Scream Canisters: "+totalScreams,35,68);
            textSize(25);
        textFont('Grenze Gotisch');
        fill(255,160,122); 
        text("Instructions:",250,248);
        text("1. Press 'Space' key to jump.",250,288);
        text("2. Use the right and left arrow keys to navigate.",250,328);
        text("P.S. Beware of the toy boxes with that wicked stench of humans...",180,368);
        screamCollection = 0;
        textFont('Rowdies');
        fill('turquoise');
        text("Best viewed in landscape mode.",300,30);
         ground.visible = false;
        player.visible= false;
        screams = createSprite(23,60,15,15);
        screams.addImage(screamCanister);
        screams.scale = 0.35;
        if(mousePressedOver(play)){
            play.visible = false;
            Play();
            changeFrame();
            score=0;
            startSound.play();
        }
        
        for (i=0; i < 2 ;i++){
            if(screamsGrp.get(i)!=null){
                screamsGrp.get(i).remove();
            }
        }
        for (i=0; i < 2 ;i++){
            if(toysGrp.get(i)!=null){
                toysGrp.get(i).remove();
            }
        }

    } else if(gameState==="play"){

    //sprite display + Images
        player.visible = true;
        ground.visible= true;
        player.scale= 1.5;
        image(groundImg,ground.x,ground.y,2600,30);
        image(bg2,0,0,width,height);
    //spawning
        spawnScreamCanisters();
        spawntoyBoxes();
    //velocity
        ground.velocityX = -9;
        if(ground.x<0){
            ground.x = ground.width/2;
        }
        player.y = player.y + 4;
    //keydown functions
    if(keyDown('space')){
        player.y = player.y -20;
        jump.play()
    }
    if(keyDown(LEFT_ARROW)){
        player.x = player.x-4;
    }
    if(keyDown(RIGHT_ARROW)){
        player.x = player.x+4;
    }
    //increase scream collection
        if(screamsGrp.isTouching(player)){
            screamsGrp.destroyEach();
            screamCollection = screamCollection+1;
            totalScreams = totalScreams+1;
            hit.play();
        }
        mikeCollision();
        score= score + Math.round(getFrameRate()/60);
        if(score % 50===0){
            ground.velocityX = ground.velocityX+1;
        }
        highscore=score;
        textSize(20);
        textFont('Lobster');
        textStyle(BOLD);
        strokeWeight(3);
        stroke('Black');
        fill(255, 114, 54);
        text("Score:"+score,15,25);
        text("Scream Canisters:"+screamCollection,35,68);
        if(toysGrp.isTouching(player)||player.y < -100){
            gameState = "end";
            overSound.play();
        }
    } else if(gameState==="end"){
        over.visible = true;
        resetButton.visible = true;
        player.changeAnimation('collided',playerCollided);
        player.scale= 0.85;
        ground.velocityX=0;
        screamsGrp.setVelocityXEach(0);
        toysGrp.setVelocityXEach(0);
        image(bg2,0,0,width,height);
        if(score>highscore){
            score= highscore
        }
        textSize(20);
        textFont('Lobster');
        textStyle(BOLD);
        strokeWeight(3);
        stroke('Black');
        fill(255, 114, 54);       
        text("Score:"+score,15,25);
        text("Scream Canisters:"+screamCollection,35,68);
        toysGrp.depth= over.depth-1;
        toysGrp.depth= resetButton.depth-1;
        screamsGrp.lifetime = -1;
        if(mousePressedOver(resetButton)){
            reset();
            resetButton.visible = false;
        }
        
    }

    if(gameState==="end"){
        over.visible = true;
        player.setCollider("circle",10,-10,50);
    }else if(gameState==="setup"||gameState==="play"){
        over.visible = false;
        player.setCollider("circle",-10,0,50);
    }

    
        

    

    drawSprites()

    


}

function Play(){
    gameState = "play";
    ground.velocityX = -4;
        if(ground.x<0){
            ground.x = 1200
        }
        if(keyDown('space')){
            player.velocityY = -7;
        }
        player.velocityY = player.velocityY + 0.8;
}

function changeFrame(){
    frameCount = 0;
}

function spawnScreamCanisters(){
    if(frameCount % 90 === 0){
        scream = createSprite(1200,0,20,60);
        scream.setCollider("rectangle",0,0,50,100);
        scream.addImage(screamCanister);
        scream.scale = 0.5;
        scream.y = Math.round(random(20,380));
        scream.velocityX = ground.velocityX;
        scream.lifetime = 200;
        scream.addToGroup(screamsGrp); 
        screamsGrp.setLifetimeEach(1300/ground.velocityX);
    }
}

function spawntoyBoxes(){
    if (frameCount%150===0){
        toyBox = createSprite(1220,0,50,50);
        toyBox.addImage(toy1Img);
        toyBox.scale = 0.3;
        toyBox.setCollider("rectangle",0,0,150,150)
        toyBox.y = random(50,350);
        toyBox.velocityX = ground.velocityX;
        toyBox.addToGroup(toysGrp);
        toysGrp.setLifetimeEach(1300/ground.velocityX);
    }
}

function reset(){
    gameState = "setup";
    play.visible= true;
    player.x = 120;
    player.y = 340;
    player.changeAnimation('running',playerRunning);
}

function mikeCollision(){
    if(player.isTouching(toysGrp)){
        player.velocityY = 20;
        player.collide(iGround);
    }
}