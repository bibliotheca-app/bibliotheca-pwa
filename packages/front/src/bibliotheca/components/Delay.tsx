import { useEffect, useState } from 'react';
import * as React from 'react';

interface Props {
  wait: number; // in ms
}

export const Delay: React.SFC<Props> = ({ wait, children }) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const timeoutId = setTimeout(() => setShow(true), wait) as any;
    return () => clearTimeout(timeoutId);
  }, [wait, children]);

  return !show ? null : <>{children}</>;
};
