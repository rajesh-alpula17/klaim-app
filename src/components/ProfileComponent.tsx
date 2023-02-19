import React, { useState, useReducer } from 'react';
import { Button, Space, Avatar, Row, Col, Descriptions, Modal } from 'antd';
import { axiosInstance } from '../api/AxiosInstance';



const ProfileComponent = (props: any) => {

    const initialState = {
        profile: {},
        author: {},
        quote: {}
    };

    function reducer(state: any, action: any) {
        switch (action.type) {
            case "profile": {
                return {
                    ...state,
                    profile: action.profile
                };
            }
            case "author": {
                return {
                    ...state,
                    author: action.author
                };
            }
            case "quote": {
                return {
                    ...state,
                    quote: action.quote
                };
            }
            default:
                return state;
        }
    }

    const [state, dispatch] = useReducer(reducer, initialState);

    const [open, setOpen] = useState(false);
    const [profileName, setProfileName] = useState('');
    const [author, setAuthor] = useState('');
    const [quote, setQuote] = useState('');

    const handleCancel = () => {
        setOpen(false);
    };

    React.useEffect(() => {
        axiosInstance.get('/profile?token=' + props.token).then((response) => {
            let res = response.data;
            dispatch({ type: "profile", profile: res?.data });
            let profile = res?.data;
            setProfileName(profile?.fullname);
            invokeAuthorAndQuotesApi();
        });

    }, []);

    function invokeAuthorAndQuotesApi() {
        axiosInstance.get('/author?token=' + props.token).then((response) => {
            let res = response.data;
            dispatch({ type: "author", author: res?.data });
            setAuthor(res?.data?.name);
            axiosInstance.get('/quote?token=' + props.token + '&authorId=' + res?.data?.authorId).then((response) => {
                let resQuote = response.data;
                dispatch({ type: "quote", author: resQuote });
                setQuote(resQuote?.data.quote);
                setOpen(false);
            });
        });

    }

    function updateAuthor() {
        setOpen(true);
        invokeAuthorAndQuotesApi();

    }

    return (
        <>
            <Row gutter={16}>
                <Space>
                    <Col span={8}><Avatar size={100} src={'../../assets/img/react.png'}  ></Avatar></Col>
                    <Row gutter={[8, 8]}>
                        <Col span={24}><h1>Welcome, {profileName} !</h1></Col>
                        <Col span={24}>
                            <Button type="primary" onClick={updateAuthor}>Update</Button>
                        </Col>
                    </Row>
                </Space>
            </Row>
            <Space>                
                <Descriptions title="" column={1} style={{ marginTop: '30px' }}>
                    <Descriptions.Item label="Author">{author}</Descriptions.Item>
                    <Descriptions.Item label="Quote">{quote}</Descriptions.Item>
                </Descriptions>
            </Space>

            <Modal
                open={open}
                title="Requesting the quote"
                footer={[
                    <Button key="Cancel" type="primary" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>,
                ]}
                closable={false}
            >
                <Row>
                    <p>Step 1: Requesting author.. { }</p>
                    <p>Step 2: Requesting quote.. { }</p>
                </Row>

            </Modal>




        </>

    )

}


export default ProfileComponent;