import * as React from "react";
import { windupFromString, Windup } from "../Windup";
import useWindup, { HookMetadata } from "./useWindup";
import { renderStringWindup } from "./renderWindup";

export type WindupOptions = {
  onChar?: (char: string) => void;
  onFinished?: () => void;
  pace?: (char: string) => number;
  skipped?: boolean;
};

export type StringMetadata = HookMetadata;

export type StringWindup = Windup<string, StringMetadata>;

export default function useWindupString(
  text: string,
  options: WindupOptions = {}
): [
  string,
  {
    skip: () => void;
    pause: () => void;
    resume: () => void;
    rewind: () => void;
    isFinished: boolean;
  }
] {
  const windupInit = React.useMemo(() => {
    return windupFromString<StringMetadata>(text, options);
    // We can omit options as this is used as an initialisation value and options will not change it
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const { windup, skip, pause, resume, rewind, isFinished } = useWindup(
    windupInit,
    options
  );

  const rendered = renderStringWindup(windup);
  React.useDebugValue(rendered);

  return [rendered, { skip, pause, resume, rewind, isFinished }];
}
