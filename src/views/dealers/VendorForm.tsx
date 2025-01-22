import { forwardRef } from 'react';
import Tabs from '@/components/ui/Tabs';
import { FormContainer } from '@/components/ui/Form';
import { Form, Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import PersonalInfoForm from './PersonalInfoFrom';
import { updateDealer } from "@/views/SuperAdmin/dealers/DealerServices"; // Adjust the import based on your project structure
import { useAppDispatch } from '@/store';
import { setDrawerClose, setDrawerOpen } from '../SuperAdmin/dealers/store';

type BaseDealerInfo = {
    id?: number;  // Make id optional
    fullname: string;
    email: string;
    phoneNumber: string;
    status: boolean;
};

export type Dealer = BaseDealerInfo;

export interface FormModel extends Omit<Dealer, 'dealer'> {
    formSpecificField?: string;
}

export type FormikRef = FormikProps<Dealer>;

export type DealerProps = Partial<BaseDealerInfo> & { id?: number };

type DealerFormProps = {
    dealer: DealerProps;
    onFormSubmit: (values: FormModel) => void;
};

const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email Required'),
    fullname: Yup.string().required('User Name Required'),
    phoneNumber: Yup.string().matches(
        /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/,
        'Phone number is not valid'
    ),
    status: Yup.string().required('Status Required'), // Added status validation
});

const { TabNav, TabList, TabContent } = Tabs;

const DealerForm = forwardRef<FormikRef, DealerFormProps>((props, ref) => {
    const { dealer, onFormSubmit }: any = props;
    const dispatch = useAppDispatch()

    const handleSubmit = async (values: FormModel) => {
        try {
            if (dealer.id || dealer._id) {
                const updatedDealer = await updateDealer(dealer.id || dealer._id, values);
                onFormSubmit?.(updatedDealer);
                dispatch(setDrawerClose())
            } else {
                console.error('Dealer ID is missing');
            }
        } catch (error) {
            console.error('Error updating dealer:', error);
        }
    };

    return (
        <Formik
            innerRef={ref}
            initialValues={{
                id: dealer.id || 0,
                fullname: dealer.fullname || '', // Ensure this is populated
                email: dealer.email || '',
                phoneNumber: dealer.phoneNumber || '',
                status: dealer.status || true,
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ touched, errors }) => (
                <Form>
                    <FormContainer>
                        <Tabs defaultValue="personalInfo">
                            <TabList>
                                <TabNav value="personalInfo">Edit Dealer</TabNav>
                            </TabList>
                            <div className="p-6">
                                <TabContent value="personalInfo">
                                    <PersonalInfoForm 
                                        touched={touched}
                                        errors={errors}
                                    />
                                </TabContent>
                            </div>
                        </Tabs>
                    </FormContainer>
                </Form>
            )}
        </Formik>
    );
});

DealerForm.displayName = 'DealerForm';

export default DealerForm;
