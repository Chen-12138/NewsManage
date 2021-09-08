import React from 'react'
import { Layout, Dropdown, Menu, Avatar } from 'antd'
import { withRouter } from 'react-router-dom';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined
} from '@ant-design/icons';

import { connect } from 'react-redux'

const { Header } = Layout;

function TopHeader(props) {
    // console.log(props)
    // const [collapsed, setCollapsed] = useState(false);
    /* const changeCollapsed = () => {
        // 改变state的isCollapsed
        // console.log(props)
    } */

    const { role: { roleName }, username } = JSON.parse(localStorage.getItem('token'))

    const menu = (
        <Menu>
            <Menu.Item key="1">
                {roleName}
            </Menu.Item>
            <Menu.Item key="2" danger onClick={() => {
                localStorage.removeItem('token');
                props.history.replace('/login')
            }}>退出</Menu.Item>
        </Menu>
    );

    return (
        <Header className="site-layout-background" style={{ padding: '0 16px' }}>
            {
                props.isCollapsed ? <MenuUnfoldOutlined onClick={props.changeCollapsed} /> :
                    <MenuFoldOutlined onClick={props.changeCollapsed} />
            }

            <div style={{ float: 'right' }}>
                <span>欢迎<span style={{ color: '#1890ff' }}>{username}</span>回来</span>
                <Dropdown overlay={menu}>
                    <Avatar size="large" icon={<UserOutlined />} />
                </Dropdown>
            </div>
        </Header>
    )
}

/* 
    connect(
        // mapStateToProps
        // mapDispatchToProps
    )(被包装的组件)
*/

const mapStateToProps =  (state) => {
    return {
        isCollapsed: state.CollapsedReducer.isCollapsed
    }
}

const mapDispatchToProps = {
    changeCollapsed() {
        return {
            type: "change_collapsed"
            // payload:
        } // action
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TopHeader))