import React from 'react';

const SignUpForm = () => {
    return (
        <>
            <h1>Set Up Your Account</h1>
            <input className='modalTextInputs' type='text' placeholder='Email Address' />
            <input className='modalTextInputs' type='text' placeholder='Password' />
            <input className='modalTextInputs' type='text' placeholder='Confirm Password' />
            <button className='modalSubmitButton' type='submit'>Sign Up</button>
            <p>Already have an account?
              <button className="linkedButton">
                Log In Here
              </button>
            </p>
            <p className='disclaimer'>Please Note: For visual purposes, Sign Up capabilities are off.</p>
        </>
    );
}

export default SignUpForm;