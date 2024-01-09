import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import identity from "ramda/es/identity";

import { OriginationStatusEnum } from "constants/comparison";
import { AsyncDataStates } from "constants/states";
import { IPaginationDTO } from "interfaces/api/request";

type ModelType = "financial_analysis" | "bi";

export interface IFinancialType {
  client_id: string;
  id: string;
  name: string;
  is_financial_statement: boolean;
}

export interface IFinancialAnalysisDocument {
  id: string;
  aggregation_id: string;
  parent_id?: string;
  name: string;
  extension: string;
  file_name: string;
  file_hash: string;
  status_id: OriginationStatusEnum;
  source_path: string;
  converted_path?: string;
  ocred_path?: string;
  ocred_cache_path?: string;
  extracted_path?: string;
  model_type: ModelType;
  created_by: string;
  created_at: string;
  reprocessed_at?: string;
  updated_at: string;
  deleted_at?: string;
  folder_id: string;
  comparison_id?: string;
  original_id?: string;
  financial_types?: IFinancialType[];
}

export interface IFinancialAnalysisQuarter {
  id: string;
  deal_id: string;
  month: string;
  year: string;
  status_id: string;
  docs: IFinancialAnalysisDocument[];
}

export interface IFetchQuartersAPIResponse extends IPaginationDTO {
  quarters: IFinancialAnalysisQuarter[];
}

export type FetchQuartersActionType = PayloadAction<{
  dealId: string;
  queryParams: {
    page_size: number;
  };
}>;

type FetchDealQuartersFulfilledActionType = PayloadAction<{
  dealId: string;
  quarters: IFinancialAnalysisQuarter[];
}>;

export type QuartersByDealType = Record<string, IFinancialAnalysisQuarter[]>;

const initialQuartersState = {
  status: AsyncDataStates.Idle,
  quartersByDeal: {} as QuartersByDealType,
};

const quartersSlice = createSlice({
  name: "financial_analysis/quarters",
  initialState: initialQuartersState,
  reducers: {
    fetchQuarters: (state, action: FetchQuartersActionType) => state,
    fetchQuartersCancel: identity,
    fetchQuartersPending: (state) => ({
      ...state,
      status: AsyncDataStates.Pending,
    }),
    fetchQuartersCancelled: (state) => ({
      ...state,
      status: AsyncDataStates.Cancelled,
    }),
    fetchQuartersFulfilled: (
      state,
      action: FetchDealQuartersFulfilledActionType
    ) => ({
      ...state,
      status: AsyncDataStates.Fulfilled,
      quartersByDeal: {
        ...state.quartersByDeal,
        [action.payload.dealId]: action.payload.quarters,
      },
    }),
    fetchQuartersRejected: (state) => ({
      ...state,
      quartersByDeal: {},
      status: AsyncDataStates.Failed,
    }),
    fetchQuartersFailed: (state) => ({
      ...state,
      quartersByDeal: {},
      status: AsyncDataStates.Failed,
    }),
    fetchQuartersReset: (state) => ({
      ...state,
      quartersByDeal: {},
      status: AsyncDataStates.Idle,
    }),
  },
});

export const quartersActions = quartersSlice.actions;
export const quartersReducer = quartersSlice.reducer;
