import { RouterActions } from 'bibliotheca/features/router/interface';
import React from 'react';
import { useActions } from 'typeless';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  //
}

export const Link = (props: LinkProps) => {
  const { href, onClick, children } = props;
  const { push } = useActions(RouterActions);

  return (
    <a
      {...props}
      onClick={e => {
        e.preventDefault();
        if (href) {
          push(href);
        }
        if (onClick) {
          onClick(e);
        }
      }}
    >
      {children}
    </a>
  );
};
