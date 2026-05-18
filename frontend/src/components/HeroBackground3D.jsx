import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial, Float, Stars } from '@react-three/drei'
import * as THREE from 'three'

function GlowOrb({ position, color, speed = 1, distort = 0.4, scale = 1 }) {
  const meshRef = useRef()
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.1 * speed
      meshRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.07 * speed) * 0.25
    }
  })
  return (
    <Float speed={speed} rotationIntensity={0.3} floatIntensity={0.7}>
      <Sphere ref={meshRef} args={[1, 64, 64]} position={position} scale={scale}>
        <MeshDistortMaterial
          color={color} attach="material" distort={distort}
          speed={2} roughness={0} metalness={0.2}
          transparent opacity={0.14}
        />
      </Sphere>
    </Float>
  )
}

function ParticleRing({ count = 100, radius = 5, color = '#c8a96a' }) {
  const ref = useRef()
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      const r = radius + (Math.random() - 0.5) * 2
      pos[i * 3]     = Math.cos(angle) * r
      pos[i * 3 + 1] = (Math.random() - 0.5) * 2.5
      pos[i * 3 + 2] = Math.sin(angle) * r
    }
    return pos
  }, [count, radius])

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.05
  })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={color} size={0.035} transparent opacity={0.6} sizeAttenuation />
    </points>
  )
}

function FloatingGem({ position, color, speed = 0.5 }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.x = clock.getElapsedTime() * speed * 0.4
      ref.current.rotation.z = clock.getElapsedTime() * speed * 0.25
    }
  })
  return (
    <Float speed={speed * 0.8} rotationIntensity={0.5}>
      <mesh ref={ref} position={position}>
        <octahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial color={color} transparent opacity={0.25} wireframe />
      </mesh>
    </Float>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]}   color="#c8a96a" intensity={2.5} />
      <pointLight position={[-5, -3, -5]} color="#d4928a" intensity={1.8} />
      <pointLight position={[0, 8, 0]}   color="#e8c99a" intensity={1.2} />

      <Stars radius={22} depth={60} count={2500} factor={3.5} saturation={0} fade speed={0.8} />

      <GlowOrb position={[-4, 1, -3]}  color="#b8935a" speed={0.7}  distort={0.45} scale={3.2} />
      <GlowOrb position={[4.5,-1,-4]}  color="#c4827a" speed={1.1}  distort={0.3}  scale={2.6} />
      <GlowOrb position={[0, 3, -6]}   color="#a07840" speed={0.55} distort={0.55} scale={2.0} />
      <GlowOrb position={[-2,-2,-2]}   color="#d4928a" speed={1.3}  distort={0.28} scale={1.3} />

      <ParticleRing count={120} radius={6} color="#c8a96a" />
      <ParticleRing count={70}  radius={9} color="#d4928a" />

      <FloatingGem position={[-3.5, 2, -1]}  color="#d4a96a" speed={0.65} />
      <FloatingGem position={[3.8, 1.5, -2]} color="#e8a4a4" speed={0.85} />
      <FloatingGem position={[1.5,-2.5,-1.5]} color="#c8b070" speed={0.5} />
      <FloatingGem position={[-1.5,3.5,-3]}  color="#d4928a" speed={1.0} />
    </>
  )
}

export default function HeroBackground3D() {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }} gl={{ antialias: true, alpha: true }} dpr={[1, 1.5]}>
        <Scene />
      </Canvas>
    </div>
  )
}
