import React, { useState } from 'react'
import { message, Form, Button, Input } from 'antd'
import styles from './Login.module.css'
import axios from 'axios';

export default function UserLogin(props) {

    // console.log(styles);

    const [isLogin, setisLogin] = useState(true);

    // 处理登录
    const handleLogin = (values) => {
        // console.log(values)

        axios.get(`/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`).then(
            res => {
                // console.log(res.data);
                if (res.data.length === 0) {
                    message.error('用户名或密码错误')
                } else {
                    localStorage.setItem('token', JSON.stringify(res.data[0]));
                    props.history.push('/');
                }
            }
        )
    }

    // 处理注册
    const handleRegister = (values) => {
        console.log(values);

        axios.post('/users', {
            username: values.username,
            password: values.password,
            roleState: true,
            default: false,
            region: '亚洲',
            roleId: 3
        }).then(res => {
            localStorage.setItem('token', JSON.stringify(res.data[0]));
            props.history.push('/');
        })
    }

    return (
        <div style={{ display: "flex", justifyContent: 'center', background: 'rgba(114, 156, 255, 0.5)', height: "100%", overflow: 'hidden' }}>
            <div style={{position: 'absolute',fontSize: '16px',top: '20px'}}>PS：进入后台管理系统可以发布文章，但需要审批，如需体验管理员功能，请加 VX:Lucky_Chen_12138</div>
            <Button type="primary" style={{marginTop: "360px"}} onClick={
                () => {
                    props.history.replace('/news');
                }
            }>游客通道</Button>
            <div className={styles['adminLogin']}>
                {/* <div className={`${styles['container']} ${isLogin?'' : styles['rightpanelactive']}`} id="container"> */}
                <div className={isLogin ? `${styles['container']}` : `${styles['container']} ${styles['rightpanelactive']}`} id="container">
                    <div className={`${styles['form-container']} ${styles['sign-up-container']}`}>
                        <Form onFinish={handleRegister}>
                            <h2>用户注册</h2>
                            <Form.Item
                                name="username"
                                style={{ width: '100%' }}
                                rules={[{ required: true, message: 'Please input your Username!' }]}
                            >
                                <Input type="text" placeholder="用户名" />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                style={{ width: '100%' }}
                                rules={[{ required: true, message: 'Please input your Password!' }]}
                            >
                                <Input type="password" placeholder="密码" />
                            </Form.Item>
                            <Button className={styles['button']} htmlType="submit" >注册</Button>
                        </Form>
                    </div>
                    <div className={`${styles['form-container']} ${styles['sign-in-container']}`}>
                        <Form onFinish={handleLogin}>
                            <h2>
                                <i className="iconfont icon-denglu"></i> 文章管理系统登陆:
                            </h2>
                            <Form.Item
                                name="username"
                                style={{ width: '100%' }}
                                rules={[{ required: true, message: 'Please input your Username!' }]}
                            >
                                <Input type="text" placeholder="用户名" />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                style={{ width: '100%' }}
                                rules={[{ required: true, message: 'Please input your Password!' }]}
                            >
                                <Input type="password" placeholder="密码" />
                            </Form.Item>
                            <Button className={styles['button']} htmlType="submit" >登录</Button>
                        </Form>
                    </div>
                    <div className={styles['overlay-container']}>
                        <div className={styles['overlay']}>
                            <div className={`${styles['overlay-panel']} ${styles['overlay-left']}`}>
                                <h2>已有帐号？</h2>
                                <p>亲爱的快快点我去进行登陆吧。</p>
                                <button className={`${styles['ghost']} ${styles['button']}`} id="signIn" onClick={() => {
                                    setisLogin(true);
                                }}>登陆</button>
                            </div>
                            <div className={`${styles['overlay-panel']} ${styles['overlay-right']}`}>
                                <h2>没有帐号？</h2>
                                <p>点击注册去注册一个属于你的账号吧。</p>
                                <button className={`${styles['button']} ${styles['ghost']}`} id="signUp" onClick={() => {
                                    setisLogin(false);
                                }}>注册</button>
                            </div>
                        </div>
                    </div >
                </div >
            </div >
        </div >
    )
}
