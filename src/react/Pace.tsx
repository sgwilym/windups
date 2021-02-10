import * as React from "react";
import { isFinished, memberIsWindup, Windup } from "../Windup";
import { HookMetadata } from "./useWindup";

type MsProp = {
  ms: number;
};

type GetPaceProp = {
  getPace: (char: string) => number;
};

type PaceProps = MsProp | GetPaceProp;

export function defaultGetPace(
  lastChar: string,
  nextChar: string | undefined
): number {
  switch (lastChar) {
    case "—":
    case "…":
      return 200;
    case ".":
    case ",":
      return 150;
    case "?":
    case "!":
      if (nextChar !== "!" && nextChar !== "?") {
        return 150;
      }
    case "-":
    case " ":
    case "\n":
      return 0;
    default:
      return 20;
  }
}

const Pace: React.FC<PaceProps> = ({ children }) => {
  return <>{children}</>;
};

export function isPaceElement(
  element: React.ReactElement
): element is React.ReactElement<PaceProps> {
  return element.type === Pace;
}

export function isMsProp(props: PaceProps): props is MsProp {
  if ("ms" in props) {
    return true;
  }
  return false;
}

export function paceFromWindup<
  M extends HookMetadata,
  W extends Windup<string, M>
>(
  windup: W,
  parentPace?: (char: string, nextChar: string | undefined) => number
): ((char: string, nextChar: string | undefined) => number) | undefined {
  if (isFinished(windup)) {
    return undefined;
  }

  const [, remaining, metadata] = windup;

  const [firstRemaining] = remaining;

  if (firstRemaining && memberIsWindup(firstRemaining)) {
    return paceFromWindup(firstRemaining, metadata.pace || parentPace);
  }

  return metadata.pace || parentPace;
}

export default Pace;
