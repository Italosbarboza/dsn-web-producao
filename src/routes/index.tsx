import React from "react";
import { Switch } from "react-router-dom";

import Route from "./Route";

import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import Dashboard from "../pages/Dashboard";
import DashboardAdm from "../pages/DashboardAdm";
import SignUpAdm from "../pages/SignUpAdm";
import Profile from "../pages/Profile";
import ProfileAdm from "../pages/Profile";
import PublicCompareFile from "../pages/PublicCompareFile";

const Routes: React.FC = () => {
  return (
    <Switch>
      <Route path="/" exact component={SignIn} />
      <Route path="/signup" component={SignUp} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/autenticacao" component={PublicCompareFile} />

      <Route path="/dashboard-adm" component={DashboardAdm} isPrivate />
      <Route path="/adm/create-new-user" component={SignUpAdm} isPrivate />
      <Route path="/adm/profile" component={ProfileAdm} isPrivate />
      <Route path="/dashboard" component={Dashboard} isPrivate />
      <Route path="/profile" component={Profile} isPrivate />
    </Switch>
  );
};

export default Routes;
