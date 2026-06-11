"use client";

import React, { useRef, useLayoutEffect, useMemo } from 'react';
import { Canvas, useFrame, useLoader, ThreeEvent } from '@react-three/fiber';
import { ContactShadows, OrbitControls, Center, Html } from '@react-three/drei';
import * as THREE from 'three';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js';
import { withBasePath } from '@/lib/basePath';

const BUNNY_PLY_URL = withBasePath('/models/bunny.ply');

class SceneErrorBoundary extends React.Component<
  { url: string; children: React.ReactNode },
  { hasError: boolean; message?: string }
> {
  state: { hasError: boolean; message?: string } = { hasError: false };

  static getDerivedStateFromError(err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { hasError: true, message: msg };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Html center>
          <div className="max-w-[260px] text-white font-mono text-xs bg-black/60 p-3 rounded-lg border border-white/10 backdrop-blur-sm">
            <div className="font-bold mb-1">MODEL LOAD FAILED</div>
            <div className="opacity-80 break-all">{this.props.url}</div>
            {this.state.message && (
              <div className="mt-2 opacity-60 break-words">{this.state.message}</div>
            )}
          </div>
        </Html>
      );
    }
    return this.props.children;
  }
}

function InteractiveBunny({ url, isDarkMode }: { url: string; isDarkMode: boolean }) {
  const geometry = useLoader(PLYLoader, url) as THREE.BufferGeometry;
  const groupRef = useRef<THREE.Group>(null);
  const shaderRef = useRef<THREE.ShaderMaterial>(null);

  useLayoutEffect(() => {
    if (!geometry) return;
    geometry.computeVertexNormals();
    geometry.computeBoundingBox();
    const box = geometry.boundingBox;
    if (!box) return;
    const center = new THREE.Vector3();
    box.getCenter(center);
    geometry.translate(-center.x, -center.y, -center.z);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const scaleFactor = 1.2 / maxDim;
    geometry.scale(scaleFactor, scaleFactor, scaleFactor);
  }, [geometry]);

  useFrame((state) => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      shaderRef.current.uniforms.uPixelRatio.value = state.viewport.dpr;
    }
  });

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (shaderRef.current && groupRef.current) {
      const localPoint = groupRef.current.worldToLocal(e.point.clone());
      shaderRef.current.uniforms.uHover.value.copy(localPoint);
    }
  };

  const handlePointerLeave = () => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.uHover.value.set(9999, 9999, 9999);
    }
  };

  const materialArgs = useMemo(() => ({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(isDarkMode ? '#f4f0e8' : '#242321') },
      uAccent: { value: new THREE.Color('#cc785c') },
      uHover: { value: new THREE.Vector3(9999, 9999, 9999) },
      uInteractionRadius: { value: 0.3 },
      uInteractionStrength: { value: 0.22 },
      uPixelRatio: { value: 1 },
      uBaseOpacity: { value: isDarkMode ? 0.72 : 0.58 },
    },
    vertexShader: `
      uniform float uTime;
      uniform vec3 uHover;
      uniform float uInteractionRadius;
      uniform float uInteractionStrength;
      uniform float uPixelRatio;
      varying float vIntensity;
      void main() {
        vec3 newPosition = position;
        float dist = distance(position, uHover);
        float influence = smoothstep(uInteractionRadius, 0.0, dist);
        vec3 displacement = normal * influence * uInteractionStrength;
        float breath = sin(uTime * 1.4 + position.y * 5.0) * 0.008;
        newPosition += displacement + (normal * breath);
        vec4 viewPosition = viewMatrix * modelMatrix * vec4(newPosition, 1.0);
        gl_Position = projectionMatrix * viewPosition;
        gl_PointSize = (4.0 + influence * 8.0) * uPixelRatio;
        gl_PointSize *= (1.0 / -viewPosition.z);
        vIntensity = influence;
      }
    `,
    fragmentShader: `
      varying float vIntensity;
      uniform vec3 uColor;
      uniform vec3 uAccent;
      uniform float uBaseOpacity;
      void main() {
        float d = distance(gl_PointCoord, vec2(0.5));
        if(d > 0.5) discard;
        vec3 finalColor = mix(uColor, uAccent, vIntensity);
        float alpha = (uBaseOpacity + vIntensity * 0.28) * smoothstep(0.5, 0.08, d);
        gl_FragColor = vec4(finalColor, alpha);
      }
    `,
  }), [isDarkMode]);

  return (
    <group ref={groupRef} position={[0, 0.05, 0]} rotation={[0, -0.18, 0]}>
      <mesh onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}>
        <primitive object={geometry} />
        <meshPhysicalMaterial
          color={isDarkMode ? '#191917' : '#d8d0c3'}
          roughness={isDarkMode ? 0.38 : 0.62}
          metalness={isDarkMode ? 0.25 : 0.04}
          clearcoat={isDarkMode ? 0.28 : 0.12}
          clearcoatRoughness={0.7}
          transparent
          opacity={isDarkMode ? 0.5 : 0.88}
        />
      </mesh>
      <points scale={1.012}>
        <primitive object={geometry} />
        <shaderMaterial
          key={isDarkMode ? 'bunny-points-dark' : 'bunny-points-light'}
          ref={shaderRef}
          attach="material"
          args={[materialArgs]}
          transparent
          depthWrite={false}
          toneMapped={false}
        />
      </points>
    </group>
  );
}

