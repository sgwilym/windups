# windups

🐸 [Examples, guides, API docs, and more! Much of it presented by a talking frog!](https://windups.gwil.co)

---

A unique typewriter (or, ahem, "windup") effect library for React.

This effect can be applied to strings _or pretty anything you can put in React's `children` prop_.

## What's it look like?

For strings:

```jsx
import { useWindup } from "windups";

function MyWindup() {
  const [text] = useWindup(
    "This string will be rendered character by character!"
  );

  return <div>{text}</div>;
}
```

For pretty much everything else:

```jsx
import { WindupChildren } from "windups";

function MyWindup() {
  return (
    <WindupChildren>
      {"It's fun to do"}
      <em>{"wild"}</em>
      {"stuff with text!"}
    </WindupChildren>
  );
}
```

There are additional APIs for:

- Controlling the pacing of the text!
- Adding pauses!
- Firing effects (e.g. when each character is typed, or at arbitrary points)!
- Ahead of render-time line-breaking!

---

Want to see a codebase that makes extensive, real-word use of this package? Source for the docs site is at https://github.com/sgwilym/windups-docs
