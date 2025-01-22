import { combineReducers, CombinedState, AnyAction, Reducer } from 'redux'
import auth, { AuthState } from './slices/auth'
import base, { BaseState } from './slices/base'
import locale, { LocaleState } from './slices/locale/localeSlice'
import theme, { ThemeState } from './slices/theme/themeSlice'
import RtkQueryService from '@/services/RtkQueryService'
import dealerReducer, { DealerState } from '@/views/SuperAdmin/dealers/store';
import workflowReducer, { WorkflowState } from '@/views/Dealer/Workflow/store';
import inventoryReducer, { InventoryState } from '@/views/Dealer/DealerInventory/store';
import listReducer, { DealerListState } from '@/views/Dealer/DealerLists/Store/index';
import estimateReducer, { EstimateState } from '@/views/Dealer/Workflow/NewEstimate/store';

export type RootState = CombinedState<{
    auth: CombinedState<AuthState>
    base: CombinedState<BaseState>
    locale: LocaleState
    theme: ThemeState
    dealer: DealerState;  // Use 'dealer' directly here instead of 'data'
    workflow: WorkflowState;
    inventory: InventoryState; // Use 'dealer' directly here instead of 'data'
    allBrands: InventoryState; // Use 'dealer' directly here instead of 'data'
    list: DealerListState;
    estimate: EstimateState;
    [RtkQueryService.reducerPath]: any
}>

export interface AsyncReducers {
    [key: string]: Reducer<any, AnyAction>
}

const staticReducers = {
    auth,
    base,
    locale,
    theme,
    dealer: dealerReducer, // This is fine as is
    workflow: workflowReducer,
    inventory: inventoryReducer,
    list: listReducer,
    estimate: estimateReducer,
    [RtkQueryService.reducerPath]: RtkQueryService.reducer,
}

const rootReducer =
    (asyncReducers?: AsyncReducers) =>
        (state: any, action: AnyAction) => {
            const combinedReducer = combineReducers({
                ...staticReducers,
                ...asyncReducers,
            })
            return combinedReducer(state, action)
        }

export default rootReducer
