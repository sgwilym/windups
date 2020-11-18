import React from "react";
import breakLines from "break-styled-lines";

function makeGetDescriptorsOfChildren(defaultFontStyle: string) {
  return (
    descriptors: { text: string; font: string }[],
    children: React.ReactNode
  ): { text: string; font: string }[] => {
    if (typeof children === "string") {
      return [...descriptors, { text: children, font: defaultFontStyle }];
    }

    if (typeof children === "number") {
      return [
        ...descriptors,
        { text: children.toString(), font: defaultFontStyle },
      ];
    }

    if (!React.isValidElement(children)) {
      return descriptors;
    }

    if (
      isStyledTextElement(children) &&
      typeof children.props.children === "string"
    ) {
      return [
        ...descriptors,
        { text: children.props.children, font: children.props.fontStyle },
      ];
    }

    if (isStyledTextElement(children)) {
      return [
        ...descriptors,
        ...React.Children.toArray(children.props.children).reduce(
          makeGetDescriptorsOfChildren(children.props.fontStyle),
          []
        ),
      ];
    }

    return [
      ...descriptors,
      ...React.Children.toArray(children.props.children).reduce(
        makeGetDescriptorsOfChildren(defaultFontStyle),
        []
      ),
    ];
  };
}

function reinsertStringsIntoChildren(
  [accChildren, accStrings]: [React.ReactNode[], string[]],
  children: React.ReactNode
): [React.ReactNode[], string[]] {
  if (typeof children === "string" || typeof children === "number") {
    const [firstString, ...restStrings] = accStrings;
    return [[...accChildren, firstString], restStrings];
  }

  if (!React.isValidElement(children)) {
    return [accChildren, accStrings];
  }

  const [subChildrenAcc, subStringsAcc] = React.Children.toArray(
    children.props.children
  ).reduce(reinsertStringsIntoChildren, [[], accStrings]);

  return [
    [
      ...accChildren,
      React.cloneElement(children, {
        children: subChildrenAcc,
      }),
    ],
    subStringsAcc,
  ];
}

type StyledTextProps = { children: React.ReactNode; fontStyle: string };

function isStyledTextElement(
  element: React.ReactElement
): element is React.ReactElement<StyledTextProps> {
  return element.type === StyledText;
}

export function StyledText({ children }: StyledTextProps) {
  return <>{children}</>;
}

type LinebreakerProps = {
  fontStyle: string;
  width: number;
};

const Linebreaker: React.FC<LinebreakerProps> = ({
  children,
  fontStyle,
  width,
}) => {
  // CAVEATS:
  // fontStyle must match the font style of the characters inside
  // non-character elements must not add width to the line.
  // must be used OUTSIDE of WindupChildren component

  const childrenArray = React.Children.toArray(children);
  const descriptors = childrenArray.reduce(
    makeGetDescriptorsOfChildren(fontStyle),
    []
  );

  const transformedStrings = breakLines(descriptors, width, fontStyle);

  const [
    transformedChildren,
  ] = childrenArray.reduce(reinsertStringsIntoChildren, [
    [],
    transformedStrings,
  ]);

  return <div style={{ whiteSpace: "pre" }}>{transformedChildren}</div>;
};

export default Linebreaker;
