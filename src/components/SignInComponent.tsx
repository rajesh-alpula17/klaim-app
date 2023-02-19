import React, { useState } from 'react';
import { axiosInstance } from '../api/AxiosInstance';
import { Button, Alert, Form, Input, Space, Typography } from 'antd';


const SignInComponent = (props: any) => {

    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('Error !!!');

    const onFinish = (values: any) => {
        axiosInstance.post('/login', {
            email: values.email,
            password: values.password
        })
            .then(function (response) {
                console.log(response);
                let res = response.data;
                props.signIn(res?.data?.token)
            })
            .catch(function (error) {
                console.log(error);
                setErrorMsg(error?.response?.data?.data?.message)
                setError(true);
            });
    };

    return (
        <Space>
            
            <Form
                name="basic"

                style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}                
                autoComplete="off"
                layout="vertical"
            >
                {error && <Alert message={errorMsg} type="error" />}
                <Form.Item
                    label="Email address"
                    name="email"
                    rules={[{ required: true, message: 'Please enter your email address!' }]}
                >
                    <Input placeholder="Enter email" />
                </Form.Item>
                <Typography>We'll never share your email with any one else</Typography>


                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please enter your password!' }]}
                >
                    <Input.Password placeholder="Enter password" />
                </Form.Item>

                <Form.Item wrapperCol={{ span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Space>
    )
};

export default SignInComponent;