import { useSpring } from "@react-spring/three";
import { Clone, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { Group } from "three";
import { a } from "@react-spring/three";
import { Card } from "./Card";

function Chest() {
  const [chestStatus, setChestStatus] = useState<
    "closed" | "shaking" | "open" | "spinning"
  >("closed");
  const [hovered, setHovered] = useState(false);

  const { hover } = useSpring({
    hover: hovered ? 1.15 : 1,
    config: { tension: 300, friction: 10 },
  });

  const pointerEvents = useMemo(() => {
    return chestStatus === "open" ? "none" : "auto";
  }, [chestStatus]);

  useEffect(() => {
    if (chestStatus !== "shaking") return;

    const timer = setTimeout(() => {
      setChestStatus("open");
    }, 2000);
    return () => clearTimeout(timer);
  }, [chestStatus]);

  const openPack = () => {
    if (chestStatus === "open") return;

    setChestStatus("shaking");
  };

  const handleClick = () => {
    setChestStatus("spinning");
    setTimeout(openPack, 500);
  };

  const { nodes } = useGLTF("/chest.glb");
  const chestRef = useRef<Group | null>(null);
  const shakerRef = useRef<Group | null>(null);
  const lidProxy = useRef<Group | null>(null);
  const { spring: openSpring, scale: openScale } = useSpring({
    spring: chestStatus === "open" ? 1 : 0,
    scale: chestStatus === "open" ? 0 : 1,
    config: {
      mass: 25,
      tension: 400,
      friction: 50,
      precision: 0.0001,
      clamp: true,
    },
  });
  const { spring: shakeSpring } = useSpring({
    spring: chestStatus === "shaking" ? 1 : 0,
    config: {
      mass: 25,
      tension: 400,
      friction: 50,
      precision: 0.0001,
      clamp: true,
    },
  });
  // const rotation = openSpring.to([0, 1], [0, Math.PI * 0.65]);

  const rotation = openSpring.to(
    [0, 1],
    [0, chestStatus === "spinning" ? Math.PI * 2 : Math.PI * 0.65],
  );
  const shaking = shakeSpring.to([0, 1], [0, Math.PI * 0.65]);
  useFrame(({ clock }) => {
    if (!chestRef.current) {
      return;
    }
    const now = clock.getElapsedTime();

    chestRef.current.rotation.y = Math.sin(now) * 0.1;
    chestRef.current.rotation.z = Math.sin(now * 2) * 0.1;
    chestRef.current.children[0].rotation.x =
      lidProxy.current!.rotation.x * 0.2 +
      Math.PI +
      Math.sin(clock.elapsedTime * 30) * shakerRef.current!.rotation.z * 0.01;
    chestRef.current.children[0].rotation.z =
      Math.PI +
      Math.cos(clock.elapsedTime * 30) * shakerRef.current!.rotation.z * 0.01;
    chestRef.current.children[0].rotation.y =
      Math.cos(clock.elapsedTime * 15) * shakerRef.current!.rotation.z * 0.01;
    chestRef.current.children[0].children[2].rotation.x =
      lidProxy.current!.rotation.x;
  });

  return (
    <>
      <group rotation={[0.5, 0, 0]}>
        <a.object3D ref={lidProxy} rotation-x={rotation}></a.object3D>
        <a.object3D ref={shakerRef} rotation-z={shaking}></a.object3D>
        <a.object3D
          ref={chestRef}
          scale={chestStatus === "open" ? openScale : hover}
          onClick={handleClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          style={{ cursor: pointerEvents === "auto" ? "pointer" : "default" }}
        >
          <Clone
            scale={[4, 4, 4]}
            position={[0, -1.75, 0]}
            object={nodes["chest-bottom"]}
          />
        </a.object3D>
      </group>
      <Card isChestOpen={chestStatus === "open"} />
    </>
  );
}

useGLTF.preload("/chest.glb");

export default Chest;
