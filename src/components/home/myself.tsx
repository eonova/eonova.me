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
  const mySelfRef = useRef()

  // 导入人物文件
  const model = useLoader(
    GLTFLoader,
    '/models/myself.glb',
  )

  return (
    <Canvas
      camera={{ position: [1, 1, 2] }}
    >
      <Orbit />
      <mesh ref={mySelfRef}>
        <hemisphereLight intensity={0.15} groundColor="black" />
        <ambientLight />
        <primitive
          object={model.scene}
          scale={0.7}
        />
      </mesh>
    </Canvas>
  )
}

export default MySelf
