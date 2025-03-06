import { FC } from "react";

import ItemViewer3D from "../3d/ItemViewer3D";
import View3D from "../3d/View3D";
import Chest from "../3d/Chest";

export const Pack: FC = () => {
  return (
    <div className="w-full h-full">
      <View3D env={"item"}>
        <ItemViewer3D>
          <Chest />
        </ItemViewer3D>
      </View3D>
    </div>
  );
};
