import React from "react";
import {
  RouteProps as ReactDOMRouteProps,
  Route as ReactDOMRoute,
  Redirect,
} from "react-router-dom";

import { useAuth } from "../hooks/auth";

interface RouteProps extends ReactDOMRouteProps {
  isPrivate?: boolean;
  isAdm?: boolean;
  component: React.ComponentType;
}

const Route: React.FC<RouteProps> = ({
  isPrivate = false,
  isAdm = false,
  component: Component,
  ...rest
}) => {
  const { user } = useAuth();

  if(user) {
    if(user.acesso === '1') {
      isAdm = true;
    } else {
      isAdm = false;
    }
  }

  return (
    <ReactDOMRoute
      {...rest}
      render={({ location }) => {
        if (isPrivate === !!user) {
          return <Component />;
        }if (isAdm) {
          return <Redirect
          to={{
            pathname: isPrivate ? "/" : "/dashboard-adm",
            state: { form: location },
          }}
        />
        } else {
          return <Redirect
          to={{
            pathname: isPrivate ? "/" : "/dashboard",
            state: { form: location },
          }}
        />
        }
      }}
    />
  );
};

export default Route;
