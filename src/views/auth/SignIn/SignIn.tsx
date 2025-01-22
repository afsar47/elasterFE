import Side from '@/components/layouts/AuthLayout/Side'
import SignInForm from './SignInForm'

const SignIn2 = () => {
    return (
        <div className="h-screen ">
        <Side
        content={
            <>
                <h3 className="mb-1">Welcome back!</h3>
                <p>Please enter your credentials to sign in!</p>
            </>
        }
    >
        <SignInForm
            disableSubmit={false}
            signUpUrl="/auth/sign-up-side"
            forgotPasswordUrl="/auth/forgot-password-side"
        />
    </Side>
    </div>  
    )
}

export default SignIn2
