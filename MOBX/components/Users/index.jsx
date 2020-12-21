import { useState, useEffect, useMemo } from "react";
import { observer, useLocalStore } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { withStyles } from "@material-ui/core/styles";

import { t } from "core/i18n";
import AuthCodesAddUsersModal from "modules/groups/components/Modals/AuthCodesAddUsersModal";
import authCodesStore from "store";
import ConfirmationModal from "components/ConfirmationModal";
import ActionButton from "components/ActionButton";
import SearchInput from "components/SearchInput";
import Table from "components/Table";
import { withResolution } from "components/HOC";
import getFilteredList from "helpers/getFilteredList";
import UserTableRowCard from "./mobile/TableCard";

import TrashIcon from "assets/svg/TrashIcon";
import { authCodesStyles as styles } from "styles";

const tableOptions = {
  selection: true,
};
const mobileTableOptions = {
  selection: true,
  header: false,
  detailPanelColumnAlignment: "right",
  tableLayout: "auto",
  emptyRowsWhenPaging: false,
};

const columns = [
  {
    cellStyle: {
      color: "#828282",
    },
    width: 60,
    title: "",
    render: ({ tableData }) => <span className="idx">{1 + tableData.id}</span>,
  },

  {
    title: t("shared:Name"),
    field: "fullName",
  },
  {
    title: t("shared:E-mail"),
    field: "emailAddress",
  },
  {
    title: t("shared:Phone number"),
    field: "phoneNumber",
  },
  {
    title: t("shared:Extension"),
    field: "extension",
  },
  {
    title: t("shared:Department"),
    field: "department.departmentName",
  },
];

const ADD_MODAL_ID = 1;
const DELETE_SINGLE_MODAL_ID = 2;
const DELETE_MULTIPLE_MODAL_ID = 3;

const Users = ({ classes, match: { params }, resolution: isMobile }) => {
  const { t } = useTranslation();

  const {
    getUsers,
    addCode,
    deleteSingleUser,
    deleteMultipleUsers,
    users,
    isUsersLoading,
  } = authCodesStore;

  const [search, setSearch] = useState("");
  const state = useLocalStore(() => ({
    openModalId: null,
    singleUserToDelete: {
      fullName: "",
      userId: "",
    },
    usersIdToDelete: [],
    setOpenModalId(id) {
      this.openModalId = id;
    },
    setSingleUserToDelete({ userId, fullName }) {
      this.singleUserToDelete = { userId, fullName };
    },
    setUsersIdToDelete(usersId) {
      this.usersIdToDelete = usersId;
    },
    closeModal() {
      this.openModalId = null;
    },
  }));

  useEffect(() => {
    getUsers(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Search ----
  const list = useMemo(
    () =>
      getFilteredList(search, users, [
        "fullName",
        "emailAddress",
        "phoneNumber",
        "extension",
        "department.departmentName",
      ]),
    [search, users]
  );

  const handleSearch = ({ target }) => {
    const val = target.value ? target.value.toLowerCase() : "";
    setSearch(val);
  };
  // -----

  // Close modal and trigger GET request to refresh page
  const defaultCallback = () => {
    state.closeModal();
    getUsers(params);
  };

  // Single delete -----
  const isSingleDeleteModalOpen = state.openModalId === DELETE_SINGLE_MODAL_ID;

  const singleDeleteNotification = t(
    "notification:deleteUserFromListConfirmation",
    {
      userFullName: state.singleUserToDelete.fullName,
    }
  );

  const handleOpenSingleDeleteModal = ({ userId, fullName }) => {
    state.setSingleUserToDelete({ userId, fullName });
    state.setOpenModalId(DELETE_SINGLE_MODAL_ID);
  };

  const handleSingleDelete = () => {
    const payload = {
      userToDelete: state.singleUserToDelete,
      callback: defaultCallback,
    };
    deleteSingleUser({ ...params, ...payload });
  };
  // -----

  // Multiple delete -----
  const isMultiDeleteModalOpen = state.openModalId === DELETE_MULTIPLE_MODAL_ID;

  const multipleDeleteNotification = t(
    "notification:Are you sure you want to delete {{usersAmount}} users from the list ?",
    {
      usersAmount: state.usersIdToDelete.length,
    }
  );

  const handleOpenMultipleDeleteModal = () => {
    state.setOpenModalId(DELETE_MULTIPLE_MODAL_ID);
  };

  const handleMultipleDelete = () => {
    const formattedUsersIdToDelete = state.usersIdToDelete.map(
      (userToDelete) => userToDelete.userId
    );

    const payload = {
      usersIdToDelete: formattedUsersIdToDelete,
      callback: defaultCallback,
    };
    deleteMultipleUsers({ ...params, ...payload });
  };
  // -----

  // Add modal -----
  const isAddModalOpen = state.openModalId === ADD_MODAL_ID;

  const handleOpenAddModal = () => {
    state.setOpenModalId(ADD_MODAL_ID);
  };

  const handleAddCode = (addData) => {
    const payload = {
      addData,
      callback: defaultCallback,
    };
    addCode({ ...params, ...payload });
  };
  // -----

  const actions = [
    {
      tooltip: t("shared:Delete user"),
      icon: TrashIcon,
      position: "row",
      onClick: (e, value) => handleOpenSingleDeleteModal(value),
    },
  ];

  const mobileColumns = [
    {
      cellStyle: {
        padding: 0,
        height: 50,
      },
      render: (data) => (
        <UserTableRowCard
          classes={classes}
          handleDelete={handleOpenSingleDeleteModal}
          info={data}
        />
      ),
    },
  ];

  return (
    <>
      <div className={classes.actionBar}>
        <SearchInput onChange={handleSearch} className={classes.search} />
        <div className={classes.actionButtonsWrapper}>
          <ActionButton
            title={t("shared:Delete")}
            icon={<TrashIcon />}
            disabled={!state.usersIdToDelete.length}
            handleClick={handleOpenMultipleDeleteModal}
          />
          <div className={classes.divider} />
          <ActionButton
            title={t("shared:Add")}
            handleClick={handleOpenAddModal}
          />
        </div>
      </div>

      <Table
        className={classes.usersTable}
        isLoading={isUsersLoading}
        columns={isMobile ? mobileColumns : columns}
        actions={actions}
        data={list}
        options={isMobile ? mobileTableOptions : tableOptions}
        onSelectionChange={state.setUsersIdToDelete}
      />

      {isSingleDeleteModalOpen && (
        <ConfirmationModal
          onCancel={state.closeModal}
          onApprove={handleSingleDelete}
        >
          {singleDeleteNotification}
        </ConfirmationModal>
      )}
      {isMultiDeleteModalOpen && (
        <ConfirmationModal
          onCancel={state.closeModal}
          onApprove={handleMultipleDelete}
        >
          {multipleDeleteNotification}
        </ConfirmationModal>
      )}
      {isAddModalOpen && (
        <AuthCodesAddUsersModal
          handleClose={state.closeModal}
          handleAddCode={handleAddCode}
          params={params}
        />
      )}
    </>
  );
};

export default withResolution(867)(withStyles(styles)(observer(Users)));
