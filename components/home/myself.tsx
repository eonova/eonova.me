import { Canvas, extend, useLoader, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

extend({ OrbitControls })

function Orbit() {
  const { camera, gl } = useThree()
  return <orbitControls args={[camera, gl.domElement]} />
}

function MySelf() {
  const mySelfRef = useRef(null)

  // 导入人物文件
  const model = useLoader(
    GLTFLoader,
    'https://models.readyplayer.me/67980e554b06bed92d75ee75.glb',
  )

  return (
    <div style={{ height: '100vh', width: '100wh' }}>
      <Canvas
        style={{ backgroundColor: 'black' }}
        camera={{ position: [1, 1, 2] }}
      >
        <Orbit />
        <mesh ref={mySelfRef}>
          <hemisphereLight intensity={0.15} groundColor="black" />
          <ambientLight />
          <primitive object={model.scene} scale={0.7} />
        </mesh>
      </Canvas>
    </div>
  )
}

export default MySelf
