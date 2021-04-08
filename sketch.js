//Create variables here
var dog, dogIMG, dogImg1;
var database;
var foodStock,foodS,foodObj;


function preload(){
  dogIMG = loadImage("images/dogImg.png");
  dogImg1 = loadImage("images/dogImg1.png");
}

function setup() {
  database = firebase.database();  
  createCanvas(500,500); 

  foodObj = new Food();
  
  dog = createSprite(width/2, height/2, 10,10);
  dog.addImage(dogIMG);
  dog.scale = 0.2;

  foodStock = database.ref('food');
  foodStock.on("value",readStock);
  
  textSize(20);

  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
}

function draw() {  
  background(52,235,119);

  if(keyWentDown(UP_ARROW)){
    writeStock(foodS);
    dog.addImage(dogImg1);

    fedTime=database.ref('feedTime');
    fedTime.on("value",function(data){
    lastFed=data.val();
  });
 
  fill(255,255,254);
  textSize(15);

  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM", 350,30);
   }else if(lastFed==0){
     text("Last Feed : 12 AM",350,30);
   }else{
     text("Last Feed : "+ lastFed + " AM", 350,30);
   }
   
   //add styles here
  fill(6,7,56);
  stroke("black");
  text("Food Remaining : " + foodS,170,200);
  textSize(20);
  text("NOTE : Press UP arrow key to feed Archie milk!" ,50,100);   
  }

  drawSprites();
}

//function to read food Stock
function readStock(data){
  console.log("inside readStock");
  foodS = data.val();
  console.log("foodS" + foodS);
  foodObj.updateFoodStock(foodS);
  console.log("Anahita")
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(dogImg1);
  
  if(foodObj.getFoodStock() <= 0){
    foodObj.updateFoodStock(foodObj.getFoodStock() * 0);
  }else{
    foodObj.updateFoodStock(foodObj.getFoodStock() - 1);
  }
  
  database.ref('/').update({
    food:foodObj.getFoodStock(),
    feedTime : hour()
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
  food : foodS
  })
}