import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useSpring, animated } from "@react-spring/three";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import { JOKERS } from "~/jokers";
import Word from "./Word";
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

  const imageNumber = useMemo(() => getRandomInt(1, 155), [props.imageNumber]);
  const joker = JOKERS[imageNumber];

  // Create texture loader with error handling
  const textures = useTexture({
    front: `/jokers-wiki-fandom/${joker.Name.split(" ").join("_")}.png`,
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

      // Ensure the card starts at 0 degrees (front face seen)
      if (state.totalRotation === 0) {
        meshRef.current.rotation.y = 0;
      }
      const rotationStep = delta * 0.8;

      // Check if next step would exceed 2π
      if (state.totalRotation + rotationStep >= Math.PI * 2) {
        meshRef.current.rotation.y = Math.PI * 2; // Snap to exact 2π
        state.totalRotation = 0; // Reset rotation count
        state.isPaused = true; // Pause rotation
      } else {
        meshRef.current.rotation.y += rotationStep;
        state.totalRotation += rotationStep;
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
        metalness={0.9}
        roughness={0.9}
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

      <Word position={[0, -1.3, 0]}>{joker.Name}</Word>
      <Word position={[0, -1.5, 0]}>{joker.Rarity}</Word>
    </animated.mesh>
  );
}
