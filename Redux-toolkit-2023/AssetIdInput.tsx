import React, { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import ArrowDownIcon from "components/common/icons/ArrowDownIcon";
import Popover from "components/common/Popover";
import LoadMoreAutocomplete from "components/common/SearchAutocomplete/LoadMoreAutocomplete";
import { suggestedDealsActions } from "reducers/credit_analysis/suggestedDealsReducer";
import { selectAllCASuggestedDealsIsFetched } from "selectors/creditAnalysisSelectors/suggestedDealsSelectors";
import { semiboldCaption, textInput } from "styles/_mixins";
import { colors } from "styles/colors";
import { useIsSuggestedDealsLoading } from "utils/hooks/loadingHooks";
import { useEffectExceptFirstRender } from "utils/hooks/mountHooks";
import useDebouncedValue from "utils/hooks/useDebouncedValue";

import { IDocumentAsset } from "./UploadDocumentsModal";
import { ISuggestedAssetOption } from "./UploadedDocumentsList";

const InputContainer = styled.div<{ isActive: boolean; disabled: boolean }>`
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 8px 6px 12px;
  border-radius: 2px;
  transition: border-color 0.3s ease 0s;
  box-sizing: border-box;
  border: solid 1px
    ${({ isActive }) => (isActive ? colors.blue : colors.athensGray)};
  background: ${({ disabled }) => (disabled ? colors.gray3 : colors.gray2)};
  cursor: ${({ disabled }) => (disabled ? "initial" : "pointer")};
`;

const InputContent = styled.span`
  ${textInput()}
  line-height: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ArrowContainer = styled.div<{ isActive: boolean }>`
  transform: ${({ isActive }) =>
    isActive ? "rotate(180deg)" : "rotate(0deg)"};
  transform-origin: 50% 50%;
  transition: transform 0.4s ease 0s;
`;

const AssetContainer = styled.div<{ selected: boolean }>`
  display: flex;
  padding: 4px 16px;
  cursor: pointer;
  background: ${({ selected }) => (selected ? colors.gray6 : "initial")};
  &:hover {
    background: ${colors.gray5};
  }
`;

const AssetContent = styled.div`
  width: 100%;
`;

const AssetTitle = styled.span`
  ${semiboldCaption()}
`;

const INITIAL_PAGE = 1;

interface IOwnProps {
  value: IDocumentAsset;
  options: ISuggestedAssetOption[];
  disabled: boolean;
  onChange: (option: ISuggestedAssetOption) => void;
}

const AssetIdInput = ({ value, options, disabled, onChange }: IOwnProps) => {
  const dispatch = useDispatch();

  const isAllSuggestedDealsFetched = useSelector(
    selectAllCASuggestedDealsIsFetched
  );

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [autocompleteValue, setAutocompleteValue] = useState("");
  const [page, setPage] = useState(INITIAL_PAGE);

  const debouncedAutocompleteValue = useDebouncedValue(autocompleteValue, 500);
  const isDealsLoading = useIsSuggestedDealsLoading();

  const refetchDeals = (
    requestPage = INITIAL_PAGE,
    withAccumulation = false
  ) => {
    const queryParams = {
      page: requestPage,
      assetId: autocompleteValue ? autocompleteValue : undefined,
    };
    dispatch(
      suggestedDealsActions.fetchSuggestedDeals({
        queryParams,
        withAccumulation,
      })
    );
  };

  useEffectExceptFirstRender(() => {
    refetchDeals();
  }, [debouncedAutocompleteValue]);

  const handleInputClick = () => {
    if (!disabled) {
      setIsMenuOpen(true);
      refetchDeals();
    }
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
    setAutocompleteValue("");
  };

  const handleAutocompleteChange = (event, searchValue: string) => {
    setAutocompleteValue(searchValue);
    setPage(INITIAL_PAGE);
  };

  const handleAutocompleteLoadMore = () => {
    if (!isAllSuggestedDealsFetched) {
      const nextPage = page + 1;
      setPage(nextPage);
      refetchDeals(nextPage, true);
    }
  };

  const handleAssetClick = (option: ISuggestedAssetOption) => () => {
    handleCloseMenu();
    onChange(option);
  };

  return (
    <div>
      <InputContainer
        isActive={isMenuOpen}
        disabled={disabled}
        onClick={handleInputClick}
      >
        <InputContent>{value.assetId}</InputContent>
        <ArrowContainer isActive={isMenuOpen}>
          <ArrowDownIcon color={colors.darkGray2} />
        </ArrowContainer>
      </InputContainer>
      {isMenuOpen ? (
        <Popover
          content={
            <LoadMoreAutocomplete
              inputPlaceholder="Search Asset ID"
              value={autocompleteValue}
              items={options}
              isLoading={isDealsLoading}
              onChange={handleAutocompleteChange}
              onLoadMore={handleAutocompleteLoadMore}
              renderItem={(option: ISuggestedAssetOption) => (
                <AssetContainer
                  key={option.id}
                  selected={option.id === value.dealId}
                >
                  <AssetContent onClick={handleAssetClick(option)}>
                    <AssetTitle>{option.name}</AssetTitle>
                  </AssetContent>
                </AssetContainer>
              )}
            />
          }
          padding={0}
          className="assetIdInputPopover"
          position="right"
          align="start"
          isVisible={true}
          isCloseOutsideActive={true}
          onClose={handleCloseMenu}
        />
      ) : null}
    </div>
  );
};

export default AssetIdInput;
