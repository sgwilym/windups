import * as React from "react";

type CharWrapperProps = {
  element: React.ElementType;
};

function wrapChildren(children: React.ReactNode, Wrapper: React.ElementType) {
  if (typeof children === "string") {
    return children
      .split("")
      .map((char, i) =>
        char === "\n" ? char : <Wrapper key={`${char}-${i}`}>{char}</Wrapper>
      );
  }

  if (typeof children === "number") {
    return children
      .toString()
      .split("")
      .map(char => <Wrapper>{char}</Wrapper>);
  }

  if (!React.isValidElement(children)) {
    return <React.Fragment />;
  }

  if (children.props.children) {
    const Outer = children.type;

    if (children.props.children instanceof Function) {
      return <Outer key={children.key} {...children.props} />;
    }

    return (
      <Outer key={children.key} {...children.props}>
        {React.Children.map(children.props.children, ch => {
          return wrapChildren(ch, Wrapper);
        })}
      </Outer>
    );
  }

  return children;
}

const CharWrapper: React.FC<CharWrapperProps> = ({ children, element }) => {
  return (
    <>
      {React.Children.map(children, ch => {
        return wrapChildren(ch, element);
      })}
    </>
  );
};

export default CharWrapper;
