import * as React from "react";
import { defaultGetPace, paceFromWindup } from "./Pace";
import {
  isFinished,
  lastPlayedElement,
  next,
  fastForward,
  rewind,
  Windup,
  nextElement
} from "../Windup";
import { onCharsFromWindup } from "./OnChar";

type WindupReducerState<M> = {
  windup: Windup<string, M>;
  didFinishOnce: boolean;
};

type WindupReducerAction<M> =
  | {
      type: "replace";
      windup: Windup<string, M>;
    }
  | {
      type: "next";
    }
  | {
      type: "rewind";
    }
  | {
      type: "fast-forward";
    }
  | {
      type: "finish";
    };

function initWindupState<M>(windup: Windup<string, M>): WindupReducerState<M> {
  return { windup, didFinishOnce: false };
}

type ReducerType<M> = (
  prevState: WindupReducerState<M>,
  action: WindupReducerAction<M>
) => WindupReducerState<M>;

function windupReducer<M>(
  state: WindupReducerState<M>,
  action: WindupReducerAction<M>
): WindupReducerState<M> {
  switch (action.type) {
    case "replace":
      return initWindupState(action.windup);
    case "next":
      return { ...state, windup: next(state.windup) };
    case "rewind":
      return { windup: rewind(state.windup), didFinishOnce: false };
    case "fast-forward":
      return { ...state, windup: fastForward(state.windup) };
    case "finish":
      return { ...state, didFinishOnce: true };
    default:
      return state;
  }
}

export interface HookMetadata {
  onChar?: (char: string) => void;
  pace?: (char: string, nextChar: string | undefined) => number;
}

export default function useWindup<M extends HookMetadata>(
  windupInit: Windup<string, M>,
  options: {
    onFinished?: () => void;
    skipped?: boolean;
  }
): {
  windup: Windup<string, M>;
  skip: () => void;
  pause: () => void;
  resume: () => void;
  rewind: () => void;
  isFinished: boolean;
} {
  const [{ windup, didFinishOnce }, dispatch] = React.useReducer<
    ReducerType<M>,
    Windup<string, M>
  >(windupReducer, windupInit, initWindupState);

  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const windupIsFinished = isFinished(windup);

  const nextCharAtRef = React.useRef<number | null>(null);
  const pauseDelayRemainingRef = React.useRef<number | null>(null);
  const isPausedRef = React.useRef<boolean>(false);

  const skip = React.useCallback(() => {
    if (!windupIsFinished) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      dispatch({
        type: "fast-forward"
      });
    }
  }, [windupIsFinished]);

  const pause = React.useCallback(() => {
    if (isPausedRef.current === true) {
      return;
    }

    isPausedRef.current = true;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      pauseDelayRemainingRef.current = Math.max(
        0,
        nextCharAtRef.current ?? 0 - Date.now()
      );
    }
  }, []);

  const resume = React.useCallback(() => {
    if (isPausedRef.current !== true) {
      return;
    }

    if (!windupIsFinished) {
      setTimeout(() => {
        isPausedRef.current = false;
        dispatch({ type: "next" });
      }, pauseDelayRemainingRef.current ?? 0);
    }
  }, [windupIsFinished]);

  const rewind = React.useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    dispatch({ type: "rewind" });
  }, []);

  // If windup arg changes, we should reset
  React.useEffect(() => {
    dispatch({ type: "replace", windup: windupInit });
  }, [windupInit]);

  // If skipped is changes to true, we should skip
  // And if it's changed to false, we should restart
  React.useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (options.skipped) {
      dispatch({
        type: "fast-forward"
      });
    }
    if (options.skipped === false) {
      dispatch({ type: "rewind" });
    }
  }, [options.skipped]);

  // When the windup changes, onChar should fire
  React.useEffect(() => {
    const onChars = onCharsFromWindup(windup);
    const lastEl = lastPlayedElement(windup);
    if (onChars.length > 0 && lastEl) {
      onChars.forEach(onChar => {
        onChar(lastEl);
      });
    }
  }, [windup]);

  // If windup finishes, the onFinished should fire
  React.useEffect(() => {
    // Put this in a new context so that the windup finishes visually before firing this
    if (didFinishOnce === false && windupIsFinished) {
      const timeout = setTimeout(() => {
        if (options.onFinished) {
          options.onFinished();
        }
        dispatch({ type: "finish" });
      }, 0);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [didFinishOnce, windupIsFinished, options]);

  // the windup effect itself
  React.useEffect(() => {
    if (!windupIsFinished) {
      const getPace = paceFromWindup(windup) || defaultGetPace;
      const lastEl = lastPlayedElement(windup);
      const nextEl = nextElement(windup);

      const pace = lastEl ? getPace(lastEl, nextEl) : 0;

      nextCharAtRef.current = Date.now() + pace;

      if (isPausedRef.current !== true) {
        timeoutRef.current = setTimeout(() => {
          dispatch({ type: "next" });
        }, pace);
      }

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
  }, [windup, windupIsFinished]);

  return {
    windup,
    skip,
    pause,
    resume,
    rewind,
    isFinished: windupIsFinished
  };
}
