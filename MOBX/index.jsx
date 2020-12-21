import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { Switch, Route } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";

import { t } from "core/i18n";
import createLink from "services/createLink";
import { ROUTES } from "modules";
import groupAuthCodesStore from "modules/groups/store/groupAuthCodes";
import Switcher from "components/FormSwitch/SimpleSwitch";
import Loading from "components/Loading";
import PageTitle from "components/PageTitle";
import Tabs from "components/Tabs";
import InfoText from "components/InfoText";
import Codes from "./components/Codes";
import Settings from "./components/Settings";
import Users from "./components/Users";

import { authCodesStyles as styles } from "./styles";

const tabs = [
  {
    id: "codes",
    name: t("shared:Codes"),
    component: Codes,
  },
  {
    id: "settings",
    name: t("shared:Settings"),
    component: Settings,
  },
  {
    id: "users",
    name: t("shared:Users"),
    component: Users,
  },
];

const Content = ({ tabs, params, history }) => {
  const handleTabClick = (tabID) => {
    const url = createLink({
      url: `${ROUTES.groupAuthCodes}/${tabID}`,
      params,
    });
    history.push(url);
  };

  return (
    <>
      <Tabs tabs={tabs} active={params.tabID} onTabChange={handleTabClick} />
      <Switch>
        {tabs.map(({ id, component }) => (
          <Route
            key={id}
            path={`${ROUTES.groupAuthCodes}/${id}`}
            component={component}
            exact
          />
        ))}
      </Switch>
    </>
  );
};

const AuthCodes = ({ classes, match: { params }, history }) => {
  const { t } = useTranslation();

  const {
    getCodesSettings,
    updateCodesSettings,
    isCodesSettingsLoading,
    codesSettings: { isServiceEnabled },
  } = groupAuthCodesStore;

  useEffect(() => {
    getCodesSettings({ ...params });
    if (!params.tabID) {
      const url = createLink({
        url: `${ROUTES.groupAuthCodes}/${tabs[0].id}`,
        params,
      });
      history.replace(url);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBackClick = (e) => {
    e.preventDefault();
    history.push(
      createLink({
        url: `${ROUTES.groupCallingSettings}`,
        params,
      })
    );
  };

  const handleSwitchService = (e, isServiceEnabled) => {
    updateCodesSettings({
      ...params,
      payload: {
        type: isServiceEnabled ? "Authorization Code" : "Deactivated",
      },
      callback: () => getCodesSettings(params),
    });
  };

  return (
    <div className={classes.mainWrapper}>
      <PageTitle title={t("Authorization codes")} backClick={handleBackClick} />

      <div className={classes.descriptionWrapper}>
        <InfoText info={t("authCodesDescription")} className={classes.title} />
        {isCodesSettingsLoading ? (
          <Loading />
        ) : (
          <Switcher checked={isServiceEnabled} onChange={handleSwitchService} />
        )}
      </div>

      {isServiceEnabled ? (
        <Content tabs={tabs} params={params} history={history} />
      ) : (
        <p className={classes.description}>{t("deactivatedServiceLabel")}</p>
      )}
    </div>
  );
};

export default withStyles(styles)(observer(AuthCodes));
