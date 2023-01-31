import { GoogleLogin } from 'react-google-login';
import { gapi } from 'gapi-script';
import React from 'react';

const onSuccess = (res, updateUserData) => {
    updateUserData(res.profileObj)
}

const onFailure = (err) => {
    console.log('failed:', err);
}

export const setupLogin = () => {
    const initClient = () => {
        gapi.client.init({
            clientId: this.clientId,
            scope: ''
        });
    };
    gapi.load('client:auth2', initClient);
}

export const Login = (props) => {

    const clientId = '832026479166-3i3nl2i2nngrpjer3rjoi85a18v4ufc0.apps.googleusercontent.com';

    return (
        <React.Fragment>
            <GoogleLogin
                clientId={clientId}
                buttonText="Sign in with Google"
                onSuccess={(res) => onSuccess(res, props.updateUserData)}
                onFailure={onFailure}
                cookiePolicy={'single_host_origin'}
                isSignedIn={true}
            />
        </React.Fragment>
    );
}