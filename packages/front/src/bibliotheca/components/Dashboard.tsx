import { GlobalActions } from 'bibliotheca/features/global/interface';
import { RouterActions } from 'bibliotheca/features/router/interface';
import { Box, Button, Heading, Tab, Tabs } from 'grommet';
import { Logout } from 'grommet-icons';
import * as React from 'react';
import { useCurrentRoute } from 'react-navi';
import styled from 'styled-components';
import { useActions } from 'typeless';

const Main = styled.main`
  padding: 20px;
`;

interface DashboardProps {
  className?: string;
  children: React.ReactNode;
}

const AppBar = (props: { children: any }) => (
  <Box
    tag="header"
    direction="row"
    align="center"
    justify="between"
    background="brand"
    pad={{ left: 'medium', right: 'small', vertical: 'small' }}
    elevation="medium"
    style={{ zIndex: 1 }}
    {...props}
  />
);
export const Dashboard = (props: DashboardProps) => {
  const { children } = props;
  const { logout } = useActions(GlobalActions);
  const { navigate } = useActions(RouterActions);
  const route = useCurrentRoute();

  const links = [
    { link: '/books', title: '書籍一覧' },
    { link: '/borrow-or-return', title: '貸出/返却' },
    { link: '/inventory-event', title: '棚卸し' },
  ];
  const onActive = (index: number) => {
    navigate(links[index].link);
  };
  const activeIndex = links.findIndex(({ link }) => link.startsWith(route.url.pathname));

  return (
    <>
      <AppBar>
        <Heading level="3" margin="none">
          Bibliotheca - 書籍管理 -
        </Heading>
        <Tabs activeIndex={activeIndex} onActive={onActive}>
          {links.map((l, i) => (
            <Tab key={`tab_${i}`} title={l.title} />
          ))}
        </Tabs>
        <Button icon={<Logout />} onClick={logout} />
      </AppBar>
      <Main>{children}</Main>
    </>
  );
};
