import {
  Windup,
  windupFromString,
  newWindup,
  isUnplayed,
  next,
  isFinished,
  fastForward,
  windupAsString,
  lastPlayedElement,
  playedElements,
  nextElement,
  rewind
} from "./Windup";

const newStrWindup = () => windupFromString("Hello", {});
const newDeepWindup = (): Windup<string, {}> =>
  newWindup<string, {}>(
    [
      [[], "Hello!".split(""), {}],
      [[], " ...and goodbye!".split(""), {}]
    ],
    {}
  );

describe("windupFromString", () => {
  it("produces an unplayed windup from a string", () => {
    const windup = windupFromString("Hello", {});
    expect(windup).toEqual([[], "Hello".split(""), {}]);
  });
});

describe("newWindup", () => {
  it("produces an an unplayed windup from an array of windups", () => {
    const windup = newWindup(
      [windupFromString("Hello!", {}), windupFromString("Goodbye!", {})],
      {}
    );
    expect(windup).toEqual([
      [],
      [
        [[], "Hello!".split(""), {}],
        [[], "Goodbye!".split(""), {}]
      ],
      {}
    ]);
  });
});

describe("isUnplayed", () => {
  it("returns true for an unplayed windup", () => {
    expect(isUnplayed(newStrWindup())).toBeTruthy();
    expect(isUnplayed(newDeepWindup())).toBeTruthy();
  });
  it("returns false for a played windup", () => {
    const playedWindup = [["H"], "ello".split(""), {}] as Windup<string, {}>;
    expect(isUnplayed(playedWindup)).toBeFalsy();

    const playedDeepWindup = next(
      newWindup(
        [windupFromString("Yo!", {}), windupFromString("Nice!", {})],
        {}
      )
    );
    expect(isUnplayed(playedDeepWindup)).toBeFalsy();
  });
});

describe("isFinished", () => {
  it("returns true for a played windup", () => {
    const finishedWindup = ["Hello".split(""), [], {}] as Windup<string, {}>;
    expect(isFinished(finishedWindup)).toBeTruthy();

    const finishedDeepWindup = [
      [
        ["Hello".split(""), [], {}],
        ["friend".split(""), [], {}]
      ],
      [],
      {}
    ] as Windup<string, {}>;
    expect(isFinished(finishedDeepWindup)).toBeTruthy();
  });

  it("returns false for an unfinished windup", () => {
    expect(isFinished(newStrWindup())).toBeFalsy();
    expect(isFinished(newDeepWindup())).toBeFalsy();
  });
});

describe("fastForward", () => {
  it("returns a finished windup", () => {
    expect(isFinished(newStrWindup())).toBeFalsy();
    expect(isFinished(fastForward(newStrWindup()))).toBeTruthy();

    expect(isFinished(newDeepWindup())).toBeFalsy();
    expect(isFinished(fastForward(newDeepWindup()))).toBeTruthy();
  });
});

describe("rewind", () => {
  it("returns an unplayed version of a windup", () => {
    expect(isUnplayed(rewind(fastForward(newStrWindup())))).toBeTruthy();
    expect(isUnplayed(rewind(next(newStrWindup())))).toBeTruthy();
    expect(rewind(newStrWindup())).toBeTruthy();
  });
});

describe("windupAsString", () => {
  it("returns the entire contents of a windupAsStirng as a string", () => {
    expect(windupAsString(newStrWindup())).toEqual("Hello");
    expect(windupAsString(newDeepWindup())).toEqual("Hello! ...and goodbye!");
  });
});

describe("lastPlayedChar", () => {
  it("returns the last played character of the windup", () => {
    const playedWindup = ["Hel".split(""), "lo".split(""), {}] as Windup<
      string,
      any
    >;
    expect(lastPlayedElement(playedWindup)).toEqual("l");

    const playedDeepWindup = newWindup(
      [
        ["Yo".split(""), ", it's me".split(""), {}],
        [[], ", your friend".split(""), {}]
      ],
      {}
    );
    expect(lastPlayedElement(playedDeepWindup)).toEqual("o");

    const trickyDeepWindup = newWindup(
      [
        ["Yo, it's me".split(""), [], {}],
        [", y".split(""), "our friend".split(""), {}]
      ],
      {}
    );
    expect(lastPlayedElement(trickyDeepWindup)).toEqual("y");

    const veryTrickyDeepWindup = [
      [],
      [[["G"], "otcha!".split(""), {}]],
      {}
    ] as Windup<string, any>;
    expect(lastPlayedElement(veryTrickyDeepWindup)).toEqual("G");
  });
});

describe("playedElements", () => {
  it("returns all played elements of the windup", () => {
    const playedWindup = ["Hel".split(""), "lo".split(""), {}] as Windup<
      string,
      any
    >;
    expect(playedElements(playedWindup)).toEqual("Hel".split(""));

    const playedDeepWindup = [
      [
        ["Yo".split(""), [], {}],
        [", it's me".split(""), [], {}]
      ],
      [["".split(""), ", your friend".split(""), {}]],
      {}
    ] as Windup<string, any>;
    expect(playedElements(playedDeepWindup)).toEqual([
      ["Yo".split(""), {}],
      [", it's me".split(""), {}]
    ]);

    const trickyDeepWindup = [
      [
        ["Yo".split(""), [], {}],
        [", it's me".split(""), [], {}]
      ],
      [[", y".split(""), "our friend".split(""), {}]],
      {}
    ] as Windup<string, any>;
    expect(playedElements(trickyDeepWindup)).toEqual([
      ["Yo".split(""), {}],
      [", it's me".split(""), {}],
      [", y".split(""), {}]
    ]);
  });
});

describe("nextElement", () => {
  it("returns the next element to be played", () => {
    expect(nextElement(newStrWindup())).toBe("H");
    expect(nextElement(newDeepWindup())).toBe("H");
    expect(nextElement(fastForward(newStrWindup()))).toBeUndefined();
    expect(nextElement(fastForward(newDeepWindup()))).toBeUndefined();
  });
});

describe("next", () => {
  it("returns the next step of the windup", () => {
    expect(next(newStrWindup())).toEqual([["H"], "ello".split(""), {}]);
    expect(next(newDeepWindup())).toEqual([
      [],
      [
        [["H"], "ello!".split(""), {}],
        [[], " ...and goodbye!".split(""), {}]
      ],
      {}
    ]);

    const aboutToMoveDeepWindup = [
      [],
      [
        [["Y"], ["o"], {}],
        [[], ", nice".split(""), {}]
      ],
      {}
    ] as Windup<string, {}>;
    expect(next(aboutToMoveDeepWindup)).toEqual([
      [["Yo".split(""), [], {}]],
      [[[], ", nice".split(""), {}]],
      {}
    ]);

    const finishedWindup = fastForward(newStrWindup());
    expect(next(finishedWindup)).toEqual(finishedWindup);
  });
});
