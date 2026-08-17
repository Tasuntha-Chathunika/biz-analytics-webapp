import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';

function LogoMesh() {
  const meshRef = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.y = t * 1.2;
    meshRef.current.rotation.x = Math.sin(t) * 0.4;
  });

  return (
    <Float speed={2.5} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <octahedronGeometry args={[1.2, 0]} />
        <meshPhysicalMaterial 
          color="#8b5cf6"
          emissive="#4f46e5"
          emissiveIntensity={0.4}
          roughness={0.1}
          metalness={0.9}
          clearcoat={1}
          clearcoatRoughness={0.1}
          transparent={true}
          opacity={0.95}
        />
      </mesh>
    </Float>
  );
}

export default function Navbar3DLogo() {
  return (
    <div className="w-12 h-12 flex items-center justify-center -ml-2 shrink-0 drop-shadow-xl" style={{ filter: 'drop-shadow(0px 0px 10px rgba(99,102,241,0.6))' }}>
      <Canvas camera={{ position: [0, 0, 3.5], fov: 50 }} style={{ width: '100%', height: '100%' }}>
        <ambientLight intensity={1.5} />
        <spotLight position={[5, 5, 5]} angle={0.2} penumbra={1} intensity={2} color="#ec4899" />
        <pointLight position={[-5, -5, -5]} intensity={1.5} color="#38bdf8" />
        <LogoMesh />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
