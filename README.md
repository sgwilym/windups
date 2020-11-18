# windups

A typewriter effect library for React.

Examples, API docs, and guides can all be found at [the docs site](https://windups.gwil.co)!

Apply the typewriter (or, ahem, "windup") effect to:

- strings
- anything you can put in React's children prop!

Use the API to:

- Control the pacing of your windups
- Trigger animations, sounds or any effect you can think of!
- Intelligently handle line breaking in text!

Want to see a codebase that makes extensive, real-word use of this package? Source for the docs site is at https://github.com/sgwilym/windups-docs

## 🗼 Code landmarks

Where the action is happening in this codebase.

### `src/Windup.ts`

The bulk of the file are functions which return modified versions of a windup (e.g. `next`, `rewind`), utilities (e.g. `isUnplayed`), or functions for creating a Windup data structure (e.g. `windupFromString`).

The windup data structure is also described here:

- It has three elements, representing collections of members in three states: played, in progress, and unplayed.
- It is a recursive data structure, i.e. a windup can be a member of any of these three parts.

### `src/react/useWindup.ts`

This is a hook that is used internally by `WindupChildren` and `useWindupString`. It does the bulk of the work of a windup: scheduling the next update, triggering effects, returning callbacks for rewinding/skipping etc.

### `src/react/useWindupString.ts`

This hook does very little: it just turns a string into a windup and passes it along to `useWindup`.

### `src/react/WindupChildren.tsx`

A lot going on in this one: transforming the `children` data type into a Windup, and a rough heuristic to determine when the value of `children` has 'changed' (big quotation marks).
