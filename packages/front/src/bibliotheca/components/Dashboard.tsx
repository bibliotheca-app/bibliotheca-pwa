import { Progress } from 'bibliotheca/features/global/components/Progress';
import { getGlobalState, GlobalActions } from 'bibliotheca/features/global/interface';
import { RouterActions } from 'bibliotheca/features/router/interface';
import { Box, ButtonProps, Heading, Menu, ResponsiveContext, Tab, Tabs, Grommet } from 'grommet';
import {
  Add as AddIcon,
  Configure as ManagementIcon,
  List as ListIcon,
  Logout as LogoutIcon,
  User as UserIcon,
} from 'grommet-icons';
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

type MenuItem = ButtonProps & {
  onClick: () => void;
};

export const Dashboard = (props: DashboardProps) => {
  const { children } = props;
  const { logout } = useActions(GlobalActions);
  const { navigate } = useActions(RouterActions);
  const route = useCurrentRoute();
  const { user } = getGlobalState.useState();
  const userId = user == null ? '' : user.email;

  const links = [
    { link: '/books', title: '書籍一覧' },
    { link: '/borrow-or-return', title: '貸出/返却' },
  ];
  const onActive = (index: number) => {
    navigate(links[index].link);
  };
  const activeIndex = links.findIndex(({ link }) => link.startsWith(route.url.pathname));

  const menuItems: MenuItem[] = [
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
      icon: <ManagementIcon />,
      label: '管理',
      onClick: () => navigate('/management'),
    },
    {
      icon: <UserIcon />,
      label: 'ユーザー',
      onClick: () => navigate(`/user/${userId}`),
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
        <Grommet plain>
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
        </Grommet>
      )}
    </ResponsiveContext.Consumer>
  );
};
