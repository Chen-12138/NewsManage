import React, { useEffect, useState } from 'react'
import { Layout, Menu } from 'antd';
import './index.css'
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import {connect} from 'react-redux'
const { Sider } = Layout;
const { SubMenu } = Menu

// 此处应该有一个图标映射表
/* const iconList = {

} */

function SideMenu(props) {

    const [menu, setMenu] = useState([]);

    const { role: { rights } } = JSON.parse(localStorage.getItem('token'))

    useEffect(() => {
        axios.get("/rights?_embed=children").then(res => {
            setMenu(res.data);
        })
    }, []);

    const checkPagePermisson = (item) => {
        return item.pagepermisson === 1 && rights.includes(item.key);
    }

    const renderMenu = (menuList) => {
        return menuList.map(item => {
            if (item.children?.length > 0 && checkPagePermisson(item)) {
                return <SubMenu key={item.key} icon={item.icon} title={item.title}
                >
                    {renderMenu(item.children)}
                </SubMenu>
            }

            return checkPagePermisson(item) && <Menu.Item key={item.key} icon={item.icon} onClick={() => {
                props.history.push(item.key)
            }}>{item.title}</Menu.Item>
        })
    }

    // console.log(props);
    // 默认选中项
    const selectKeys = [props.location.pathname];
    // 默认展开项
    const openKeys = ['/' + props.location.pathname.split('/')[1]];

    return (
        <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
            <div style={{ display: "flex", height: "100%", "flexDirection": 'column' }}>
                <div className="logo" >全球新闻发布管理系统</div>
                <div style={{ flex: 1, "overflow": 'auto' }}>
                    <Menu
                        theme="dark"
                        mode="inline"
                        selectedKeys={selectKeys}
                        defaultOpenKeys={openKeys}
                    >
                        {
                            renderMenu(menu)
                        }
                    </Menu>
                </div>
            </div>
        </Sider>
    )
}

const mapStateToProps = (state) => {
    return {
        isCollapsed: state.CollapsedReducer.isCollapsed
    }
}

/* const mapDispatchToProps = {

} */

export default connect(mapStateToProps)(withRouter(SideMenu));