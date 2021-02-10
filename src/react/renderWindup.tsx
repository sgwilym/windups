import * as React from "react";
import { ChildrenMetadata, ChildrenWindup } from "./WindupChildren";
import { PlayedWindup, playedElements, isPlayedWindup } from "../Windup";
import { StringMetadata, StringWindup } from "./useWindupString";

export type PlayedChildrenWindup = PlayedWindup<string, ChildrenMetadata>;
export type PlayedStringWindup = PlayedWindup<string, StringMetadata>;

export function renderStringWindup(
  windup: StringWindup | PlayedStringWindup
): string {
  const played = isPlayedWindup(windup) ? windup[0] : playedElements(windup);

  const inner = played.reduce((acc: string, playedEl) => {
    if (typeof playedEl === "string") {
      return acc + playedEl;
    }

    return acc + renderStringWindup(playedEl);
  }, "");

  return inner;
}

const VOID_TAGS = [
  "area",
  "base",
  "br",
  "col",
  "command",
  "embed",
  "hr",
  "img",
  "input",
  "keygen",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr"
];

export function renderChildrenWindup(
  windup: ChildrenWindup | PlayedChildrenWindup
): React.ReactNode {
  const metadata = isPlayedWindup(windup) ? windup[1] : windup[2];
  const played = isPlayedWindup(windup) ? windup[0] : playedElements(windup);

  const Outer = metadata.element || React.Fragment;

  if (metadata.props && Object.keys(metadata.props).includes("children")) {
    return <Outer key={metadata.key} {...metadata.props} />;
  }

  const inner = played.reduce((acc: React.ReactNode[], playedEl) => {
    if (typeof playedEl === "string") {
      const accButLast = acc.slice(0, acc.length - 1);
      const last = acc[acc.length - 1];

      return last && typeof last === "string"
        ? [...accButLast, last + playedEl]
        : [...acc, playedEl];
    }

    return [...acc, renderChildrenWindup(playedEl)];
  }, []);

  if (
    typeof metadata.element === "string" &&
    VOID_TAGS.includes(metadata.element)
  ) {
    return <Outer key={metadata.key} {...metadata.props} />;
  }

  return (
    <Outer key={metadata.key} {...metadata.props}>
      {inner}
    </Outer>
  );
}
