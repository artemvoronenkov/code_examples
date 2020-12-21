import { useState, useEffect, useMemo } from "react";
import { observer, useLocalStore } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { withStyles } from "@material-ui/core/styles";

import { t } from "core/i18n";
import AddAuthCodeModal from "modules/groups/components/Modals/AddAuthModal";
import authCodesStore from "store";
import ConfirmationModal from "components/ConfirmationModal";
import ActionButton from "components/ActionButton";
import SearchInput from "components/SearchInput";
import Table from "components/Table";
import { withResolution } from "components/HOC";
import getFilteredList from "helpers/getFilteredList";
import MobileTableCard from "./mobile/TableCard";

import TrashIcon from "assets/svg/TrashIcon";
import { authCodesStyles as styles } from "styles";

const tableOptions = {
  selection: true,
};

const mobileTableOptions = {
  header: false,
  tableLayout: "auto",
  selection: true,
};

const columns = [
  {
    cellStyle: {
      color: "#828282",
    },
    width: 60,
    title: "",
    render: ({ tableData }) => 1 + tableData.id,
  },

  {
    title: t("shared:Code"),
    field: "code",
  },
  {
    title: t("shared:Description"),
    field: "description",
  },
];

const ADD_MODAL_ID = 1;
const DELETE_SINGLE_MODAL_ID = 2;
const DELETE_MULTIPLE_MODAL_ID = 3;

const AuthCodes = ({ classes, match: { params }, resolution: isMobile }) => {
  const { t } = useTranslation();

  const {
    getCodes,
    addCode,
    deleteSingleCode,
    deleteMultipleCodes,
    codes,
    isLoading,
  } = authCodesStore;

  const [search, setSearch] = useState("");
  const state = useLocalStore(() => ({
    openModalId: null,
    codeNameForDelete: "",
    codesListForDelete: [],
    setOpenModalId(id) {
      this.openModalId = id;
    },
    setCodeNameForDelete(codeName) {
      this.codeNameForDelete = codeName;
    },
    setCodesListForDelete(codes) {
      this.codesListForDelete = codes;
    },
    closeModal() {
      this.openModalId = null;
    },
  }));

  useEffect(() => {
    getCodes(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Search ----
  const list = useMemo(
    () => getFilteredList(search, codes, ["code", "description"]),
    [search, codes]
  );

  const handleSearch = ({ target }) => {
    const val = target.value ? target.value.toLowerCase() : "";
    setSearch(val);
  };
  // -----

  // Close modal and trigger GET request to refresh page
  const defaultCallback = () => {
    state.closeModal();
    getCodes(params);
  };

  // Single delete -----
  const isSingleDeleteModalOpen = state.openModalId === DELETE_SINGLE_MODAL_ID;

  const singleDeleteNotification = t("notification:codeDeleteConfirmation", {
    code: state.codeNameForDelete,
  });

  const handleOpenSingleDeleteModal = (code) => {
    state.setCodeNameForDelete(code);
    state.setOpenModalId(DELETE_SINGLE_MODAL_ID);
  };

  const handleSingleDelete = () => {
    const payload = {
      codeName: state.codeNameForDelete,
      callback: defaultCallback,
    };
    deleteSingleCode({ ...params, ...payload });
  };
  // -----

  // Multiple delete -----
  const isMultiDeleteModalOpen = state.openModalId === DELETE_MULTIPLE_MODAL_ID;

  const multipleDeleteNotification = t("notification:confirmationDeleteCodes", {
    count: state.codesListForDelete.length,
  });

  const handleOpenMultipleDeleteModal = () => {
    state.setOpenModalId(DELETE_MULTIPLE_MODAL_ID);
  };

  const handleMultipleDelete = () => {
    const payload = {
      authCodes: state.codesListForDelete,
      callback: defaultCallback,
    };
    deleteMultipleCodes({ ...params, ...payload });
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
      tooltip: t("shared:Delete authorisation code"),
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
        verticalAlign: "top",
      },
      render: (data) => {
        return (
          <MobileTableCard
            deleteContact={handleOpenSingleDeleteModal}
            data={data}
          />
        );
      },
    },
  ];

  return (
    <div className={classes.shortWrapper}>
      <div className={classes.actionBar}>
        <SearchInput onChange={handleSearch} className={classes.search} />
        <div className={classes.actionButtonsWrapper}>
          <ActionButton
            title={t("shared:Delete")}
            icon={<TrashIcon />}
            disabled={!state.codesListForDelete.length}
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
        className={classes.table}
        isLoading={isLoading}
        columns={isMobile ? mobileColumns : columns}
        actions={isMobile ? [] : actions}
        data={list}
        options={isMobile ? mobileTableOptions : tableOptions}
        onSelectionChange={state.setCodesListForDelete}
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
        <AddAuthCodeModal
          handleClose={state.closeModal}
          handleAddCode={handleAddCode}
        />
      )}
    </div>
  );
};

export default withResolution(480)(withStyles(styles)(observer(AuthCodes)));
