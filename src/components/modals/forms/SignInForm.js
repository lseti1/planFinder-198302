import React from 'react';

const SignInForm = () => {
    return (
        <>
            <h1>Log In</h1>
            <input className='modalTextInputs' type='text' placeholder='Email Address' />
            <input className='modalTextInputs' type='text' placeholder='Password' />
            <button className="linkedButton">Forgot Password?</button>
            <button className='modalSubmitButton' type='submit'>Sign In</button>
            <button className='linkedButton'>Can't Access Account?</button>
            <p>Don't have an account?
              <button className="linkedButton">Sign Up Here</button>
            </p>
            <p className='disclaimer'>Please Note: For visual purposes, Sign In capabilities are off.</p>
        </>
    );
}

export default SignInForm;