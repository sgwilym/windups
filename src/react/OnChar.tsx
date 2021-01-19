import React from "react";
import {
  memberIsWindup,
  Windup,
  lastPlayedMember,
  isUnplayed,
} from "../Windup";
import { HookMetadata } from "./useWindup";

type OnCharProps = {
  fn: (char: string) => void;
};

const OnChar: React.FC<OnCharProps> = ({ children }) => {
  return <>{children}</>;
};

export function isOnCharElement(
  element: React.ReactElement
): element is React.ReactElement<OnCharProps> {
  return element.type === OnChar;
}

// Should return onChars from
// every just played member that is a windup
// any first remaining that is played
export function onCharsFromWindup<
  M extends HookMetadata,
  W extends Windup<string, M>
>(windup: W): ((char: string) => void)[] {
  const [, remaining, metadata] = windup;
  const lastPlayed = lastPlayedMember(windup);
  const [firstRemaining] = remaining;

  let onChars = [];

  if (lastPlayed && memberIsWindup(lastPlayed)) {
    onChars.push(...onCharsFromWindup(lastPlayed));
  }

  if (
    firstRemaining &&
    memberIsWindup(firstRemaining) &&
    !isUnplayed(firstRemaining)
  ) {
    onChars.push(...onCharsFromWindup(firstRemaining));
  }

  if (metadata.onChar) {
    onChars.push(metadata.onChar);
  }

  return onChars;
}

export default OnChar;
