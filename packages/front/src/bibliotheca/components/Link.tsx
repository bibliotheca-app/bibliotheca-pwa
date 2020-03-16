import { RouterActions } from 'bibliotheca/features/router/interface';
import { useRouter } from 'bibliotheca/hooks/useRouter';
import { AppPaths, GetOptionFromPath } from 'bibliotheca/routes';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useActions } from 'typeless';
import { PushOption } from 'bibliotheca/types';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  //
}

export const LinkOld = (props: LinkProps) => {
  const { href, onClick, children } = props;
  const { navigate } = useActions(RouterActions);

  return (
    <a
      {...props}
      onClick={e => {
        e.preventDefault();
        if (href) {
          navigate(href);
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

export function Link<T extends AppPaths>(
  props: React.PropsWithChildren<GetOptionFromPath<T>>,
): JSX.Element;
export function Link({ children, ...option }: React.PropsWithChildren<PushOption>) {
  const { history } = useRouter();
  const to = history.createHref(option);
  return <RouterLink to={to}>{children}</RouterLink>;
}
