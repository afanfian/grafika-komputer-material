import { vertexShader, fragmentShader } from './utils/shaders';
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { initGUI } from './utils/gui';

// SCENE
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xa8def0);

// CAMERA
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.y = 3;
camera.position.z = 5;
camera.position.x = -3;

// RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// ORBIT CAMERA CONTROLS
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true
orbitControls.minDistance = 1
orbitControls.maxDistance = 15
orbitControls.maxPolarAngle = Math.PI / 2 - 0.05 // prevent camera below ground
orbitControls.minPolarAngle = Math.PI / 4        // prevent top down view
orbitControls.update();

const layer01 = new THREE.TextureLoader().load('/textures/BGnya.png');
layer01.wrapS = layer01.wrapT = THREE.RepeatWrapping;

const layer02 = new THREE.TextureLoader().load('/textures/Halorek.png');
layer02.wrapS = layer02.wrapT = THREE.RepeatWrapping;

const textureLayer01 = {
    colorMap: layer01,
    flowDirection: new THREE.Vector2(0.7, -0.5),
    flowSpeed: 0.0001,
    repeat: new THREE.Vector2(1,1)
}

const textureLayer02 = {
    colorMap: layer02,
    flowDirection: new THREE.Vector2(-0.7, 0.7),
    flowSpeed: 0.0001,
    repeat: new THREE.Vector2(2,2)
}

const uniforms = {
    textureLayer01: {
        value: textureLayer01
    },
    textureLayer02: {
        value: textureLayer02
    },
    time: {
        value: 1.0
    },
};

// MORPH OBJECT
const mesh = new THREE.Mesh(new THREE.BoxBufferGeometry(2, 2, 2, 256), new THREE.RawShaderMaterial( {
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    transparent: true,
} ));
scene.add(mesh);

var planeGeometry = new THREE.PlaneGeometry( 2, 2 );
planeGeometry.rotateX( - Math.PI / 2 );

var planeMaterial = new THREE.ShadowMaterial();
planeMaterial.opacity = 0.2;

var plane = new THREE.Mesh( planeGeometry, planeMaterial );
plane.receiveShadow = true;
scene.add( plane );


// ANIMATE
function animate() {
    uniforms.time.value = performance.now();
    orbitControls.update()
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
document.body.appendChild(renderer.domElement);
animate();

// RESIZE HANDLER
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize);

initGUI(uniforms);