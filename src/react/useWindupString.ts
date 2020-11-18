import { useMemo, useDebugValue } from "react";
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
    rewind: () => void;
    isFinished: boolean;
  }
] {
  const windupInit = useMemo(() => {
    return windupFromString<StringMetadata>(text, options);
  }, [text]);

  const { windup, skip, rewind, isFinished } = useWindup(windupInit, options);
  
  const rendered = renderStringWindup(windup);
  useDebugValue(rendered);

  return [rendered, { skip, rewind, isFinished }];
}
