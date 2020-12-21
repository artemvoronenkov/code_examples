import {
  decorate,
  observable,
  action,
  runInAction,
  computed,
  comparer,
} from "mobx";

import { PROXY } from "config/api";
import request from "services/https";
import getID from "services/getID";
import notificationsStore from "core/store/notifications";
import { t } from "core/i18n";
import { incomingCallsSummaryFormatter } from "helpers/incomingCallsSummaryFormatter";

export class authCodesStore {
  codes = [];
  users = [];
  usersId = [];
  codesSettings = {
    type: "Deactivated",
    numberOfDigits: 2,
    allowLocalAndTollFreeCalls: false,
    cfServices: {},
  };
  isLoading = false;
  isUsersLoading = false;
  isCodesSettingsLoading = false;

  getCodes = ({ tenantID = getID("tenantID"), groupID = getID("groupID") }) => {
    runInAction(() => {
      this.isLoading = true;
      this.codes = [];
    });

    return request({
      route: `${PROXY}/tenants/${tenantID}/groups/${groupID}/properties/auth_codes/`,
    })
      .then(({ data: { authCodes } }) => {
        runInAction(() => {
          this.codes = authCodes;
          this.isLoading = false;
        });
      })
      .catch((error) => {
        runInAction(() => {
          this.isLoading = false;
        });
        notificationsStore.setNotification({
          error,
          defaultMessage: t(
            "notification:Error of fetching Authorization codes data"
          ),
        });
      });
  };

  getCodesSettings = ({
    tenantID = getID("tenantID"),
    groupID = getID("groupID"),
  }) => {
    runInAction(() => {
      this.isCodesSettingsLoading = true;
      this.codesSettings = {};
    });

    return request({
      route: `${PROXY}/tenants/${tenantID}/groups/${groupID}/properties/auth_codes/config/`,
    })
      .then(({ data }) => {
        const transformedCodesSettings = {
          ...data,
          isServiceEnabled: data.type !== "Deactivated",
        };
        runInAction(() => {
          this.codesSettings = transformedCodesSettings;
          this.isCodesSettingsLoading = false;
        });
      })
      .catch((error) => {
        runInAction(() => {
          this.isCodesSettingsLoading = false;
        });
        notificationsStore.setNotification({
          error,
          defaultMessage: t("notification:errorFetchAuthCode"),
        });
      });
  };

  getUsers = ({ tenantID = getID("tenantID"), groupID = getID("groupID") }) => {
    runInAction(() => {
      this.isUsersLoading = true;
      this.users = [];
    });

    return request({
      route: `${PROXY}/tenants/${tenantID}/groups/${groupID}/properties/auth_codes/users/`,
    })
      .then(({ data: { mandatoryUsageUserIds } }) => {
        const transformedUsers = mandatoryUsageUserIds.map((mandatoryUser) => ({
          ...mandatoryUser,
          fullName: `${mandatoryUser.firstName} ${mandatoryUser.lastName}`,
        }));
        runInAction(() => {
          this.users = transformedUsers;
          this.usersId = mandatoryUsageUserIds.map(({ userId }) => userId);
          this.isUsersLoading = false;
        });
      })
      .catch((error) => {
        runInAction(() => {
          this.isUsersLoading = false;
        });
        notificationsStore.setNotification({
          error,
          defaultMessage: t("notification:Fetch users error"),
        });
      });
  };

  addCode = ({
    tenantID = getID("tenantID"),
    groupID = getID("groupID"),
    addData,
    callback,
  }) => {
    return request({
      route: `${PROXY}/tenants/${tenantID}/groups/${groupID}/properties/auth_codes/`,
      method: "POST",
      payload: addData,
    })
      .then(() => {
        notificationsStore.setNotification({
          variant: "success",
          defaultMessage: t("notification:groupAddAuthCodeSuccess", {
            codeName: addData.code,
          }),
        });
        if (callback) callback();
      })
      .catch((error) => {
        notificationsStore.setNotification({
          error,
          defaultMessage: t("notification:groupAddAuthCodeFail", {
            codeName: addData.code,
          }),
        });
      });
  };

  addUsers = ({
    tenantID = getID("tenantID"),
    groupID = getID("groupID"),
    usersToAdd,
    callback,
  }) => {
    const count = usersToAdd.length;
    // To add current plus new
    const usersToAddWithCurrent = this.users.concat(usersToAdd);

    return request({
      route: `${PROXY}/tenants/${tenantID}/groups/${groupID}/properties/auth_codes/users/`,
      method: "PUT",
      payload: {
        mandatoryUsageUserIds: usersToAddWithCurrent,
        optionalUsageUserIds: [],
      },
    })
      .then(() => {
        notificationsStore.setNotification({
          variant: "success",
          defaultMessage: t("notification:groupAddAuthCodesUsersSuccess", {
            count,
          }),
        });
        if (callback) callback();
      })
      .catch((error) => {
        notificationsStore.setNotification({
          error,
          defaultMessage: t("notification:groupAddAuthCodesUsersFail", {
            count,
          }),
        });
      });
  };

