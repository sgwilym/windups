import React, { StrictMode } from "react";
import { render } from "react-dom";
import useWindupString from "./react/useWindupString";
import WindupChildren, { useSkip, useRewind } from "./react/WindupChildren";
import Pace from "./react/Pace";
import OnChar from "./react/OnChar";
import Pause from "./react/Pause";
import Effect from "./react/Effect";
import CharWrapper from "./react/CharWrapper";
import Linebreaker, { StyledText } from "./react/Linebreaker";

const TestComponent: React.FC = ({ children }) => {
  return <b>{children}</b>;
};

const AnotherTestComponent: React.FC = ({ children }) => {
  return <em>{children}</em>;
};

const RedChar: React.FC = ({ children }) => {
  return <span style={{ color: "red" }}>{children}</span>;
};

const FunctionChildrenComponent = ({
  children,
}: {
  children: (value: string) => React.ReactNode;
}) => {
  const value = "blue";
  return <>{children(value)}</>;
};

function SkipButton() {
  const skip = useSkip();
  return <button onClick={skip}>{"Skip"}</button>;
}

function RewindButton() {
  const rewind = useRewind();
  return <button onClick={rewind}>{"Rewind"}</button>;
}

const Example = () => {
  const [string] = useWindupString("This text came from a hook!");

  return (
    <StrictMode>
      <WindupChildren>
        <img src="hi.jpg" />
      </WindupChildren>
      <Linebreaker width={100} fontStyle={"24px Arial"}>
        <WindupChildren
          onFinished={() => {
            console.log("I want to see this only once!");
          }}
        >
          <Pace ms={500}>
            <div
              style={{
                width: 100,
                font: "24px Arial",
                border: "1px black solid",
              }}
            >
              {"Hello!"}
              <StyledText fontStyle={"12px Arial"}>
                <div style={{ font: "12px Arial" }}>{"Is this thing on?"}</div>
              </StyledText>
              <div>
                {"Nice to meet you, "}
                <em>{"truly!"}</em>
              </div>
            </div>
          </Pace>
        </WindupChildren>
      </Linebreaker>
      <div>{string}</div>
      <WindupChildren onFinished={() => console.log("Finished!")}>
        <CharWrapper element={RedChar}>
          {"hello "}
          <FunctionChildrenComponent>
            {(value) => (
              <div>{`I have function children with a value of ${value}`}</div>
            )}
          </FunctionChildrenComponent>
          <SkipButton />
          <RewindButton />
          <Pause ms={2000} />
          <Effect fn={() => console.log("Paused for a bit there!")} />
          <OnChar fn={(char) => console.log(char)}>
            {"Way"}
            <em>{" aaaah? "}</em>
            <OnChar fn={(char) => console.log(`✨${char}`)}>{" cool!"}</OnChar>
          </OnChar>
          {1}
          {false}
          <Pace ms={20}>
            {"I'm in a fragment!💙"}
            <Pace ms={200}>
              {"Hee hee hee!"}
              <Pace ms={1000}>
                <em>{"Hm..."}</em>
                <div>
                  <b>{"Ehhhhhh?"}</b>
                </div>
              </Pace>
            </Pace>
          </Pace>
          <div>{"I'm in a div!"}</div>
          <TestComponent>{"I'm in a function component!"}</TestComponent>
          <TestComponent>
            {"I'm in a "}
            <AnotherTestComponent>
              <s>{"very "}</s>
              {"nested "}
            </AnotherTestComponent>
            {"test component!!!"}
          </TestComponent>
        </CharWrapper>
      </WindupChildren>
    </StrictMode>
  );
};

render(<Example />, document.getElementById("root"));
