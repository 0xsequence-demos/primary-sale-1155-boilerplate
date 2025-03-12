import { Billboard, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { FC, ReactNode, useRef, useState } from "react";
import * as THREE from "three";

const Word: FC<{ children: ReactNode }> = ({ children, ...props }) => {
  const color = new THREE.Color();
  const fontProps = {
    font: "/Inter-Bold.woff",
    fontSize: 0.2,
    letterSpacing: -0.05,
    lineHeight: 0.3,
    "material-toneMapped": false,
  };
  const ref = useRef();
  const [hovered, setHovered] = useState(false);
  const over = (e) => (e.stopPropagation(), setHovered(true));
  const out = () => setHovered(false);

  // Tie component to the render-loop
  useFrame(() => {
    ref.current?.material.color.lerp(
      color.set(hovered ? "#fa2720" : "white"),
      0.1,
    );
  });

  return (
    <Billboard {...props}>
      <Text
        position={[0, 0, 0]}
        ref={ref}
        onPointerOver={over}
        onPointerOut={out}
        {...fontProps}
      >
        {children}
      </Text>
    </Billboard>
  );
};

export default Word;
