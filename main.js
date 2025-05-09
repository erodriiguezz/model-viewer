import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { ARButton } from "three/examples/jsm/webxr/ARButton.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

// setup DRACO loader
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");

let object;
let controls;

const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);

loader.load(
  "/models/heart.glb",
  function (gltf) {
    object = gltf.scene;

    gltf.scene.scale.set(1, 1, 1); // or try 0.01 for huge models
    gltf.scene.rotation.set(0, Math.PI, 0); // rotate to face camera

    // // center model
    // const box = new THREE.Box3().setFromObject(object);
    // const center = box.getCenter(new THREE.Vector3());
    // gltf.scene.position.sub(center); // move model to (0,0,0

    scene.add(object);
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    console.error(error);
  }
);

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;

// add renderer to dom
document.getElementById("container").appendChild(renderer.domElement);

// add ar button
document.body.appendChild(ARButton.createButton(renderer, { requiredFeatures: ["hit-test"] }));

// set how far the camera will be from the model
camera.position.z = 50;

// scene lighting
const topLight = new THREE.DirectionalLight(0xffffff, 5); // (color, intensity)
topLight.position.set(500, 500, 500); //top-left-ish
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// add controls to camera
controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // smooth motion
controls.dampingFactor = 0.1;

controls.target.set(0, 1, 0); // where the camera looks
controls.update();

// render scene
function animate() {
  requestAnimationFrame(animate);
  // this is where automatic movement would go
  if (object) {
    object.rotation.y = -3 + (mouseX / window.innerWidth) * 3;
    object.rotation.x = -1.2 + (mouseY * 2.5) / window.innerHeight;
  }

  renderer.render(scene, camera);
}

// //Add a listener to the window, so we can resize the window and the camera
// window.addEventListener("resize", function () {
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();
//   renderer.setSize(window.innerWidth, window.innerHeight);
// });

// //add mouse position listener, so we can make the eye move
// document.onmousemove = (e) => {
//   mouseX = e.clientX;
//   mouseY = e.clientY;
// };

animate();
