import React from "react";

import styled from "styled-components";

import Button from "components/common/Button";
import Loader from "components/common/Loader";
import {
  useIsPostDealDocumentsLoading,
  useIsPostQuartersLoading,
} from "utils/hooks/loadingHooks";

const Container = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;

  button {
    width: 120px;
    height: 32px;
    margin: 0 8px;
  }
`;

interface IOwnProps {
  isApplyDisabled: boolean;
  onCancel: () => void;
  onApply: () => void;
}

const UploadDocumentsModalActions = ({
  isApplyDisabled,
  onCancel,
  onApply,
}: IOwnProps) => {
  const isPostQuartersLoading = useIsPostQuartersLoading();
  const isPostDocumentsLoading = useIsPostDealDocumentsLoading();
  const isLoading = isPostQuartersLoading || isPostDocumentsLoading;

  return (
    <Container>
      <Button mode="secondary" onClick={onCancel}>
        Cancel
      </Button>
      <Button
        mode="primary"
        disabled={isApplyDisabled || isLoading}
        onClick={onApply}
      >
        {isLoading ? <Loader /> : "Upload"}
      </Button>
    </Container>
  );
};

export default UploadDocumentsModalActions;
