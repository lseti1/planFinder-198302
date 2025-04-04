import React from 'react';
import SignInForm from './forms/SignInForm';
import SignUpForm from './forms/SignUpForm';

const DynamicModalContent = ({type}) => {
    switch (type) {
        case 'signIn': 
            return <SignInForm/>;
        case 'signUp':
            return <SignUpForm/>;
        default:
            return <div>No Modal Available.</div>;
    }
};

export default DynamicModalContent;