function DisplayPlinth({ isDarkMode }: { isDarkMode: boolean }) {
  const lineColor = isDarkMode ? '#716d66' : '#9c9183';

  return (
    <group position={[0, -0.63, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh>
        <ringGeometry args={[0.72, 0.725, 128]} />
        <meshBasicMaterial color={lineColor} transparent opacity={0.34} />
      </mesh>
      <mesh>
        <ringGeometry args={[0.93, 0.934, 128]} />
        <meshBasicMaterial color={lineColor} transparent opacity={0.16} />
      </mesh>
    </group>
  );
}

function LoadingBunny() {
  return (
    <Html center>
      <div className="rounded-full border border-black/10 bg-warm-surface/80 px-4 py-2 font-mono text-xs text-warm-muted backdrop-blur-sm whitespace-nowrap">
        Loading geometry
      </div>
    </Html>
  );
}

export default function HomeHeroScene({ isDarkMode }: { isDarkMode: boolean }) {
  return (
    <Canvas
      style={{ width: '100%', height: '100%' }}
      camera={{ position: [0, 0.08, 3.15], fov: 35 }}
      dpr={[1, 2]}
      shadows
      gl={{ powerPreference: 'high-performance', antialias: true }}
    >
      <color attach="background" args={[isDarkMode ? '#11110f' : '#f5f0e8']} />
      <ambientLight intensity={isDarkMode ? 0.72 : 1.2} />
      <directionalLight
        castShadow
        position={[-2.5, 3.5, 3]}
        intensity={isDarkMode ? 2.2 : 2.8}
        color={isDarkMode ? '#fff4e8' : '#fffaf2'}
      />
      <directionalLight
        position={[3, 0.5, -2]}
        intensity={isDarkMode ? 1.4 : 0.8}
        color={isDarkMode ? '#cc785c' : '#dba58f'}
      />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableDamping
        dampingFactor={0.07}
        minPolarAngle={Math.PI * 0.32}
        maxPolarAngle={Math.PI * 0.68}
        rotateSpeed={0.42}
      />
      <React.Suspense fallback={<LoadingBunny />}>
        <Center>
          <SceneErrorBoundary url={BUNNY_PLY_URL}>
            <InteractiveBunny url={BUNNY_PLY_URL} isDarkMode={isDarkMode} />
          </SceneErrorBoundary>
          <DisplayPlinth isDarkMode={isDarkMode} />
          <ContactShadows
            position={[0, -0.65, 0]}
            opacity={isDarkMode ? 0.42 : 0.24}
            scale={2.6}
            blur={2.8}
            far={2.2}
            color={isDarkMode ? '#000000' : '#6d6257'}
          />
        </Center>
      </React.Suspense>
    </Canvas>
  );
}


