import * as React from "react";

export default function textFromChildren(children: React.ReactNode): string {
  const text = React.Children.map(children, ch => {
    if (typeof ch === "string") {
      return ch;
    }

    if (typeof ch === "number") {
      return ch.toString();
    }

    if (!React.isValidElement(ch)) {
      return "";
    }

    if (ch.props.children) {
      return textFromChildren(ch.props.children);
    }

    return "";
  });

  if (!text) {
    return "";
  }

  return text.join("");
}
