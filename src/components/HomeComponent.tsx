import React, { useState, useReducer } from 'react';
import { Button, Space, Row, Popconfirm, Typography, message } from 'antd';
import SignInComponent from './SignInComponent';
import ProfileComponent from './ProfileComponent';
import { axiosInstance } from '../api/AxiosInstance';

type Content = "aboutus" | "profile" | "signin" | "signout";

const initialState = {
    isLoggedIn: false,
    token: ""
};

function reducer(state: any, action: any) {
    switch (action.type) {
        case "login": {
            return {
                ...state,
                isLoggedIn: true,
                token: action.token
            };
        }
        case "logout": {
            return {
                ...state,
                isLoggedIn: false,
                token: ''
            };
        }
        default:
            return state;
    }
}

function HomeComponent() {

    const [content, setContent] = useState<Content>("aboutus");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [companyInfo, setCompanyInfo] = useState('');

    const [openPopConfirm, setOpenPopConfirm] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const [state, dispatch] = useReducer(reducer, initialState);

    const [messageApi, contextHolder] = message.useMessage();


    function handleSignOut() {
        setConfirmLoading(true);
        axiosInstance.delete('/logout?token=' + state.token).then((response) => {
            setConfirmLoading(false);
            logoutsuccess();
            let res = response.data;
            dispatch({ type: "logout" });
            setOpenPopConfirm(false)
            setContent('aboutus');
        });

    }

    function logoutsuccess() {
        messageApi.open({
            type: 'success',
            content: 'Logged out successfully!!!',
        });
    };

    function handleSignIn(token: string) {
        dispatch({ type: "login", token: token });
        setContent('profile');

    }

    function onAboutUsClick() {
        document.title = 'About Us'
        setContent('aboutus')
    }

    function onSignInClick() {
        document.title = 'Sign In'
        setContent('signin')
    }

    function onProfileClick() {
        document.title = 'Profile'
        setContent('profile')
    }

    React.useEffect(() => {
        axiosInstance.get('/info').then((response) => {
            let res = response.data;
            setCompanyInfo(res.data.info);
        });

    }, []);

    return (
        <>
            {contextHolder}
            <Row style={{ marginBottom: '30px' }}>
                <Space>
                    <Button onClick={onAboutUsClick}>About Us</Button>
                    {!state.isLoggedIn && <Button onClick={onSignInClick}>Sign In</Button>}
                    {state.isLoggedIn && <Button onClick={onProfileClick}>Profile</Button>}
                    {state.isLoggedIn && <Popconfirm
                        title="Sign Out"
                        description="Are you sure you want to Sign out?"
                        open={openPopConfirm}
                        onConfirm={handleSignOut}
                        okButtonProps={{ loading: confirmLoading }}
                        onCancel={() => setOpenPopConfirm(false)}
                    >
                        <Button onClick={() => setOpenPopConfirm(true)}>
                            Sign Out
                        </Button>
                    </Popconfirm>}

                </Space>
            </Row>
            <Row>
                <Space >
                    {content === "aboutus" && <p>{companyInfo}</p>}
                    {content === "signin" && <SignInComponent signIn={handleSignIn} />}
                    {content === "profile" && <ProfileComponent token={state.token} />}
                </Space>
            </Row>


        </>
    )
}

export default HomeComponent;