import * as React from "react";

type EffectProps = {
  fn: () => void;
};

const Effect: React.FC<EffectProps> = ({ fn }) => {
  React.useEffect(() => {
    fn();
    // eslint-ignore-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default Effect;
