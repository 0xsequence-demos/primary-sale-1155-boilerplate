import { useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls, useTexture } from "@react-three/drei";
import type * as THREE from "three";
import { Button } from "@0xsequence/design-system";
import { cn } from "~/utils/classnames";

// Sample pack data
const packs = [
  {
    id: 1,
    name: "Standard Pack",
    image: "packs/Standard_Normal_1.webp",
    price: "$3.99",
  },
  {
    id: 2,
    name: "Premium Pack",
    image: "packs/Standard_Normal_2.webp",
    price: "$7.99",
  },
  {
    id: 3,
    name: "Ultimate Pack",
    image: "packs/Standard_Normal_3.webp",
    price: "$12.99",
  },
  {
    id: 4,
    name: "Limited Edition",
    image: "packs/Standard_Normal_4.webp",
    price: "$19.99",
  },
];

type CardPackViewerProps = {
  selectedPack: {
    id: number;
    name: string;
    image: string;
    price: string;
  };
};

function CardPack({ texture }: { texture: THREE.Texture }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <boxGeometry args={[3, 4, 0.2]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

export function CardPackViewer({ selectedPack }: CardPackViewerProps) {
  return (
    <div className="w-full h-full rounded-lg overflow-hidden border">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          intensity={1}
          castShadow
        />
        <Suspense fallback={null}>
          <CardPackWithTexture packImage={selectedPack.image} />
          <Environment preset="studio" />
        </Suspense>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  );
}

function CardPackWithTexture({ packImage }: { packImage: string }) {
  const texture = useTexture(packImage);
  return <CardPack texture={texture} />;
}

type Pack = {
  id: number;
  name: string;
  image: string;
  price: string;
};

type PackGridProps = {
  packs: Pack[];
  selectedPack: Pack;
  onSelectPack: (pack: Pack) => void;
};

export function PackGrid({ packs, selectedPack, onSelectPack }: PackGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {packs.map((pack) => (
        <div
          key={pack.id}
          className={cn(
            "border rounded-lg p-2 cursor-pointer transition-all hover:shadow-md",
            selectedPack.id === pack.id ? "ring-2 ring-primary" : "",
          )}
          onClick={() => onSelectPack(pack)}
        >
          <div className="aspect-[3/4] relative mb-2">
            <img
              src={pack.image || "/placeholder.svg"}
              alt={pack.name}
              // fill
              className="object-cover rounded"
            />
          </div>
          <div className="text-center">
            <h3 className="font-medium text-sm">{pack.name}</h3>
            <p className="text-sm text-muted-foreground">{pack.price}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CardPackPage() {
  const [selectedPack, setSelectedPack] = useState(packs[0]);

  const handleSelectPack = (pack: (typeof packs)[0]) => {
    setSelectedPack(pack);
  };

  const handleBuy = () => {
    alert(`Purchasing ${selectedPack.name} for ${selectedPack.price}`);
    // Here you would typically integrate with a payment processor
  };

  return (
    <main className="flex min-h-screen flex-col md:flex-row p-4 md:p-8 gap-8">
      <div className="w-full md:w-1/2 h-[400px] md:h-[600px]">
        <CardPackViewer selectedPack={selectedPack} />
      </div>
      <div className="w-full md:w-1/2 flex flex-col">
        <h1 className="text-2xl font-bold mb-4">Available Card Packs</h1>
        <PackGrid
          packs={packs}
          selectedPack={selectedPack}
          onSelectPack={handleSelectPack}
        />
        <div className="mt-6">
          <Button size="lg" className="w-full text-lg py-6" onClick={handleBuy}>
            Buy {selectedPack.name} for {selectedPack.price}
          </Button>
        </div>
      </div>
    </main>
  );
}
