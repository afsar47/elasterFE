import { forwardRef } from 'react';
import { setDealerList, putDealer, setDrawerClose, Dealer } from './store/dealerSlice';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import DealerForm, { FormikRef, FormModel } from '@/views/dealers/VendorForm';
import { useAppDispatch, useAppSelector } from '@/store';

const DealerEditContent = forwardRef<FormikRef>((_, ref) => {
    const dispatch = useAppDispatch();

    // Assuming `selectedDealer` is the dealer you want to edit
    const dealer = useAppSelector((state) => state.dealer.selectedDealer);
    const dealerList = useAppSelector((state) => state.dealer.dealerList); // List of all dealers

    // Ensure the dealer is available
    if (!dealer) {
        return null; // or some fallback UI
    }

    const { id } = dealer;

    const onFormSubmit = (values: FormModel) => {
        if (!id) return;

        const { fullname, email, phoneNumber, status } = values;

        // Create a new updated dealer object
        const updatedDealer = { ...dealer, fullname, email, phoneNumber, status };

        // Clone the dealer list to avoid mutating the state directly
        let updatedDealerList = cloneDeep(dealerList);
        let editedDealer: Partial<Dealer> = {};

        // Update the dealer in the list
        updatedDealerList = updatedDealerList.map((elm) => {
            if (elm.id === id) {
                elm = { ...elm, ...updatedDealer };
                editedDealer = elm;
            }
            return elm;
        });

        // Dispatch the updated dealer if not empty
        if (!isEmpty(editedDealer)) {
            dispatch(putDealer(dealer.id, updatedDealer));
        }

        // Close the drawer and set the updated dealer list
        dispatch(setDrawerClose());
        dispatch(setDealerList(updatedDealerList)); // Use setDealerList instead of setTableData
    };

    return (
        <DealerForm
            ref={ref}
            dealer={dealer} // No need to cast here if dealer is guaranteed to be Dealer type
            onFormSubmit={onFormSubmit}
        />
    );
});

DealerEditContent.displayName = 'DealerEditContent';

export type { FormikRef };

export default DealerEditContent;
