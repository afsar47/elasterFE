import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import PasswordInput from '@/components/shared/PasswordInput'
import ActionLink from '@/components/shared/ActionLink'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import useAuth from '@/utils/hooks/useAuth'
import type { CommonProps } from '@/@types/common'
import { apiCreateDealer } from '@/views/SuperAdmin/dealers/DealerServices'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'

interface CreateDealerProps extends CommonProps {
    disableSubmit?: boolean
    viewAllDealerUrl?: string
}

type CreateDealerFormSchema = {
    fullname: string
    username: string
    email: string
    password: string
    phoneNumber: string
}

const validationSchema = Yup.object().shape({
    fullname: Yup.string().required('Please enter your full name'),
    username: Yup.string().required('Please enter your user name'),
    email: Yup.string().email('Invalid email').required('Please enter your email'),
    phoneNumber: Yup.string()
        .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits')
        .required('Please enter your phone number'),
    password: Yup.string().required('Please enter your password'),
    confirmPassword: Yup.string()
        .required('Please confirm your password')
        .oneOf([Yup.ref('password')], 'Your passwords do not match'),
})


const CreateDealer = (props: CreateDealerProps) => {
    const { disableSubmit = false, className, viewAllDealerUrl = '/view-all-dealers' } = props

    const [message, setMessage] = useTimeOutMessage()

    const onCreateDealer = async (
        values: CreateDealerFormSchema,
        setSubmitting: (isSubmitting: boolean) => void,
        resetForm: () => void
    ) => {
        const { fullname, username, email, password, phoneNumber } = values
        setSubmitting(true)

        try {
            const result = await apiCreateDealer({ fullname, username, email, password, phoneNumber })

            if (result?.status === 'failed') {
                setMessage(result.message)
                setSubmitting(false)
            } else {
                // API succeeded
                resetForm() // Clear the form
                toast.push(
                    <Notification title="Dealer Creation" type="success">
                        {`Dealer Created Successfully !'`}
                    </Notification>,
                    {
                        placement: 'top-center',
                    }
                )
                setSubmitting(false)
            }
        } catch (error) {
            // Handle any unexpected errors
            setMessage('An error occurred. Please try again.')
            setSubmitting(false)
        }
    }

    return (
        <div className={className}>
            {message && (
                <Alert showIcon className="mb-4" type="danger">
                    {message}
                </Alert>
            )}
            <Formik
                initialValues={{
                    fullname: '',
                    username: '',
                    email: '',
                    phoneNumber: '',
                    password: '',
                    confirmPassword: '',
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                    if (!disableSubmit) {
                        onCreateDealer(values, setSubmitting, resetForm)
                    } else {
                        setSubmitting(false)
                    }
                }}
            >
                {({ touched, errors, isSubmitting }) => (
                    <Form autoComplete="off" className='m-auto  w-1/2 '>
                        <h2 className='pb-2 text-center text-gray-500'>Create Dealers</h2>
                        <FormContainer>
                            <FormItem
                                label="Full Name"
                                invalid={errors.fullname && touched.fullname}
                                errorMessage={errors.fullname}
                            >
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="fullname"
                                    placeholder="Full Name"
                                    component={Input}
                                />
                            </FormItem>
                            <FormItem
                                label="User Name"
                                invalid={errors.username && touched.username}
                                errorMessage={errors.username}
                            >
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="username"
                                    placeholder="User Name"
                                    component={Input}
                                />
                            </FormItem>
                            <FormItem
                                label="Email"
                                invalid={errors.email && touched.email}
                                errorMessage={errors.email}
                            >
                                <Field
                                    type="email"
                                    autoComplete="off"
                                    name="email"
                                    placeholder="Email"
                                    component={Input}
                                />
                            </FormItem>
                            <FormItem
                                label="Phone Number"
                                invalid={errors.phoneNumber && touched.phoneNumber}
                                errorMessage={errors.phoneNumber}
                            >
                                <Field
                                    type="phoneNumber"
                                    autoComplete="off"
                                    name="phoneNumber"
                                    placeholder="Phone Number"
                                    component={Input}
                                />
                            </FormItem>
                            <FormItem
                                label="Password"
                                invalid={errors.password && touched.password}
                                errorMessage={errors.password}
                            >
                                <Field
                                    autoComplete="off"
                                    name="password"
                                    placeholder="Password"
                                    component={PasswordInput}
                                />
                            </FormItem>
                            <FormItem
                                label="Confirm Password"
                                invalid={
                                    errors.confirmPassword &&
                                    touched.confirmPassword
                                }
                                errorMessage={errors.confirmPassword}
                            >
                                <Field
                                    autoComplete="off"
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    component={PasswordInput}
                                />
                            </FormItem>
                            <Button
                                block
                                loading={isSubmitting}
                                variant="solid"
                                type="submit"
                            >
                                {isSubmitting
                                    ? 'Creating Dealer...'
                                    : 'Create Dealer'}
                            </Button>
                            <div className="mt-4 text-center">
                                <span>{`Want to view all dealers`} </span>
                                <ActionLink to={viewAllDealerUrl}>Click Here</ActionLink>
                            </div>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default CreateDealer
