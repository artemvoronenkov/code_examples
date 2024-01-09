import { createSelector } from "@reduxjs/toolkit";
import pathOr from "ramda/es/pathOr";

import { selectCASlice } from "./sliceSelectors";

export const selectCAQuarters = createSelector(
  [selectCASlice],
  (state) => state.quarters
);

export const selectCAQuartersByDeal = createSelector(
  [selectCAQuarters],
  (state) => state.quartersByDeal
);

export const selectDealQuarters = (dealId: string) =>
  createSelector([selectCAQuartersByDeal], (quartersByDeal) =>
    pathOr([], [dealId], quartersByDeal)
  );
