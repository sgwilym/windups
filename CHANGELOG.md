# Changelog

## v1.2.0

- Adds a new API for pausing and resuming windups! `<WindupChildren>` now has a `isPaused` prop; there are new `usePause` and `useResume` hooks, and `useWindupString` returns `pause` and `resume` callbacks. Thank you [anulman](https://github.com/anulman)!
- Updates typings for compatibility with React 18. Thank you [witchtrash](https://github.com/witchtrash)!

## v1.1.9

- Updates break-styled-lines to v1.2.2, which now offers a CommonJS export

## v1.1.7

- Changes the build process used for the package.

## v1.1.6

- Fixes an issue where React would warn about every item in a list needing a key prop whenever a component with a children prop would be rendered by `WindupChildren`

## v1.1.5

- Fix an issue where spaces were being passed as children when not asked for. This would result in using things like <Pause> inserting a space!

## v1.1.4

- Fixes a bad publish.

## v1.1.3

- Export `StyledText` from entry index

## v1.1.2

- Update the break-styled-lines dependency to fix a regression in Linebreaker.

## v1.1.1

- Update a few deps for security fixes

## v1.1.0

- Added a `StyledText` component to be used with `Linebreaker`. Use this if you have differently styled text within a single `Linebreaker` usage.
- `useWindupString` will now display the current string value in React devtools
