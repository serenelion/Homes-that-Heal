
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, DeviceOrientationControls, Float, MeshDistortMaterial, Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { DetectedObject, AppPhase, RiskLevel } from '../types';
import { RISK_COLORS } from '../constants';

interface ARSceneProps {
  objects: DetectedObject[];
  phase: AppPhase;
}

const ThreatNode: React.FC<{ obj: DetectedObject; phase: AppPhase }> = ({ obj, phase }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const color = RISK_COLORS[obj.risk];
  const isHarmonized = phase === AppPhase.HARMONIZING || phase === AppPhase.SUMMARY;

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y = obj.position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group position={obj.position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <MeshDistortMaterial
          color={isHarmonized ? '#10b981' : color}
          speed={isHarmonized ? 2 : 5}
          distort={isHarmonized ? 0.2 : 0.6}
          opacity={0.6}
          transparent
        />
      </mesh>
      
      {/* Visual Connection Lines for Harmonized State */}
      {isHarmonized && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.5, 0.01, 16, 100]} />
          <meshBasicMaterial color="#00ff80" transparent opacity={0.3} />
        </mesh>
      )}

      <Billboard>
        <Text
          position={[0, 0.6, 0]}
          fontSize={0.12}
          color="white"
          font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZg.ttf"
        >
          {obj.label.toUpperCase()}
          {`\n${isHarmonized ? 'PROTECTED' : obj.risk + ' RISK'}`}
        </Text>
      </Billboard>
    </group>
  );
};

const SceneContent: React.FC<ARSceneProps> = ({ objects, phase }) => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      {objects.map((obj) => (
        <ThreatNode key={obj.id} obj={obj} phase={phase} />
      ))}
      <DeviceOrientationControls />
    </>
  );
};

export const ARScene: React.FC<ARSceneProps> = ({ objects, phase }) => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas shadows camera={{ position: [0, 0, 0], fov: 75 }}>
        <SceneContent objects={objects} phase={phase} />
      </Canvas>
    </div>
  );
};
