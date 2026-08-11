import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial, MeshDistortMaterial, Float, Sparkles, Trail } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';

const mouse = { x: 0, y: 0 };

function MouseTracker() {
  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  return null;
}

// The beautiful fluid orb that loosely floats in the center
function FloatingOrb() {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      const targetX = mouse.x * 1.5;
      const targetY = mouse.y * 1.5;
      meshRef.current.position.x += (targetX - meshRef.current.position.x) * 0.02;
      meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.02;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef} position={[0, 0, -3]} scale={2}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          color="#a855f7"
          attach="material"
          distort={0.4}
          speed={3}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.12}
        />
      </mesh>
    </Float>
  );
}

// The new Motion Graphic that perfectly trails the mouse
function MouseFollower3D() {
  const meshRef = useRef();
  const { viewport } = useThree();

  useFrame((state) => {
    if (meshRef.current) {
      // Unproject mouse coordinates to 3D world space
      const targetX = (state.pointer.x * viewport.width) / 2;
      const targetY = (state.pointer.y * viewport.height) / 2;
      
      // Smooth spring follow
      meshRef.current.position.x += (targetX - meshRef.current.position.x) * 0.08;
      meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.08;
      
      // Add a slight spin based on movement speed
      meshRef.current.rotation.x += 0.05;
      meshRef.current.rotation.y += 0.05;
    }
  });

  return (
    <Trail
      width={1.5}
      color="#ec4899"
      length={8}
      decay={1.5}
      local={false}
      stride={0}
      interval={1}
    >
      <mesh ref={meshRef} position={[0, 0, -1]}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <MeshDistortMaterial 
          color="#6366f1" 
          emissive="#38bdf8"
          emissiveIntensity={2}
          distort={0.8} 
          speed={6} 
          roughness={0} 
          transparent 
          opacity={0.8} 
        />
      </mesh>
    </Trail>
  );
}

function ParticleSwarm({ color, radius, count, speed }) {
  const pointsRef = useRef();
  const groupRef = useRef();
  
  const sphere = useMemo(() => random.inSphere(new Float32Array(count * 3), { radius }), [count, radius]);
  
  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.x -= delta * speed.x;
      pointsRef.current.rotation.y -= delta * speed.y;
    }
    
    if (groupRef.current) {
      const targetX = mouse.y * Math.PI * 0.15;
      const targetY = mouse.x * Math.PI * 0.15;
      
      groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.05;
      groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.05;
      
      const targetScale = 1 + (Math.abs(mouse.x) + Math.abs(mouse.y)) * 0.06;
      groupRef.current.scale.x += (targetScale - groupRef.current.scale.x) * 0.05;
      groupRef.current.scale.y += (targetScale - groupRef.current.scale.y) * 0.05;
      groupRef.current.scale.z += (targetScale - groupRef.current.scale.z) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <group rotation={[0, 0, Math.PI / 4]}>
        <Points ref={pointsRef} positions={sphere} stride={3} frustumCulled={false}>
          <PointMaterial
            transparent
            color={color}
            size={0.012}
            sizeAttenuation={true}
            depthWrite={false}
            opacity={0.8}
          />
        </Points>
      </group>
    </group>
  );
}

export default function ThreeBackground() {
  return (
    <div className="absolute inset-0 z-[-1] overflow-hidden pointer-events-none" style={{ background: '#FAFAFA' }}>
      <MouseTracker />
      <Canvas camera={{ position: [0, 0, 1] }}>
        <ambientLight intensity={1} />
        <directionalLight position={[2, 2, 5]} intensity={2} color="#ec4899" />
        <directionalLight position={[-2, -2, -5]} intensity={2} color="#6366f1" />
        
        {/* The new active mouse follower with a trail */}
        <MouseFollower3D />
        
        {/* Background ambient magic */}
        <FloatingOrb />
        <Sparkles count={150} scale={10} size={3} speed={0.4} opacity={0.3} color="#a855f7" />
        <Sparkles count={100} scale={12} size={2} speed={0.6} opacity={0.2} color="#ec4899" />
        
        <ParticleSwarm color="#6366f1" radius={1.6} count={2500} speed={{ x: 0.1, y: 0.15 }} />
        <ParticleSwarm color="#ec4899" radius={1.3} count={2000} speed={{ x: -0.08, y: 0.2 }} />
        <ParticleSwarm color="#10b981" radius={1.9} count={1500} speed={{ x: 0.07, y: -0.1 }} />
        <ParticleSwarm color="#8b5cf6" radius={1.1} count={1500} speed={{ x: -0.12, y: -0.12 }} />
      </Canvas>
    </div>
  );
}
