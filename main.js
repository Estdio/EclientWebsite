import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';

//pls dont make fun of my js skills


//math stuff

function radians_to_degrees(radians)
{
  var pi = Math.PI;
  return radians * (180/pi);
}


// Setup

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(100);
camera.position.setY(-5);
camera.position.setX(0.5);


renderer.render(scene, camera);

document.body.style.zoom = "100%";

// Lights

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// Background

const bgTexture = new THREE.TextureLoader().load('assets/images/endsky.jpg');
scene.background = bgTexture;

// Blocks
const bedrockTexture = new THREE.TextureLoader().load('assets/images/bedrock.png');
const obsidianTexture = new THREE.TextureLoader().load('assets/images/obsidian.png');
const netherrackTexture = new THREE.TextureLoader().load('assets/images/netherrack.png');
const endstoneTexture = new THREE.TextureLoader().load('assets/images/endstone.png');

function placeBlock(blckarr, texture) {
  const block = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ map: texture }));
  scene.add(block);

  block.position.x = blckarr[0];
  block.position.y = blckarr[1];
  block.position.z = blckarr[2]-13;
}

function placeBlocks(array) {
  var i;
  for (i = 0; i < array.length; i++) {
    let blockArr = array[i].split('|');

    if (blockArr[3] == 7) {placeBlock(blockArr, bedrockTexture);}
    else if (blockArr[3] == 49) {placeBlock(blockArr, obsidianTexture);}
    else if (blockArr[3] == 87) {placeBlock(blockArr, netherrackTexture);}
    else if (blockArr[3] == 121) {placeBlock(blockArr, endstoneTexture);}
  }
}


var rawFile = new XMLHttpRequest();
rawFile.open("GET", "world.txt", false);
rawFile.onreadystatechange = function ()
{
    if(rawFile.readyState === 4)
    {
        if(rawFile.status === 200 || rawFile.status == 0)
        {
            var allText = rawFile.responseText;
            var blocksArr = allText.split('\n');
            placeBlocks(blocksArr);
        }
    }
}
rawFile.send(null);

//popbob head
const popbobTexture = new THREE.TextureLoader().load('assets/images/popbob.png');

const popbob = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), new THREE.MeshBasicMaterial({ map: popbobTexture }));
scene.add(popbob);

popbob.position.x = -2.75;
popbob.position.y = -4.5;
popbob.position.z = -13;


// Scroll Animation 

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  if (camera.position.z > -24) {
    camera.position.z = t * 0.01;
  }
  
  else {
    camera.position.z = -23.9;
  }

  document.body.onmousemove = function() { 
    document.body.
    camera.rotation.x += 0.01
  }

  document.body.onmouseup = function() {
  }


  if (camera.position.z < -6) {
    var diffx = camera.position.x - popbob.position.x;
    var diffz = camera.position.z - popbob.position.z;
    var diffy = camera.position.y - popbob.position.y;

    var distance = Math.sqrt((diffx ** 2) + (diffy ** 2) + (diffz ** 2));

    var newpitch = radians_to_degrees(-Math.tan(diffy/distance))
    var newyaw = radians_to_degrees(Math.atan2(diffz, diffx))

    popbob.rotation.x = newpitch/58.064516129;
    popbob.rotation.y = -newyaw/58.064516129;
  }
}

document.body.onscroll = moveCamera;
moveCamera();

// Animation Loop

function animate() {
  requestAnimationFrame(animate);

  document.addEventListener('keydown', onDocumentKeyDown, false);
  function onDocumentKeyDown(eventorwhatever) {
    var moveamountrot = 0.0002;
    eventorwhatever = eventorwhatever || window.eventorwhatever;
    var keycode = eventorwhatever.keyCode;
    switch (keycode) {

      case 37:
        camera.rotation.y = camera.rotation.y + moveamountrot;
        break;
      case 38:
        camera.rotation.x = camera.rotation.x + moveamountrot;
        break;
      case 39:
        camera.rotation.y = camera.rotation.y - moveamountrot;
        break;
      case 40:
        camera.rotation.x = camera.rotation.x - moveamountrot;
        break;

    }
    document.addEventListener('keyup', onDocumentKeyUp, false);
  }
  function onDocumentKeyUp(event) {
    document.removeEventListener('keydown', onDocumentKeyDown, false);
  }

  renderer.render(scene, camera);
}

animate();

