import React, { useCallback, useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { commonActions } from "actions/common";
import { IDropdownOption } from "components/common/Dropdown/DropdownList";
import { dealDocumentsActions } from "reducers/credit_analysis/dealDocuments";
import {
  financialTypesActions,
  IFinancialTypeDTO,
} from "reducers/credit_analysis/financialTypesReducer";
import {
  quartersActions,
  QuartersByDealType,
} from "reducers/credit_analysis/quartersReducer";
import { suggestedDealsActions } from "reducers/credit_analysis/suggestedDealsReducer";
import { selectAllCAFinancialTypes } from "selectors/creditAnalysisSelectors/financialTypeSelectors";
import { selectCAQuartersByDeal } from "selectors/creditAnalysisSelectors/quarterSelectors";

import DataEntryModeControls, { IOnCheckProps } from "./DataEntryModeControls";
import UploadDocumentsModalActions from "./UploadDocumentsModalActions";
import UploadedDocumentsList, {
  ISuggestedAssetOption,
} from "./UploadedDocumentsList";

const ONLY_SINGLE_SELECT_FINANCIAL_TYPES = [
  "Loan Agreement",
  "Loan Agreement Amendment",
];

const INITIAL_QUARTER = {
  id: "",
  month: "",
  year: "",
};

export interface IDocumentAsset {
  dealId: string;
  assetId: string;
}
export interface IUploadedCADocument {
  name: string;
  financialTypes: string[];
  asset: IDocumentAsset;
  quarter: {
    id: string;
    month: string;
    year: string;
  };
  file: File;
}

interface IOwnProps {
  filesList: File[];
}

const UploadDocumentsModal = ({ filesList }: IOwnProps) => {
  const dispatch = useDispatch();
  const quartersByDeal: QuartersByDealType = useSelector(
    selectCAQuartersByDeal
  );
  const financialTypesList: IFinancialTypeDTO[] = useSelector(
    selectAllCAFinancialTypes
  );

  const initialDocumentsList = filesList.map((file) => ({
    name: file.name,
    financialTypes: [],
    asset: { dealId: "", assetId: "" },
    quarter: INITIAL_QUARTER,
    file,
  }));

  const [isSingleAssetIdMode, setIsSingleAssetIdMode] = useState(false);
  const [isSingleQuarterMode, setIsSingleQuarterMode] = useState(false);
  const [tableDocumentsList, setTableDocumentsList] = useState<
    IUploadedCADocument[]
  >(initialDocumentsList);

  useEffect(() => {
    dispatch(
      suggestedDealsActions.fetchSuggestedDeals({
        queryParams: {
          page: 1,
        },
        withAccumulation: false,
      })
    );
    dispatch(financialTypesActions.fetchFinancialTypes());
  }, []);

  const isMultiList = tableDocumentsList.length > 1;

  const isApplyDisabled = useCallback(() => {
    let isDisabled = false;
    for (const document of tableDocumentsList) {
      if (isDisabled) {
        break;
      }
      if (
        !document.asset.dealId ||
        !document.quarter.id ||
        document.financialTypes.length === 0
      ) {
        isDisabled = true;
      }
    }
    return isDisabled;
  }, [tableDocumentsList]);

  const handleSingleAssetIdModeChange = ({ isBoxChecked }: IOnCheckProps) => {
    setIsSingleAssetIdMode(isBoxChecked);
    if (isBoxChecked) {
      setTableDocumentsList((list) =>
        list.map((document, index) => ({
          ...document,
          asset: list[0].asset,
          quarter: list[0].quarter,
          financialTypes: index === 0 ? document.financialTypes : [],
        }))
      );
    }
  };

  const handleSingleQuarterModeChange = ({ isBoxChecked }: IOnCheckProps) => {
    setIsSingleQuarterMode(isBoxChecked);
    if (isBoxChecked) {
      setTableDocumentsList((list) =>
        list.map((document, index) => ({
          ...document,
          quarter: list[0].quarter,
          financialTypes: index === 0 ? document.financialTypes : [],
        }))
      );
    }
  };

  const handleDocumentAssetIdChange = (documentName: string) => (
    option: ISuggestedAssetOption
  ) => {
    const dealId = option.id;
    const isDealQuartersFetched = quartersByDeal[dealId];
    setTableDocumentsList((list) =>
      list.map((document) =>
        isSingleAssetIdMode || document.name === documentName
          ? {
              ...document,
              asset: {
                assetId: option.name,
                dealId,
              },
              quarter: INITIAL_QUARTER,
              financialTypes: [],
            }
          : document
      )
    );
    if (!isDealQuartersFetched) {
      dispatch(
        quartersActions.fetchQuarters({
          dealId,
          queryParams: { page_size: 50 },
        })
      );
    }
  };

  const handleDocumentQuarterChange = (documentName: string) => ({
    id,
    month,
    year,
  }: IDropdownOption) => {
    setTableDocumentsList((list) =>
      list.map((document) =>
        isSingleQuarterMode || document.name === documentName
          ? {
              ...document,
              quarter: {
                id,
                month,
                year,
              },
              financialTypes: [],
            }
          : document
      )
    );
  };

  const handleDocumentTypeCheck = (documentName: string) => (
    name: string,
    option: string
  ) => {
    setTableDocumentsList((list) =>
      list.map((document) => {
        const isSingleSelectType = ONLY_SINGLE_SELECT_FINANCIAL_TYPES.includes(
          option
        );
        const modifiedDocumentTypes = isSingleSelectType
          ? [option]
          : [...document.financialTypes, option].filter(
              (type) => !ONLY_SINGLE_SELECT_FINANCIAL_TYPES.includes(type)
            );
        const financialTypes =
          document.name === documentName
            ? modifiedDocumentTypes
            : document.financialTypes;
        return {
          ...document,
          financialTypes,
        };
      })
    );
  };

  const handleDocumentTypeUncheck = (documentName: string) => (
    name: string,
    option: string
  ) => {
    setTableDocumentsList((list) =>
      list.map((document) =>
        document.name === documentName
          ? {
              ...document,
              financialTypes: document.financialTypes.filter(
                (type) => type !== option
              ),
            }
          : document
      )
    );
  };

  const handleDocumentDelete = (documentName: string) => () => {
    setTableDocumentsList((list) =>
      list.filter((document) => document.name !== documentName)
    );
  };

  const handleModalClose = () => {
    dispatch(commonActions.setModal(null));
  };

  const handleApply = () => {
    const documents = tableDocumentsList.map(
      ({ asset, quarter, file, financialTypes }) => {
        const financialTypesIds = financialTypes.map((type) => {
          const financialTypeItem = financialTypesList.find(
            (typeItem) => typeItem.name === type
          );
          return financialTypeItem?.id || "";
        });
        return {
          dealId: asset.dealId,
          quarter: {
            month: quarter.month,
            year: quarter.year,
          },
          financialTypesIds,
          file,
        };
      }
    );

    dispatch(
      dealDocumentsActions.uploadDealDocuments({
        documents,
      })
    );
  };

  return (
    <div>
      {isMultiList ? (
        <DataEntryModeControls
          isSingleAssetIdMode={isSingleAssetIdMode}
          isSingleQuarterMode={isSingleQuarterMode}
          onSingleAssetIdModeChange={handleSingleAssetIdModeChange}
          onSingleQuarterModeChange={handleSingleQuarterModeChange}
        />
      ) : null}

      <UploadedDocumentsList
        list={tableDocumentsList}
        quartersByDeal={quartersByDeal}
        isDeleteEnabled={isMultiList}
        isSingleAssetIdMode={isSingleAssetIdMode}
        isSingleQuarterMode={isSingleQuarterMode}
        onAssetIdChange={handleDocumentAssetIdChange}
        onQuarterChange={handleDocumentQuarterChange}
        onTypeCheck={handleDocumentTypeCheck}
        onTypeUncheck={handleDocumentTypeUncheck}
        onDocumentDelete={handleDocumentDelete}
      />

      <UploadDocumentsModalActions
        isApplyDisabled={isApplyDisabled()}
        onCancel={handleModalClose}
        onApply={handleApply}
      />
    </div>
  );
};

export default UploadDocumentsModal;
