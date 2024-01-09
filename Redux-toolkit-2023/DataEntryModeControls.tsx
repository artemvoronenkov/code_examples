import React from "react";

import styled from "styled-components";

import Checkbox from "components/common/Checkbox";
import { colors } from "styles/colors";

const Container = styled.div`
  display: flex;
  padding-bottom: 16px;
  margin-bottom: 32px;
  border-bottom: 1px solid ${colors.gray3};

  label {
    color: ${colors.darkGray4};
  }
`;

const StyledCheckbox = styled(Checkbox)`
  margin-right: 32px;
`;

export interface IOnCheckProps {
  isBoxChecked: boolean;
}

interface IOwnProps {
  isSingleAssetIdMode: boolean;
  isSingleQuarterMode: boolean;
  onSingleAssetIdModeChange: ({ isBoxChecked }: IOnCheckProps) => void;
  onSingleQuarterModeChange: ({ isBoxChecked }: IOnCheckProps) => void;
}

const DataEntryModeControls = ({
  isSingleAssetIdMode,
  isSingleQuarterMode,
  onSingleAssetIdModeChange,
  onSingleQuarterModeChange,
}: IOwnProps) => (
  <Container>
    <StyledCheckbox
      label="Set a Single Unique Asset ID"
      isChecked={isSingleAssetIdMode}
      checkedInfo={onSingleAssetIdModeChange}
    />

    <Checkbox
      label="Set a Single Quarter"
      isChecked={isSingleQuarterMode}
      checkedInfo={onSingleQuarterModeChange}
    />
  </Container>
);

export default DataEntryModeControls;
