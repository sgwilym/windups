import * as React from "react";

type EffectProps = {
  fn: () => void;
};

const Effect: React.FC<EffectProps> = ({ fn }) => {
  React.useEffect(() => {
    fn();
    // We can safely omit fn from dependencies as if its value changes
    // the whole windup will be re-rendered anyway
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default Effect;
