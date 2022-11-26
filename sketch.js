const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var rope,fruit,ground;
var rope1, rope2
var fruit_con, fruit_con_1;
var fruit_con_2;

var bg_img;
var food;
var rabbit;

var button, button1, button2;
var bunny;
var blink,eat,sad;

var bg_song,cut_sound,sad_sound,eating_sound,air;

var blower;
var mute_btn;

var canW, canH;

function preload()
{
  bg_img = loadImage('background.png');
  food = loadImage('melon.png');
  rabbit = loadImage('Rabbit-01.png');;
  blink = loadAnimation("blink_1.png","blink_2.png","blink_3.png");
  eat = loadAnimation("eat_0.png" , "eat_1.png","eat_2.png","eat_3.png","eat_4.png");
  sad = loadAnimation("sad_1.png","sad_2.png","sad_3.png");
  
  bg_song = loadSound("sound1.mp3");
  cut_sound = loadSound("rope_cut.mp3");
  sad_sound = loadSound("sad.wav");
  eating_sound = loadSound("eating_sound.mp3");
  air = loadSound("air.wav");

  blink.playing = true;
  eat.playing = true;
  sad.playing = true;
  sad.looping= false;
  eat.looping = false; 
}

function setup() {
  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
    canW = displayWidth+80;
    canH = displayHeight;
  }
  else {
    canW = windowWidth;
    canH = windowHeight;
  }

  createCanvas(canW, canH);
  frameRate(80);

  engine = Engine.create();
  world = engine.world;
  
  button = createImg('cut_btn.png');
  button.position(canW/3-20,30);
  button.size(50,50);
  button.mouseClicked(drop);

  button1 = createImg('cut_btn.png');
  button1.position(canW/2,50);
  button1.size(50,50);
  button1.mouseClicked(drop1);

  button2 = createImg('cut_btn.png');
  button2.position(canW/2+120,120);
  button2.size(50,50);
  button2.mouseClicked(drop2);
  
  rope = new Rope(9,{x:canW/3,y:30});
  rope1 = new Rope(8,{x:canW/2+20,y:70});
  rope2 = new Rope(8,{x:canW/2+140,y:140});

  ground = new Ground(canW/2,canH,canW,20);

  blink.frameDelay = 20;
  eat.frameDelay = 20;
  sad.frameDelay = 20;

  bunny = createSprite(canW/2,canH-80,100,100);
  bunny.scale = 0.2;

  bunny.addAnimation('blinking',blink);

  bunny.addAnimation('eating',eat);
  bunny.addAnimation('crying',sad);
  bunny.changeAnimation('blinking');
  
  fruit = Bodies.circle(canW/3,canH/2-70,20);
  Matter.Composite.add(rope.body,fruit);

  fruit_con = new Link(rope,fruit);
  fruit_con_1 = new Link(rope1,fruit);
  fruit_con_2 = new Link(rope2,fruit);

  rectMode(CENTER);
  ellipseMode(RADIUS);
  imageMode(CENTER);
 
  blower = createImg('blower.png');
  blower.position(10,250);
  blower.size(130,80);
  blower.mouseClicked(airBlow)

  mute_btn = createImg('mute.png');
  mute_btn.position(canW-100,20);
  mute_btn.size(50,50);
  mute_btn.mouseClicked(mute);

  bg_song.play()
  bg_song.setVolume(0.3);
}

function draw() 
{
  background(51);
  image(bg_img,canW/2,canH/2,canW,canH);

  if(fruit!=null){
    image(food,fruit.position.x,fruit.position.y,70,70);
  }

  rope.show();
  rope1.show();
  rope2.show();

  Engine.update(engine);
  ground.show();

  if(collide(fruit,bunny)==true)
  {
    bunny.changeAnimation('eating');
    eating_sound.play();
  }
   
  if(fruit!=null && fruit.position.y >= 650)
  {
     bunny.changeAnimation('crying');
     bg_song.stop();
    sad_sound.play();
    fruit = null;

  }

   drawSprites();
}

function drop()
{
  rope.break();
  fruit_con.dettach();
  fruit_con = null; 
  cut_sound.play();
}

function drop1()
{
  rope1.break();
  fruit_con_1.dettach();
  fruit_con_1 = null; 
  cut_sound.play();
}

function drop2()
{
  rope2.break();
  fruit_con_2.dettach();
  fruit_con_2 = null; 
  cut_sound.play();
}

function collide(body,sprite)
{
  if(body!=null)
        {
         var d = dist(body.position.x,body.position.y,sprite.position.x,sprite.position.y);
          if(d<=80)
            {
              World.remove(engine.world,fruit);
               fruit = null;
               return true; 
            }
            else{
              return false;
            }
         }
}

function airBlow() {
  Matter.Body.applyForce(fruit,{x:0,y:0},{x:0.01,y:0})
  air.play()
}

function mute() {
  if (bg_song.isPlaying()){
    bg_song.stop()
  }
  else {
    bg_song.play()
  }
}