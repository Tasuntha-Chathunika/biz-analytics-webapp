import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

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

function NetworkParticles({ count = 350 }) {
  const pointsRef = useRef();
  const linesRef = useRef();
  const maxDistance = 0.45; // Distance threshold to draw a line
  const { viewport } = useThree();

  const [positions, velocities, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = [];
    const colors = new Float32Array(count * 3);
    const color = new THREE.Color();
    
    for (let i = 0; i < count; i++) {
      // Spread particles across a larger area
      positions[i * 3] = (Math.random() - 0.5) * 8; // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8; // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2; // z
      
      // Random velocities
      velocities.push({
        x: (Math.random() - 0.5) * 0.005,
        y: (Math.random() - 0.5) * 0.005,
        z: (Math.random() - 0.5) * 0.005,
      });

      // Colorful theme matching Antigravity / BizAnalytics (Indigo, Pink, Sky Blue)
      const rand = Math.random();
      if (rand > 0.6) color.set('#6366f1');
      else if (rand > 0.3) color.set('#ec4899');
      else color.set('#38bdf8');
      color.toArray(colors, i * 3);
    }
    return [positions, velocities, colors];
  }, [count]);

  // Buffer for line positions. Each connection has 2 vertices (6 floats)
  // Max possible connections is (count * (count - 1)) / 2
  // We'll allocate a safe buffer size since not all will connect
  const maxLines = 4000;
  const linePositions = useMemo(() => new Float32Array(maxLines * 6), []);

  useFrame(() => {
    let vertexpos = 0;
    let numConnected = 0;
    
    // Scale mouse coordinates to world space approx
    const targetX = mouse.x * (viewport.width / 2);
    const targetY = mouse.y * (viewport.height / 2);

    for (let i = 0; i < count; i++) {
      // Apply velocity
      positions[i * 3] += velocities[i].x;
      positions[i * 3 + 1] += velocities[i].y;
      positions[i * 3 + 2] += velocities[i].z;

      // Boundary wrap-around
      if (positions[i * 3] < -4) positions[i * 3] = 4;
      if (positions[i * 3] > 4) positions[i * 3] = -4;
      if (positions[i * 3 + 1] < -4) positions[i * 3 + 1] = 4;
      if (positions[i * 3 + 1] > 4) positions[i * 3 + 1] = -4;
      if (positions[i * 3 + 2] < -1) positions[i * 3 + 2] = 1;
      if (positions[i * 3 + 2] > 1) positions[i * 3 + 2] = -1;

      // Mouse repel interaction (Antigravity effect)
      const dx = positions[i*3] - targetX;
      const dy = positions[i*3+1] - targetY;
      const dist = Math.sqrt(dx*dx + dy*dy);
      
      if (dist < 1.5) {
        // Push particles away from the mouse
        const force = (1.5 - dist) * 0.02;
        positions[i*3] += (dx / dist) * force;
        positions[i*3+1] += (dy / dist) * force;
      }
    }
    
    // Update particle positions
    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    // Connect close particles with lines
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3];
        const dz = positions[i * 3 + 2] - positions[j * 3];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        if (dist < maxDistance && numConnected < maxLines) {
          linePositions[vertexpos++] = positions[i * 3];
          linePositions[vertexpos++] = positions[i * 3 + 1];
          linePositions[vertexpos++] = positions[i * 3 + 2];
          
          linePositions[vertexpos++] = positions[j * 3];
          linePositions[vertexpos++] = positions[j * 3 + 1];
          linePositions[vertexpos++] = positions[j * 3 + 2];
          numConnected++;
        }
      }
    }
    
    // Update line positions
    linesRef.current.geometry.setDrawRange(0, numConnected * 2);
    linesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.03} vertexColors transparent opacity={0.9} sizeAttenuation={true} />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={maxLines * 2} array={linePositions} itemSize={3} />
        </bufferGeometry>
        {/* Colorful gradient look for lines can be simulated with blending or basic colors. 
            Indigo-ish color fits light themes very well. */}
        <lineBasicMaterial color="#6366f1" transparent opacity={0.15} depthWrite={false} />
      </lineSegments>
    </group>
  );
}

export default function ThreeBackground() {
  return (
    <div className="absolute inset-0 z-[-1] overflow-hidden pointer-events-none" style={{ background: '#FAFAFA' }}>
      <MouseTracker />
      {/* 
         Rotate the entire canvas slowly for an overarching dynamic movement 
      */}
      <Canvas camera={{ position: [0, 0, 3], fov: 60 }}>
        <ambientLight intensity={1} />
        <NetworkParticles count={400} />
      </Canvas>
    </div>
  );
}
