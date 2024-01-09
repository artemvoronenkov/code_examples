import { Epic, ofType } from "redux-observable";
import { of, concat, merge, race, Observable } from "rxjs";
import { catchError, filter, map, mapTo, switchMap } from "rxjs/operators";

import { ApiServiceType } from "constants/api";
import { ModuleNames } from "constants/moduleNames";
import { RootReducerState } from "reducers";
import { selectIsAuthed } from "selectors/auth";
import { IMiddlewareDependencies } from "store";
import formatParamsString from "utils/format/formatParamsString";

import {
  FetchDealQuartersActionType,
  IFetchQuartersAPIResponse,
  quartersActions,
} from "./fetchQuartersReducer";

export const fetchDealQuartersEpic: Epic<
  FetchDealQuartersActionType,
  FetchDealQuartersActionType,
  RootReducerState,
  IMiddlewareDependencies
> = (action$, store$, { apiService, errorHandler }) =>
  action$.pipe(
    ofType(quartersActions.fetchQuarters.toString()),
    filter(() => selectIsAuthed(store$.value)),
    switchMap((action) => {
      const { dealId } = action.payload;
      const { page_size } = action.payload.queryParams;
      const formattedQueryParams = {
        page_size,
      };
      const formattedRequestString = formatParamsString(formattedQueryParams);

      const request$ = apiService({
        method: "GET",
        service: ApiServiceType.Analyze,
        headers: { "Content-Type": "application/json" },
        url: `${ModuleNames.FinancialAnalysis}/deals/${dealId}/quarters/${formattedRequestString}`,
        body: {},
      }) as Observable<IFetchQuartersAPIResponse>;

      const success$ = request$.pipe(
        map((data) =>
          quartersActions.fetchQuartersFulfilled({
            quarters: data.quarters,
            dealId,
          })
        ),
        catchError((error, source) =>
          errorHandler({
            error,
            source,
            action$,
            domain: quartersActions,
            call: "fetchQuarters",
            actionCache,
          })
        )
      );

      const filterByAction = ofType(
        quartersActions.fetchQuartersCancel.toString()
      );
      const cancel$ = merge(action$.pipe(filterByAction)).pipe(
        mapTo(quartersActions.fetchQuartersCancelled())
      );

      return concat(
        of(quartersActions.fetchQuartersPending()),
        race(success$, cancel$)
      );
    })
  );
