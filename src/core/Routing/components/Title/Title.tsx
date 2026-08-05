import { FC, useEffect } from 'react';
import { useLocation } from 'react-router';

// others
import { APP_NAME } from 'constant/appName';
import { APP_ROUTES_DATA } from '../../constants/appRoutesData';
import { ROUTES } from '../../constants/routes';

export const Title: FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const route = APP_ROUTES_DATA.find(({ name }) => ROUTES[name] === pathname);

    document.title = route ? `${route.title} - ${APP_NAME}` : `404 - ${APP_NAME}`;
  }, [pathname]);

  return null;
};

export default Title;
