import React, { isValidElement } from "react";

export default function textFromChildren(children: React.ReactNode): string {
  return React.Children.map(children, (ch) => {
    if (typeof ch === "string") {
      return ch;
    }

    if (typeof ch === "number") {
      return ch.toString();
    }

    if (!isValidElement(ch)) {
      return "";
    }

    if (ch.props.children) {
      return textFromChildren(ch.props.children);
    }

    return "";
  }).join("");
}
