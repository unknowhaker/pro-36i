//Project 36 ------ Virtual Pet 2
var database;
var foodS, dog;
var dogImage, happyDogImage;

var feedButton, addFoodButton;

var feedTime;
var foodObj;
var gameState,beadroom,garden,washroom;

function preload(){
  dogImage = loadImage("images/Dog.png");
  happyDogImage = loadImage("images/happyDog.png");
  //beadroom = loadImage("images/Bed Room.png");
  //garden = loadImage("images/Garden.png");
  //washroom = loadImage("images/Wash Room.png")
}
	


function setup() {
  createCanvas(1200,400);

  database = firebase.database();
  var readState = database.ref('gameState');
  readState.on("value",(data)=>{
    gameState=data.val();
  });
  
  dog = createSprite(800,250);
  dog.addImage(dogImage);
  dog.scale = 0.35;

  feedButton = createButton("Feed the dog");
  feedButton.position(width/2-50,80);

  addFoodButton = createButton("Add food to the stock");
  addFoodButton.position(width/2+50,80);

  foodObj = new Food();

  var feedTimeRef = database.ref('lastFed');
  feedTimeRef.on("value",function(data){
    feedTime = data.val();
  });

 
}


function draw() {  
  background(46,139,87);

  if (feedTime !== undefined){
    fill(255);
    textSize(15);
    if(feedTime>=12){
      text("Last Feed: "+ feedTime%12 + " PM", width-150,80);
    }
    else if(feedTime===0){
      text("Last Feed: 12 AM ", width-150,80);
    }
    else{
      text("Last Feed: "+ feedTime + " AM", width-150,80);
    }
  }

  foodObj.getFoodStock();
  foodObj.display();
  drawSprites();

  feedButton.mousePressed(function(){
    dog.addImage(happyDogImage);
    foodObj.getFoodStock();
    foodS = foodS-1;
    foodObj.updateFoodStock(foodS);
    feedTime = hour();
    database.ref('/').update({
      lastFed: feedTime
    })
    

  });

  addFoodButton.mousePressed(function(){
    foodS+=1;
    foodObj.updateFoodStock(foodS);
  });


  currentTime = hour();
  if (currentTime===(feedTime+1)){
    foodObj.garden();
    update("playing");
  }
  else if (currentTime===(feedTime+2)){
    foodObj.bedroom();
    game.update("sleeping");
  }else if((currentTime>(feedTime+2))&&(currentTime<=(feedTime+4))){
    foodObj.washroom();
    update("bathing");
  }else{
    foodObj.display();
    update("hungry");
  }


  if (gameState !== "hungry"){
    feedButton.hide();
    addFoodButton.hide();
    dog.remove();
  }
  else{
    feedButton.show();
    addFoodButton.show();
    foodObj.display();
   
  }
}

function update(state){
  database.ref('/').update({
    gameState:state
  })
}
