import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useSpring, animated } from "@react-spring/three";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";

interface CardProps {
  isChestOpen: boolean;
  position?: [number, number, number];
  imageNumber?: number;
}

const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export function Card(props: CardProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  // Track rotation state
  const rotationState = useRef({
    totalRotation: 0,
    isPaused: false,
    pauseTimer: 0,
  });

  const imageNumber = useMemo(
    () => props.imageNumber || getRandomInt(1, 22),
    [props.imageNumber],
  );

  // Create texture loader with error handling
  const textures = useTexture({
    front: `/img-${imageNumber}.png`,
    back: "/card-bg.png",
  });

  const { scale, rotation } = useSpring({
    scale: props.isChestOpen ? 2 : 0,
    rotation: props.isChestOpen ? [0, Math.PI * 4, 0] : [0, 0, 0],
    config: {
      mass: 1,
      tension: 170,
      friction: 26,
    },
  });

  useFrame((_, delta) => {
    if (meshRef.current && props.isChestOpen) {
      const state = rotationState.current;

      // Check if we're in pause state
      if (state.isPaused) {
        state.pauseTimer += delta;
        // Resume rotation after 5 seconds
        if (state.pauseTimer >= 5) {
          state.isPaused = false;
          state.pauseTimer = 0;
        }
        return;
      }

      // Continue rotation
      meshRef.current.rotation.y += delta * 0.8;
      state.totalRotation += delta * 0.8;

      // Check if we completed a full rotation (2π radians)
      if (state.totalRotation >= Math.PI * 2) {
        state.isPaused = true;
        state.totalRotation = 0;
      }
    }
  });

  return (
    <animated.mesh
      ref={meshRef}
      position={props.position}
      scale={scale}
      rotation={rotation}
    >
      {/* Front of card */}
      <planeGeometry args={[1.5, 2]} />
      <meshStandardMaterial
        map={textures.front}
        side={THREE.FrontSide}
        metalness={0.5}
        roughness={0.4}
      />

      {/* Back of card */}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[1.5, 2]} />
        <meshStandardMaterial
          map={textures.back}
          side={THREE.BackSide}
          metalness={0.5}
          roughness={0.4}
        />
      </mesh>
    </animated.mesh>
  );
}
