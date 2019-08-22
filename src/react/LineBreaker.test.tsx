import React from "react";
import LineBreaker from "./Linebreaker";
import { create } from "react-test-renderer";

it("okay...", () => {
  const test = create(
    <LineBreaker width={100} fontStyle={"10pt"}>
      {"Hello there my dear chum. What's up?"}
    </LineBreaker>
  );
});