  updateCodesSettings = ({
    tenantID = getID("tenantID"),
    groupID = getID("groupID"),
    callback,
    payload,
  }) => {
    runInAction(() => {
      this.isLoading = true;
    });

    return request({
      route: `${PROXY}/tenants/${tenantID}/groups/${groupID}/properties/auth_codes/config/`,
      method: "PUT",
      payload,
    })
      .then(() => {
        notificationsStore.setNotification({
          variant: "success",
          defaultMessage: t("notification:groupUpdateAuthCodesSettingsSuccess"),
        });
        runInAction(() => {
          this.isLoading = false;
        });
        if (callback) callback();
      })
      .catch((error) => {
        notificationsStore.setNotification({
          error,
          defaultMessage: t("notification:groupUpdateAuthCodesSettingsFail"),
        });
        runInAction(() => {
          this.isLoading = false;
        });
      });
  };

  deleteSingleCode = ({
    tenantID = getID("tenantID"),
    groupID = getID("groupID"),
    codeName,
    callback,
  }) => {
    return request({
      route: `${PROXY}/tenants/${tenantID}/groups/${groupID}/properties/auth_codes/${codeName}`,
      method: "DELETE",
    })
      .then(() => {
        notificationsStore.setNotification({
          variant: "success",
          defaultMessage: t("notification:groupSingleAuthDeleteSuccess", {
            codeName,
          }),
        });
        if (callback) callback();
      })
      .catch(() => {
        notificationsStore.setNotification({
          defaultMessage: t("notification:groupSingleCodeDeleteFail", {
            codeName,
          }),
        });
      });
  };

  deleteMultipleCodes = ({
    tenantID = getID("tenantID"),
    groupID = getID("groupID"),
    authCodes,
    callback,
  }) => {
    const count = authCodes.length;

    return request({
      route: `${PROXY}/tenants/${tenantID}/groups/${groupID}/properties/auth_codes/`,
      payload: { authCodes },
      method: "DELETE",
    })
      .then(() => {
        notificationsStore.setNotification({
          variant: "success",
          defaultMessage: t("notification:groupMultipleCodesDeleteSuccess", {
            count,
          }),
        });
        if (callback) callback();
      })
      .catch(() => {
        notificationsStore.setNotification({
          defaultMessage: t("notification:groupMultipleCodesDeleteFail", {
            count,
          }),
        });
      });
  };

  deleteSingleUser = ({
    tenantID = getID("tenantID"),
    groupID = getID("groupID"),
    userToDelete: { userId, fullName },
    callback,
  }) => {
    // Remove deleted user from array
    const filteredUsers = this.users.filter((user) => userId !== user.userId);

    return request({
      route: `${PROXY}/tenants/${tenantID}/groups/${groupID}/properties/auth_codes/users/`,
      method: "PUT",
      payload: {
        mandatoryUsageUserIds: filteredUsers,
        optionalUsageUserIds: [],
      },
    })
      .then(() => {
        notificationsStore.setNotification({
          variant: "success",
          defaultMessage: t("notification:groupSingleUserDeleteSuccess", {
            fullName,
          }),
        });
        if (callback) callback();
      })
      .catch(() => {
        notificationsStore.setNotification({
          defaultMessage: t("notification:groupSingleUserDeleteFail", {
            fullName,
          }),
        });
      });
  };

  deleteMultipleUsers = ({
    tenantID = getID("tenantID"),
    groupID = getID("groupID"),
    usersIdToDelete,
    callback,
  }) => {
    // Remove deleted users from array
    const filteredUsers = this.users.filter(
      (user) => !usersIdToDelete.includes(user.userId)
    );
    const count = usersIdToDelete.length;

    return request({
      route: `${PROXY}/tenants/${tenantID}/groups/${groupID}/properties/auth_codes/users/`,
      method: "PUT",
      payload: {
        mandatoryUsageUserIds: filteredUsers,
        optionalUsageUserIds: [],
      },
    })
      .then(() => {
        notificationsStore.setNotification({
          variant: "success",
          defaultMessage: t("notification:groupMultipleUsersDeleteSuccess", {
            count,
          }),
        });
        if (callback) callback();
      })
      .catch(() => {
        notificationsStore.setNotification({
          defaultMessage: t("notification:groupMultipleUsersDeleteFail", {
            count,
          }),
        });
      });
  };

  get isStatusAvailable() {
    return !this.codes.some(
      ({ name, active }) => name === "Call Center - Basic" && active === true
    );
  }
  get cfServices() {
    return incomingCallsSummaryFormatter(this.codesSettings);
  }
}

decorate(authCodesStore, {
  codes: observable,
  users: observable,
  usersId: observable,
  codesSettings: observable,
  isServiceEnabled: observable,
  isLoading: observable,
  isUsersLoading: observable,
  isCodesSettingsLoading: observable,

  getCodes: action,
  getUsers: action,
  getCodesSettings: action,
  addCode: action,
  updateCodesSettings: action,
  deleteSingleCode: action,
  deleteMultipleCodes: action,
  deleteSingleUser: action,

  isStatusAvailable: computed,
  cfServices: computed({ equals: comparer.structural }),
});

export default new authCodesStore();
