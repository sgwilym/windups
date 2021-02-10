export type WindupMember<ElementType, MetadataType> =
  | ElementType
  | Windup<ElementType, MetadataType>;
export type Windup<ElementType, MetadataType> = [
  Array<WindupMember<ElementType, MetadataType>>,
  Array<WindupMember<ElementType, MetadataType>>,
  MetadataType
];

export function isPlayedWindup<ElementType, MetadataType>(
  windup:
    | PlayedWindup<ElementType, MetadataType>
    | Windup<ElementType, MetadataType>
): windup is PlayedWindup<ElementType, MetadataType> {
  return windup.length === 2;
}

export function memberIsWindup<ElementType, MetadataType>(
  member: WindupMember<ElementType, MetadataType>
): member is Windup<ElementType, MetadataType> {
  // If it's not an array it can't be a windup
  if (!Array.isArray(member)) {
    return false;
  }

  // If it has less or more than three members it's not a windup
  if (member.length !== 3) {
    return false;
  }

  // If its first or second members are not arrays it's not a windup
  if (!Array.isArray(member[0]) || !Array.isArray(member[1])) {
    return false;
  }

  // Past here we just have to hope ElementType isn't a windup.
  return true;
}

export function windupFromString<MetadataType>(
  str: string,
  metadata: MetadataType
): Windup<string, MetadataType> {
  return [[], str.split(""), metadata];
}

export function newWindup<ElementType, MetadataType>(
  arg: Array<WindupMember<ElementType, MetadataType>>,
  metadata: MetadataType
): Windup<ElementType, MetadataType> {
  return [[], arg, metadata];
}

export function isUnplayed<ElementType, MetadataType>(
  windup: Windup<ElementType, MetadataType>
): boolean {
  const [played, remaining] = windup;

  if (played.length > 0) {
    return false;
  }

  return remaining.reduce((unplayed: boolean, member) => {
    if (memberIsWindup(member))
      if (memberIsWindup(windup) && unplayed) {
        return isUnplayed<ElementType, MetadataType>(member);
      }
    return unplayed;
  }, true);
}

export function isFinished<ElementType, MetadataType>([
  _played,
  remaining
]: Windup<ElementType, MetadataType>): boolean {
  return remaining.length === 0;
}

export function fastForward<ElementType, MetadataType>(
  windup: Windup<ElementType, MetadataType>
): Windup<ElementType, MetadataType> {
  const forwardedWindup = next(windup);
  if (isFinished(forwardedWindup)) {
    return forwardedWindup;
  }
  return fastForward(forwardedWindup);
}

export function rewind<ElementType, MetadataType>(
  windup: Windup<ElementType, MetadataType>
): Windup<ElementType, MetadataType> {
  if (isUnplayed(windup)) {
    return windup;
  }

  const [played, remaining, metadata] = windup;

  type MemberType = WindupMember<ElementType, MetadataType>;

  const mapRewind = (member: MemberType): MemberType => {
    if (memberIsWindup(member)) {
      return rewind(member);
    }
    return member;
  };

  return [
    [],
    [...played.map(mapRewind), ...remaining.map(mapRewind)],
    metadata
  ];
}

export function windupAsString<MetadataType>(
  windup: Windup<string, MetadataType>
): string {
  const [played, remaining] = windup;

  type MemberType = WindupMember<string, MetadataType>;
  const stringify = (member: MemberType): MemberType => {
    if (memberIsWindup(member)) {
      return windupAsString(member);
    }
    return member;
  };
  return [
    played.map(stringify).join(""),
    remaining.map(stringify).join("")
  ].join("");
}

export function lastPlayedMember<ElementType, MetadataType>([
  played,
  remaining
]: Windup<ElementType, MetadataType>):
  | WindupMember<ElementType, MetadataType>
  | undefined {
  const playedFromRemaining = remaining.reduce(
    (playedEl: WindupMember<ElementType, MetadataType> | undefined, member) => {
      if (memberIsWindup(member)) {
        if (!isUnplayed(member)) {
          return lastPlayedElement(member);
        }
      }
      return playedEl;
    },
    undefined
  );

  if (playedFromRemaining) {
    return playedFromRemaining;
  }

  const last = played[played.length - 1];
  return last;
}

export function lastPlayedElement<ElementType, MetadataType>(
  windup: Windup<ElementType, MetadataType>
): ElementType | undefined {
  const lastPlayed = lastPlayedMember(windup);

  if (memberIsWindup(lastPlayed)) {
    return lastPlayedElement(lastPlayed);
  }

  return lastPlayed;
}

export type PlayedWindup<ElementType, MetadataType> = [
  Array<ElementType>,
  MetadataType
];

export function playedElements<ElementType, MetadataType>([
  played,
  remaining
]: Windup<ElementType, MetadataType>): Array<
  ElementType | PlayedWindup<ElementType, MetadataType>
> {
  const playedTransformed = played.map(member => {
    if (memberIsWindup(member)) {
      const [, , metadata] = member;
      return [playedElements(member), metadata] as PlayedWindup<
        ElementType,
        MetadataType
      >;
    }
    return member;
  });

  const [firstRemaning] = remaining;
  if (memberIsWindup(firstRemaning) && !isUnplayed(firstRemaning)) {
    const [, , metadata] = firstRemaning;

    return [
      ...playedTransformed,
      [playedElements(firstRemaning), metadata] as PlayedWindup<
        ElementType,
        MetadataType
      >
    ];
  }

  return playedTransformed;
}

export function nextElement<ElementType, MetadataType>([
  _played,
  remaining
]: Windup<ElementType, MetadataType>): ElementType | undefined {
  const [nextVal] = remaining;

  if (memberIsWindup(nextVal)) {
    return nextElement(nextVal);
  }

  return nextVal;
}

export function next<ElementType, MetadataType>(
  windup: Windup<ElementType, MetadataType>
): Windup<ElementType, MetadataType> {
  // start
  // [[], [[[], ["h", "i"]], [[], ["n", "o"]]]]

  // next
  // [[], [[["h"], ["i"]], ["", ["n", "o"]]]]

  // next
  // [["h", "i"], [["n", "o"]]]

  // next
  // [["h", "i"] ["n", "o"]], []]

  if (isFinished(windup)) {
    return windup;
  }

  const [played, remaining, metadata] = windup;
  const [firstRemaining, ...restRemaining] = remaining;

  if (memberIsWindup(firstRemaining)) {
    const nextFirstRemaining = next(firstRemaining);

    if (isFinished(nextFirstRemaining)) {
      return [[...played, nextFirstRemaining], restRemaining, metadata];
    }

    return [played, [nextFirstRemaining, ...restRemaining], metadata];
  }

  return [[...played, firstRemaining], restRemaining, metadata];
}
