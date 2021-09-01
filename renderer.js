import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { Flow } from 'three/examples/jsm/modifiers/CurveModifier.js';
import { Aquarium }  from  './aquarium.js'
const Common = require("./lib/common.js")

let scene,
  camera,
  renderer,
  control,
  stats,
  aquarium

init();
animate()

function init() {

  scene = new THREE.Scene()
  //scene.background = new THREE.Color( 0x00bfff )
  //scene.background = new THREE.Color( 0xff1493 )
  scene.background = new THREE.Color( 0x1e90ff )
  //scene.background = new THREE.Color( 0x000000 )
  //scene.background = new THREE.Color( 0xba55d3 )

  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    500
  );
  camera.position.set(0, 0, 10)
  camera.lookAt( scene.position )      


  // カメラコントローラーを作成
  const controls = new OrbitControls(camera, document.body);
  controls.zoomSpeed = 0.05

  //const light = new THREE.DirectionalLight( 0xffffff );
  //light.position.set(10, 10, 15)
  //light.intensity = 0.8
  //scene.add( light )
  //
  //const light2 = new THREE.AmbientLight( 0x87ceeb );
  //light2.intensity = 0.6
  //scene.add( light2 );
  //
  //const axesHelper = new THREE.AxesHelper( 5 );
  //scene.add( axesHelper );

  aquarium = new Aquarium(300)
  aquarium.eachFish( f => scene.add(f) )

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  stats = new Stats();
  document.body.appendChild( stats.dom );

  window.addEventListener( 'resize', onWindowResize );
}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {
  requestAnimationFrame( animate );
  render();
}

function render() {
  renderer.render( scene, camera )

  aquarium.update()
  stats.update()
}

//looks for key presses and logs them
document.body.addEventListener("keydown", function(e) {
  console.log(`key: ${e.key}`);

  switch(true) {
    case e.key == 'p':
      console.log(camera)
      break

    default:
      break
  }
});




