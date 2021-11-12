import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { Flow } from 'three/examples/jsm/modifiers/CurveModifier.js'


import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'

import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js'
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js'

import { Aquarium }  from  './aquarium.js'
const Common = require("./lib/common.js")

let scene,
  camera,
  renderer,
  control,
  stats,
  fxaaPass,
  composer,
  aquarium

init()
animate()

function init() {
  scene = new THREE.Scene()
  scene.background = new THREE.Color( 0x000000 )
  //scene.background = new THREE.Color( 0x00bfff )
  //scene.background = new THREE.Color( 0xff1493 )
  //scene.background = new THREE.Color( 0x1e90ff )
  //scene.background = new THREE.Color( 0xba55d3 )

  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    500
  )
  camera.position.set(-1, 0, 24)
  camera.lookAt( scene.position )      


  // カメラコントローラーを作成
  const controls = new OrbitControls(camera, document.body)
  controls.zoomSpeed = 0.05

  //const light = new THREE.DirectionalLight( 0xffffff )
  //light.position.set(10, 10, 15)
  //light.intensity = 0.8
  //scene.add( light )


  //const spotLight = new THREE.SpotLight( 0xffffff );
  //spotLight.position.set( 0, 0, 25 );
  //spotLight.angle = 30 * 0.01745329252 
  //scene.add( spotLight )

  //
  const ambientLight = new THREE.AmbientLight( 0xffffff )
  ambientLight.intensity = 1.0
  scene.add( ambientLight )
  
  const axesHelper = new THREE.AxesHelper( 5 )
  scene.add( axesHelper )

  aquarium = new Aquarium(400)
  aquarium.eachFish( f => scene.add(f) )

  renderer = new THREE.WebGLRenderer( { antialias: true} )
  //renderer.setPixelRatio( window.devicePixelRatio )
  //renderer.setPixelRatio( 1.5 )
  //renderer.setPixelRatio( 1 )
  renderer.setSize( window.innerWidth, window.innerHeight )
  document.body.appendChild( renderer.domElement )

  fxaaPass = new ShaderPass( FXAAShader )
  const pixelRatio = renderer.getPixelRatio()
  fxaaPass.material.uniforms[ 'resolution' ].value.x = 1 / ( window.innerWidth  * pixelRatio )
  fxaaPass.material.uniforms[ 'resolution' ].value.y = 1 / ( window.innerHeight * pixelRatio )

  //const smaaPass = new SMAAPass( window.innerWidth * renderer.getPixelRatio(), window.innerHeight * renderer.getPixelRatio() )

  const renderPass = new RenderPass( scene, camera )
  composer = new EffectComposer( renderer )
  composer.addPass( renderPass )
  //composer.addPass( fxaaPass )
  //composer.addPass( smaaPass )

  stats = new Stats()
  //document.body.appendChild( stats.dom )

  window.addEventListener( 'resize', onWindowResize )
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize( window.innerWidth, window.innerHeight )
  composer.setSize( window.innerWidth, window.innerHeight )

  const pixelRatio = renderer.getPixelRatio()
  fxaaPass.material.uniforms[ 'resolution' ].value.x = 1 / ( window.innerWidth  * pixelRatio )
  fxaaPass.material.uniforms[ 'resolution' ].value.y = 1 / ( window.innerHeight * pixelRatio )
}

function animate() {
  requestAnimationFrame( animate )
  render()
}

function render() {
  //renderer.render( scene, camera )
  composer.render()

  aquarium.update()
  stats.update()

  renderer.info.reset()
}

//looks for key presses and logs them
document.body.addEventListener("keydown", function(e) {
  console.log(`key: ${e.key}`)

  switch(true) {
    case e.key == 'p':
      //console.log(`window.devicePixelRatio: ${window.devicePixelRatio}`)
      console.log(`Scene polycount     : ${renderer.info.render.triangles}`)
      console.log(`Active Drawcalls    : ${renderer.info.render.calls}`)
      console.log(`Textures in Memory  : ${renderer.info.memory.textures}`)
      console.log(`Geometries in Memory: ${renderer.info.memory.geometries}`)
      break

    case e.key == 's':
      {
        const s = aquarium.decreaseSpeed()
        console.log(`SpeeedScale: ${s}`)
      }
      break

    case e.key == 'S':
      {
        const s = aquarium.increaseSpeed()
        console.log(`SpeeedScale: ${s}`)
      }
      break

    default:
      break
  }
})
