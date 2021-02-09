import React, { useEffect } from 'react';

type EffectProps = {
  fn: () => void;
};

const Effect: React.FC<EffectProps> = ({ fn }) => {
  useEffect(() => {
    fn();
  }, []);

  return null;
};

export default Effect;
