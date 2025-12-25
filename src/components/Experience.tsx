
import React, { useContext } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import TreeSystem from './TreeSystem';
import CrystalOrnaments from './CrystalOrnaments';
import { TreeContext, TreeContextType } from '../types';

const Rig = () => {
  const { state, zoomOffset } = useContext(TreeContext) as TreeContextType;
  useFrame((state3d) => {
    // Gentle floating camera movement
    const t = state3d.clock.getElapsedTime();
    // Move camera out when Chaos, in when Formed
    // Apply zoomOffset (clamped to avoid clipping)
    const baseZ = state === 'CHAOS' ? 22 : 16;
    const targetZ = Math.max(5, Math.min(baseZ + zoomOffset, 50));
    const targetY = state === 'CHAOS' ? 2 : 0;

    state3d.camera.position.z = THREE.MathUtils.lerp(state3d.camera.position.z, targetZ + Math.sin(t * 0.2) * 2, 0.02);
    state3d.camera.position.y = THREE.MathUtils.lerp(state3d.camera.position.y, targetY + Math.cos(t * 0.2) * 1, 0.02);
    state3d.camera.lookAt(0, 0, 0);
  });
  return null;
};

const Experience: React.FC = () => {
  return (
    <Canvas
      dpr={[1, 1.25]}
      camera={{ position: [0, 0, 18], fov: 45, near: 0.1, far: 100 }}
      gl={{
        antialias: false,
        alpha: true, // 启用透明度
        toneMapping: THREE.ReinhardToneMapping,
        toneMappingExposure: 1.5,
        stencil: false,
        depth: true
      }}
    >
      {/* 移除背景色，让摄像头背景可见 */}

      {/* Cinematic Lighting */}
      <ambientLight intensity={0.4} color="#001133" />
      <spotLight
        position={[10, 20, 10]}
        angle={0.5}
        penumbra={1}
        intensity={6}
        color="#fff0dd"
      />
      <pointLight position={[-10, -5, -10]} intensity={2} color="#004225" />
      <pointLight position={[0, 0, 0]} intensity={0.8} color="#ffaa00" distance={10} />

      {/* Environment */}
      <Stars radius={40} depth={30} count={800} factor={2} saturation={0} fade speed={0.6} />

      {/* 多层次闪光星星 - 模拟真实夜空中部分星星闪烁 */}
      {/* 慢速闪烁的金色星星 */}
      <Sparkles count={120} scale={20} size={3} speed={0.25} opacity={0.5} color="#ffd700" />
      <Sparkles count={80} scale={22} size={2} speed={0.2} opacity={0.3} color="#ffffff" />

      {/* Main Content */}
      <group position={[0, -2, 0]}>
        <TreeSystem />
        <CrystalOrnaments />
      </group>

      {/* Controls & Rig */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={8}
        maxDistance={40}
        maxPolarAngle={Math.PI / 1.6}
        target={[0, 2, 0]}
      />
      <Rig />

      {/* Post Processing - Lightweight */}
      <EffectComposer enableNormalPass={false}>
        <Bloom
          luminanceThreshold={1.0}
          intensity={0.4}
          radius={0.3}
        />
      </EffectComposer>
    </Canvas>
  );
};

export default Experience;
