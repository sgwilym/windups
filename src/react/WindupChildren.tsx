import * as React from "react";
import {
  newWindup,
  Windup,
  WindupMember,
  windupFromString,
  memberIsWindup
} from "../Windup";
import { isPaceElement, isMsProp } from "./Pace";
import { isOnCharElement } from "./OnChar";
import { isPauseElement } from "./Pause";
import useWindup, { HookMetadata } from "./useWindup";
import { renderChildrenWindup } from "./renderWindup";

const WindupContext = React.createContext({
  skip: () => {
    console.warn(
      "Tried to use the useSkip hook outside of a WindupChildren component!!"
    );
  },
  rewind: () => {
    console.warn(
      "Tried to use the useRewind hook outside of a WindupChildren component!"
    );
  },
  isFinished: false
});

export function useSkip() {
  const { skip } = React.useContext(WindupContext);
  return skip;
}

export function useRewind() {
  const { rewind } = React.useContext(WindupContext);
  return rewind;
}

export function useIsFinished() {
  const { isFinished } = React.useContext(WindupContext);
  return isFinished;
}

export interface ChildrenMetadata extends HookMetadata {
  element: React.ElementType | string | undefined;
  props?: any;
  ref?: any;
  key?: string | number | null;
}

export type ChildrenWindup = Windup<string, ChildrenMetadata>;
type ChildrenWindupMember = WindupMember<string, ChildrenMetadata>;

function reduceWindupArgs(
  prevArgs: ChildrenWindupMember[],
  children: React.ReactNode
) {
  if (typeof children === "string") {
    return [...prevArgs, ...children.split("")];
  }

  if (typeof children === "number") {
    return [...prevArgs, ...children.toString().split("")];
  }

  if (!React.isValidElement(children)) {
    return prevArgs;
  }

  const { children: childrenChildren, ...restProps } = children.props;

  const paceMetaData = isPaceElement(children)
    ? {
        pace: (char: string) => {
          if (isMsProp(children.props)) {
            return children.props.ms;
          }
          return children.props.getPace(char);
        }
      }
    : {};

  const onCharMetaData = isOnCharElement(children)
    ? {
        onChar: children.props.fn
      }
    : {};

  const keyProp = children.key ? { key: children.key } : {};

  if (isPauseElement(children)) {
    return [
      ...prevArgs,
      windupFromString<ChildrenMetadata>(" ", {
        element: React.Fragment,
        ...keyProp,
        props: { children: undefined },
        pace: () => children.props.ms
      })
    ];
  }

  if (childrenChildren === undefined) {
    return [
      ...prevArgs,
      windupFromString<ChildrenMetadata>(" ", {
        element: children.type,
        props: { ...restProps, children: undefined },
        ...keyProp,
        ...paceMetaData,
        ...onCharMetaData
      })
    ];
  }

  if (typeof childrenChildren === "string") {
    return [
      ...prevArgs,
      windupFromString<ChildrenMetadata>(childrenChildren, {
        element: children.type,
        props: restProps,
        ...keyProp,
        ...paceMetaData,
        ...onCharMetaData
      })
    ];
  }

  if (childrenChildren instanceof Function) {
    return [
      ...prevArgs,
      windupFromString<ChildrenMetadata>(" ", {
        element: children.type,
        props: { children: childrenChildren, ...restProps },
        ...keyProp,
        ...paceMetaData,
        ...onCharMetaData
      })
    ];
  }

  const newArgs: ChildrenWindupMember[] = React.Children.toArray(
    childrenChildren
  ).reduce(reduceWindupArgs, []);

  const argsWithMetadata = newArgs.map(member => {
    if (memberIsWindup(member)) {
      const [played, remaining, metadata] = member;
      return [
        played,
        remaining,
        {
          ...paceMetaData,
          ...onCharMetaData,
          ...metadata
        }
      ] as ChildrenWindupMember;
    }
    return member;
  });

  return [
    ...prevArgs,
    newWindup<string, ChildrenMetadata>(argsWithMetadata, {
      element: children.type,
      props: restProps,
      ...keyProp,
      ...paceMetaData,
      ...onCharMetaData
    })
  ];
}

type WindupChildrenProps = {
  children: React.ReactNode;
  onFinished?: () => void;
  skipped?: boolean;
};

function buildKeyString(children: React.ReactNode): string {
  if (children === null || children === undefined) {
    return "";
  }

  const keys = React.Children.map(children, child => {
    if (typeof child === "string") {
      return child;
    }

    if (typeof child === "number") {
      return child.toString();
    }

    if (React.isValidElement(child)) {
      return `#${child.key || ""}<${buildKeyString(child.props.children)}>`;
    }

    return "";
  });

  if (!keys) {
    return "";
  }

  return keys.join(",");
}

function useChildrenMemo<T>(factory: () => T, children: React.ReactNode) {
  // Omitting children in favour of using a key instead
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoChildren = React.useMemo(factory, [buildKeyString(children)]);

  return memoChildren;
}

const WindupChildren: React.FC<WindupChildrenProps> = ({
  children,
  onFinished,
  skipped
}) => {
  const windupInit = useChildrenMemo(() => {
    return newWindup<string, ChildrenMetadata>(
      React.Children.toArray(children).reduce(reduceWindupArgs, []),
      { element: undefined }
    );
  }, children);

  const { windup, skip, rewind, isFinished } = useWindup(windupInit, {
    onFinished,
    skipped
  });

  return (
    <WindupContext.Provider
      value={{
        skip,
        rewind,
        isFinished
      }}
    >
      {renderChildrenWindup(windup)}
    </WindupContext.Provider>
  );
};

export default WindupChildren;
