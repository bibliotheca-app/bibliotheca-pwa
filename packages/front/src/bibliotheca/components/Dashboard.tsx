import { Progress } from 'bibliotheca/features/global/components/Progress';
import { GlobalActions } from 'bibliotheca/features/global/interface';
import { RouterActions } from 'bibliotheca/features/router/interface';
import { Box, Heading, Menu, ResponsiveContext, Tab, Tabs, ButtonProps } from 'grommet';
import { List as ListIcon, Logout as LogoutIcon, Add as AddIcon } from 'grommet-icons';
import * as React from 'react';
import { useCurrentRoute } from 'react-navi';
import styled from 'styled-components';
import { useActions } from 'typeless';
import icon from './bookshelf-64.png';

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
  ];
  const onActive = (index: number) => {
    navigate(links[index].link);
  };
  const activeIndex = links.findIndex(({ link }) => link.startsWith(route.url.pathname));

  const menuItems: ButtonProps[] = [
    {
      icon: <AddIcon />,
      label: '書籍登録',
      onClick: () => navigate('/books/register'),
    },
    {
      icon: <ListIcon />,
      label: '棚卸し',
      onClick: () => navigate('/inventory-event'),
    },
    {
      icon: <LogoutIcon />,
      label: 'ログアウト',
      onClick: logout,
    },
  ];
  /**
   * xsmall,small,middle,large
   */
  const appName = (size: string) => {
    switch (size) {
      case 'small':
        return <img src={icon} alt="bibliotheca" />;

      default:
        return 'Bibliotheca - 書籍管理 -';
    }
  };
  return (
    <ResponsiveContext.Consumer>
      {size => (
        <>
          <Progress />
          <AppBar>
            <Heading level="3" margin="none">
              {appName(size)}
            </Heading>
            <Tabs activeIndex={activeIndex} onActive={onActive}>
              {links.map((l, i) => (
                <Tab key={`tab_${i}`} title={l.title} />
              ))}
            </Tabs>
            <Box align="center">
              <Menu
                items={menuItems}
                dropProps={{
                  target: {},
                  align: { top: 'bottom', right: 'right' },
                }}
              />
            </Box>
          </AppBar>
          <Main>{children}</Main>
        </>
      )}
    </ResponsiveContext.Consumer>
  );
};
