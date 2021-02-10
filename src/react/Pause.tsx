import * as React from "react";

type PauseProps = {
  ms: number;
};

const Pause: React.FC<PauseProps> = () => {
  return null;
};

export function isPauseElement(
  element: React.ReactElement
): element is React.ReactElement<PauseProps> {
  return element.type === Pause;
}

export default Pause;
