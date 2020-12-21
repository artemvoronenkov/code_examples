import { useState } from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { withStyles } from "@material-ui/core/styles";

import AuthCodesSettingsForm from "modules/groups/components/Forms/AuthCodesSettingsForm";
import authCodesStore from "store";
import ConfirmationModal from "components/ConfirmationModal";
import Loading from "components/Loading";

import { authCodesStyles as styles } from "styles";

const Settings = ({ classes, match: { params } }) => {
  const { t } = useTranslation();

  const {
    getCodesSettings,
    updateCodesSettings,
    isLoading,
    isStatusAvailable,
    codesSettings: { numberOfDigits, allowLocalAndTollFreeCalls },
  } = authCodesStore;

  const [confirmationData, setConfirmationData] = useState(null);

  const confirmationNotification = t(
    "confirmationEditCodesLengthNotification "
  );
  const init = { numberOfDigits, allowLocalAndTollFreeCalls };
  const isConfirmationModalVisible = confirmationData && isStatusAvailable;

  const handleSubmitForm = (formData) => setConfirmationData(formData);

  const handleCancelModal = () => setConfirmationData(null);

  const handleApproveModal = () => {
    updateCodesSettings({
      ...params,
      payload: confirmationData,
      callback: () => getCodesSettings(params),
    });
  };

  if (isLoading) return <Loading />;
  return (
    <div className={classes.settingsWrapper}>
      <AuthCodesSettingsForm init={init} onSubmit={handleSubmitForm} />

      {isConfirmationModalVisible && (
        <ConfirmationModal
          approveBtnTitle={t("shared:Save")}
          onCancel={handleCancelModal}
          onApprove={handleApproveModal}
        >
          {confirmationNotification}
        </ConfirmationModal>
      )}
    </div>
  );
};

export default withStyles(styles)(observer(Settings));
