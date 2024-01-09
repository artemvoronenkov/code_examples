import React, { useMemo } from "react";

import { useSelector } from "react-redux";
import styled from "styled-components";

import IconButton from "components/common/buttons/IconButton/IconButton";
import Dropdown from "components/common/Dropdown";
import { IDropdownOption } from "components/common/Dropdown/DropdownList";
import CircleCrossIcon from "components/common/icons/CircleCrossIcon";
import Select from "components/common/Select";
import { ICreditAnalysisDeal } from "reducers/credit_analysis/dealsReducer";
import { IFinancialTypeDTO } from "reducers/credit_analysis/financialTypesReducer";
import {
  ICreditAnalysisQuarter,
  QuartersByDealType,
} from "reducers/credit_analysis/quartersReducer";
import { selectAllCAFinancialTypes } from "selectors/creditAnalysisSelectors/financialTypeSelectors";
import { selectAllCASuggestedDeals } from "selectors/creditAnalysisSelectors/suggestedDealsSelectors";
import { colors } from "styles/colors";
import { formatQuarterDate } from "utils/format/date";

import { AsteriskLabel } from "../styled";

import AssetIdInput from "./AssetIdInput";
import { IUploadedCADocument } from "./UploadDocumentsModal";

const QUARTERS_TO_FUTURE_AMOUNT = 1;

const Container = styled.div`
  padding-bottom: 8px;
`;

const Header = styled.div`
  display: flex;
`;

const Body = styled.div`
  margin-bottom: 32px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  &:not(:last-child) {
    margin-bottom: 32px;
  }
`;

const Cell = styled.div<{ disabled?: boolean }>`
  width: 160px;
  margin-right: 16px;
`;

const NameCell = styled.div`
  width: 350px;
  margin-right: 32px;
  word-break: break-all;
`;

const TypeCell = styled.div`
  width: 200px;
  margin-right: 24px;
`;

const HeadLabel = styled.span`
  color: ${colors.darkGray2};
`;

const StyledIconButton = styled(IconButton)`
  &:hover {
    background-color: ${colors.red};
  }
`;

const calcQuartersRange = (initialQuarter: IRangeQuarter) => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;

  const initialYear = parseInt(initialQuarter.year, 10);
  const initialMonth = parseInt(initialQuarter.month, 10);

  const futureQuarters: { month: string; year: string }[] = [];

  let year = initialYear;
  let month = initialMonth;

  // calculate the quarters between initialQuarter and today
  while (
    year < currentYear ||
    (year === currentYear && month <= currentMonth)
  ) {
    futureQuarters.push({
      month: month.toString(),
      year: year.toString(),
    });

    month += 3;
    if (month > 12) {
      month -= 12;
      year++;
    }
  }

  // add N number of quarters in the end of the array
  for (let i = 0; i < QUARTERS_TO_FUTURE_AMOUNT; i++) {
    futureQuarters.push({
      month: month.toString(),
      year: year.toString(),
    });

    month += 3;
    if (month > 12) {
      month -= 12;
      year++;
    }
  }

  return futureQuarters;
};

const generateDocumentKey = (dealId: string, quarterId: string) =>
  `${dealId}_${quarterId}`;

interface IRangeQuarter {
  month: string;
  year: string;
}

export interface ISuggestedAssetOption {
  id: string;
  name: string;
}

export interface IFinancialTypeOption {
  id: string;
  value: string;
  disabled: boolean;
}

interface IOwnProps {
  list: IUploadedCADocument[];
  quartersByDeal: QuartersByDealType;
  isDeleteEnabled: boolean;
  isSingleAssetIdMode: boolean;
  isSingleQuarterMode: boolean;
  onAssetIdChange: (
    documentName: string
  ) => (option: ISuggestedAssetOption) => void;
  onQuarterChange: (documentName: string) => (option: IDropdownOption) => void;
  onTypeCheck: (documentName: string) => (name: string, option: string) => void;
  onTypeUncheck: (
    documentName: string
  ) => (name: string, option: string) => void;
  onDocumentDelete: (documentName: string) => () => void;
}

