import { Route } from 'react-router';

// components
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute';

// types
import { TAppRouteData } from '../types';

// utils
import { getRouteByName } from './getRouteByName';

export const renderRoute = ({ Component, guards, name }: TAppRouteData) => (
  <Route
    element={
      <ProtectedRoute guards={guards}>
        <Component />
      </ProtectedRoute>
    }
    key={name}
    path={getRouteByName(name)}
  />
);
