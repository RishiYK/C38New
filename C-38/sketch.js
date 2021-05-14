//variables for trex
var trex, trex_running, trex_collided;

//variable for edges 
var edges;

//variables for ground
var ground, groundImage, invisibleGround;

//variables for cloud 
var cloud, cloudImage;

//variables for obstacles
var obstacle,obstacle1,obstacle2,obstacle3,obstacle4,obstacle5,obstacle6;

var gameover,gameoverImg;
var restart,restartImg;

//groups for clouds and obstacle
var cloudGroup;
var obstacleGroup;  

//variable for score 
var score=0;

var PLAY=1;
var END=0;
var gameState=PLAY;

var checkPointSound;
var dieSound;
var jumpSound;
//function to load assets 

function preload(){ 
  
  //load animation for the trex 
  trex_running = loadAnimation ("trex1.png", "trex3.png", "trex4.png"); 
  trex_collided= loadAnimation("trex_collided.png")
  //load image for ground 
  groundImage= loadImage("ground2.png");
  
  //load image for the cloud 
  cloudImage= loadImage("cloud.png");
  
  //load images for obstacles 
  obstacle1=loadImage("obstacle1.png");
  obstacle2=loadImage("obstacle2.png");
  obstacle3=loadImage("obstacle3.png");
  obstacle4=loadImage("obstacle4.png");
  obstacle5=loadImage("obstacle5.png");
  obstacle6=loadImage("obstacle6.png");
  
  restartImg=loadImage("restart.png");
  gameoverImg=loadImage("gameOver.png");
  
  checkPointSound=loadSound("checkPoint.mp3");
  dieSound=loadSound("die.mp3");
  jumpSound=loadSound("jump.mp3");
}

//create objects 
function setup(){
  
  //create a canvas 
  createCanvas(displayWidth,displayHeight); 
  
  
  obstacleGroup=new Group();
  cloudGroup=new Group ();
  
  //create trex sprite and its properties 
  trex = createSprite(50, 160, 10, 40); 
  trex.addAnimation("running", trex_running); 
  trex.addAnimation("stop",trex_collided);
  trex.scale = 0.5; 
  
  trex.debug=true;
  trex.setCollider("circle",0,0,40);
  //edges 
  edges = createEdgeSprites(); 
  
  //create ground sprite and its properties 
  ground= createSprite(300,180,600,20);
  ground.addImage("bg",groundImage);
  ground.x=ground.width/2;
  
  //creare invisible ground and its properties 
  invisibleGround= createSprite(300,190,600,10);
  invisibleGround.visible= false; 
  
  restart=createSprite(300,120,20,20);
  restart.addImage("restart",restartImg);
  restart.scale=0.5
  
  gameover=createSprite(300,60,20,40);
  gameover.addImage("gameover",gameoverImg);
  


  
}

//this function repeats itself every frame 
function draw(){ 
    
  //clear the screen 
  background("white");
  
  console.log("this is",gameState)
  
  //display score 
  text("Score:"+ score,500,50);

  camera.position.x = trex.x;
  camera.position.y = displayHeight/2;
  
  //make the trex stop from falling off 
  trex.collide(invisibleGround ); 
  
  
  
  if(gameState===PLAY){
    //increase the score 
  score=score+Math.round(getFrameRate()/60);
    
    if(score>0&&score%100===0){
      checkPointSound.play(); 
    }
    //make the ground move 
  ground.velocityX=-10;
     //infinite ground 
  if(ground.x<0){
    ground.x=ground.width/2;   
  }
    //make the trex jump when space key is pressed 
  if (keyDown("space")&&trex.y>=161.5){ 
    trex.velocityY = -10;
    jumpSound.play();
  }
     //adding gravity 
  trex.velocityY = trex.velocityY + 0.5;
    
     //spread the clouds 
  spawnClouds();
  
  //spawn the obstacles 
  spawnObstacles();
    
    if(obstacleGroup.isTouching(trex)){
      gameState=END;
      dieSound.play();
    }
    gameover.visible=false;
    restart.visible=false;
  }
  else if(gameState===END){
    ground.velocityX=0;
    obstacleGroup.setVelocityXEach(0);
    cloudGroup.setVelocityXEach(0); 
    trex.changeAnimation("stop",trex_collided);
    obstacleGroup.setLifetimeEach(-1);
    cloudGroup.setLifetimeEach(-1);
    trex.velocityY=0;
    gameover.visible=true;
    restart.visible=true;
    
     if(mousePressedOver(restart)){
    reset();
  }
  }
  
 
  
 
  //draw all sprites 
  drawSprites(); 
}
function reset(){
  gameState = PLAY;
  gameover.visible=false;
  restart.visible=false;
  
  obstacleGroup.destroyEach(); 
  cloudGroup.destroyEach(); 
  
  trex.changeAnimation("running", trex_running);
  
  score = 0; 
  
  
}
function spawnClouds(){
  
  //show a cloud after 60 frames 
  if(frameCount%60===0){
    
    //create cloud sprite and proerties 
    cloud=createSprite(600,100,20,20);
    cloud.y=Math.round(random(10,150)); 
    cloud.velocityX=-5;
    cloud.lifetime=120;

    //add cloud image 
    cloud.addImage(cloudImage);
    
    //change scale 
    cloud.scale=0.5
    
    //make trex appear in front of the cloud 
    cloud.depth=trex.depth
    trex.depth=trex.depth+1;
    
    cloudGroup.add(cloud);
  }
}


function spawnObstacles(){
  
  //make obstacles appear after every 60 frames 
  if(frameCount%60===0){
    
    //create obsracle sprite and its properties 
    obstacle=createSprite(600,165,10,40);
    obstacle.velocityX=-6;
    obstacle.scale=0.5;
    obstacle.lifetime=300;
    
    obstacleGroup.add(obstacle);
    
    //genrate random obstacles
    var rand=Math.round(random(1,6));
    switch(rand){
      case 1:obstacle.addImage(obstacle1);
      break;
      case 2:obstacle.addImage(obstacle2);
      break;
      case 3:obstacle.addImage(obstacle3);
      break;
      case 4:obstacle.addImage(obstacle4);
      break;
      case 5:obstacle.addImage(obstacle5);
      break;
      case 6:obstacle.addImage(obstacle6);
      break;
      default:break;   
    }
  }
}