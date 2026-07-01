import { Suspense, useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, OrbitControls, Center, Environment, Float, Grid, Sparkles } from '@react-three/drei'

import pcModelUrl from '../../assets/pc.glb?url'

function PulsingLight({ color = "#4dd0ce" }) {
  const lightRef = useRef()
  useFrame(({ clock }) => {
    if (lightRef.current) {
      // Very subtle pulse between 1.5 and 2.0
      lightRef.current.intensity = 1.75 + Math.sin(clock.elapsedTime * 1.5) * 0.25
    }
  })
  return <pointLight ref={lightRef} position={[0, 0, -3]} color={color} distance={8} />
}



function Model() {
  const { scene } = useGLTF(pcModelUrl)
  
  return (
    <Float
      speed={2}
      rotationIntensity={0.5}
      floatIntensity={0.5}
      floatingRange={[-0.1, 0.1]}
    >
      <primitive object={scene} scale={0.28} rotation={[0, -Math.PI / 2, 0]} position={[0, -0.25, 0]} />
    </Float>
  )
}

function Fallback() {
  return (
    <mesh>
      <boxGeometry args={[1,0.6,0.4]} />
      <meshStandardMaterial color="#262630" wireframe />
    </mesh>
  )
}

export default function PCModel() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.5], fov: 40 }}
      style={{ width: '100%', height: '100%', cursor: 'grab', touchAction: 'none' }}
    >
      {/* Lighting tailored for the cyberpunk terminal theme */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 2]} intensity={1.5} color="#ffffff" />
      <directionalLight position={[-5, 5, 5]} intensity={0.5} color="#4dd0ce" />
      <pointLight position={[0, -2, -2]} intensity={1} color="#e06c75" />
      
      {/* Subtle pulsing backlight glow */}
      <PulsingLight color="#4dd0ce" />

      {/* Subtle floating dots/snow effect */}
      <Sparkles count={100} scale={6} size={1.2} speed={0.3} opacity={0.4} color="#4dd0ce" position={[0, 0, -1.5]} />
      
      {/* Cyberspace terminal grid floor */}
      <Grid 
        position={[0, -0.8, 0]} 
        args={[10, 10]} 
        cellSize={0.2} 
        cellThickness={0.5} 
        cellColor="#1a1a24" 
        sectionSize={1} 
        sectionThickness={1} 
        sectionColor="#4dd0ce" 
        fadeDistance={4} 
        fadeStrength={2} 
      />
      
      <Environment preset="city" />

      <Suspense fallback={<Fallback />}>
        <Center>
          <Model />
        </Center>
      </Suspense>
      
      <OrbitControls
        autoRotate
        autoRotateSpeed={-1.5}
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 2 + 0.1}
        minPolarAngle={Math.PI / 3}
      />
    </Canvas>
  )
}