const UploadedDocumentsList = ({
  list,
  quartersByDeal,
  isDeleteEnabled,
  isSingleAssetIdMode,
  isSingleQuarterMode,
  onAssetIdChange,
  onQuarterChange,
  onTypeCheck,
  onTypeUncheck,
  onDocumentDelete,
}: IOwnProps) => {
  const suggestedDeals: ICreditAnalysisDeal[] = useSelector(
    selectAllCASuggestedDeals
  );
  const financialTypesList: IFinancialTypeDTO[] = useSelector(
    selectAllCAFinancialTypes
  );

  const suggestedAssetsOptions: ISuggestedAssetOption[] = useMemo(
    () => suggestedDeals.map(({ id, asset_id }) => ({ id, name: asset_id })),
    [suggestedDeals]
  );

  const disabledFinancialTypesByAssetQuarter: Record<
    string,
    string[]
  > = list.reduce((acc, { asset, quarter, financialTypes }) => {
    if (financialTypes.length) {
      const documentKey = generateDocumentKey(asset.dealId, quarter.id);
      const documentFinancialTypes = acc[documentKey] || [];
      acc[documentKey] = [...documentFinancialTypes, ...financialTypes];
    }
    return acc;
  }, {});

  return (
    <Container>
      <Header>
        <NameCell>
          <HeadLabel>File Name</HeadLabel>
        </NameCell>
        <Cell>
          <AsteriskLabel>*</AsteriskLabel>
          <HeadLabel>Unique Asset ID</HeadLabel>
        </Cell>
        <Cell>
          <AsteriskLabel>*</AsteriskLabel>
          <HeadLabel>Quarter</HeadLabel>
        </Cell>
        <Cell>
          <AsteriskLabel>*</AsteriskLabel>
          <HeadLabel>Specific Type</HeadLabel>
        </Cell>
      </Header>

      <Body>
        {list.map((document, index) => {
          const isNotFirst = index !== 0;
          const documentDealId = document.asset.dealId;
          const isAssetIdInputDisabled = isNotFirst && isSingleAssetIdMode;
          const isQuarterInputDisabled =
            (isNotFirst && isSingleQuarterMode) || !documentDealId;
          const isFinancialTypesInputDisabled =
            !documentDealId || !document.quarter.id;

          const dealQuarters: ICreditAnalysisQuarter[] =
            quartersByDeal[documentDealId] || [];
          const firstQuarter = dealQuarters.length
            ? dealQuarters[dealQuarters.length - 1]
            : null;
          const initialQuarter = firstQuarter
            ? {
                month: firstQuarter.month,
                year: firstQuarter.year,
              }
            : null;
          const quartersRange = initialQuarter
            ? calcQuartersRange(initialQuarter)
            : [];
          const quarterOptions = quartersRange.map(({ month, year }) => ({
            id: `${month}/${year}/${documentDealId}`,
            title: formatQuarterDate(month, year),
            month,
            year,
          }));

          const documentKey = generateDocumentKey(
            document.asset.dealId,
            document.quarter.id
          );
          const disabledFinancialTypes =
            disabledFinancialTypesByAssetQuarter[documentKey] || [];
          const financialTypesOptions: IFinancialTypeOption[] = financialTypesList.map(
            ({ name }) => ({
              id: name,
              value: name,
              disabled:
                disabledFinancialTypes.includes(name) &&
                !document.financialTypes.includes(name),
            })
          );

          return (
            <Row key={document.name}>
              <NameCell>{document.name}</NameCell>
              <Cell disabled={isAssetIdInputDisabled}>
                <AssetIdInput
                  value={document.asset}
                  options={suggestedAssetsOptions}
                  disabled={isAssetIdInputDisabled}
                  onChange={onAssetIdChange(document.name)}
                />
              </Cell>
              <Cell disabled={isQuarterInputDisabled}>
                <Dropdown
                  selectedId={document.quarter.id}
                  options={quarterOptions}
                  disabled={isQuarterInputDisabled}
                  onOptionClick={onQuarterChange(document.name)}
                />
              </Cell>
              <TypeCell>
                <Select
                  value={document.financialTypes}
                  list={financialTypesOptions}
                  disabled={isFinancialTypesInputDisabled}
                  onAddOption={onTypeCheck(document.name)}
                  onRemoveOption={onTypeUncheck(document.name)}
                />
              </TypeCell>
              {isDeleteEnabled ? (
                <StyledIconButton
                  RenderIcon={CircleCrossIcon}
                  onClick={onDocumentDelete(document.name)}
                />
              ) : null}
            </Row>
          );
        })}
      </Body>
    </Container>
  );
};

export default UploadedDocumentsList;
