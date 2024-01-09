import React, { ChangeEvent } from "react";

import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import { commonActions } from "actions/common";
import UploadInput from "components/common/inputs/UploadInput";
import {
  IModuleSettings,
  SectionPathnameEnum,
} from "interfaces/common/modules";
import { selectCurrentModuleSettings } from "selectors/common";
import { colors } from "styles/colors";

import UploadDocumentsModal from "./UploadDocumentsModal";

const DEFAULT_CAPTION = "Documents Dashboard";

export const Container = styled.div`
  display: flex;
  align-items: center;
`;

export const Title = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: ${colors.inputText};
`;

export const Delimiter = styled.div`
  width: 1px;
  height: 28px;
  margin: 0 24px;
  background: ${colors.gray4};
`;

const UploadingContainer = () => {
  const dispatch = useDispatch();

  const currentModuleSettings: IModuleSettings = useSelector(
    selectCurrentModuleSettings
  );
  const currentRoute = currentModuleSettings.routing.find(
    ({ value }) => value === SectionPathnameEnum.DocumentsDashboard
  );

  const handleSelectFiles = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      const filesList = Array.from(event.target.files);
      const modalConfig = {
        title: "Upload Files",
        body: <UploadDocumentsModal filesList={filesList} />,
        actions: [],
        className: "ca-upload-documents-modal",
      };
      dispatch(commonActions.setModal(modalConfig));
    }
  };

  return (
    <Container>
      <Title>{currentRoute?.caption || DEFAULT_CAPTION}</Title>
      <Delimiter />
      <UploadInput onChange={handleSelectFiles} />
    </Container>
  );
};

export default UploadingContainer;
