import React, { forwardRef, useState, useEffect } from 'react'
import { Form, Input, Select } from 'antd'

const { Option } = Select;

const UserForm = forwardRef((props, ref) => {
    const [isDisalbed, setisDisalbed] = useState(false)

    useEffect(() => {
        setisDisalbed(props.isUpdateDisabled)
    }, [props.isUpdateDisabled])

    const { roleId, region } = JSON.parse(localStorage.getItem('token'))
    const roleObj = {
        "1": 'superadmin',
        "2": 'admin',
        "3": 'editor'
    }
    // 选择区域时判断权限
    const checkRegionDisabled = (item) => {
        if(props.isUpdate) {
            if(roleObj[roleId] === 'superadmin') {
                return false;
            } else {
                return true;
            }
        } else {
            if(roleObj[roleId] === 'superadmin') {
                return false;
            } else {
                // 等于当前region就为false就可以选
                return item.value !== region;
            }
        }
    }

    // 选择角色时判断权限
    const checkRoleDisabled = (item) => {
        if(props.isUpdate) {
            if(roleObj[roleId] === 'superadmin') {
                return false;
            } else {
                return true;
            }
        } else {
            if(roleObj[roleId] === 'superadmin') {
                return false;
            } else {
                return roleObj[item.id] !== 'editor';
            }
        }
    }

    return (
        <Form
            ref={ref}
            layout="vertical"
        >
            <Form.Item
                name="username"
                label="用户名"
                rules={[{ required: true, message: 'Please input the title of collection!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="password"
                label="密码"
                rules={[{ required: true, message: 'Please input the title of collection!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="region"
                label="区域"
                rules={isDisalbed ? [] :
                    [{ required: true, message: 'Please input the title of collection!' }]
                }
            >
                <Select disabled={isDisalbed}>
                    {
                        props.regionList.map(item =>
                            <Option value={item.value} key={item.id}
                            disabled={checkRegionDisabled(item)}>
                                {item.title}
                            </Option>
                        )
                    }
                </Select>
            </Form.Item>
            <Form.Item
                name="roleId"
                label="角色"
                rules={
                    [{ required: true, message: 'Please input the title of collection!' }]
                }
            >
                <Select onChange={(value) => {
                    if (value === 1) {
                        setisDisalbed(true);
                        ref.current.setFieldsValue({
                            region: ''
                        })
                    } else {
                        setisDisalbed(false);
                    }
                }}>
                    {
                        props.roleList.map(item =>
                            <Option value={item.id} key={item.id}
                                disabled={checkRoleDisabled(item)}
                            >
                                {item.roleName}
                            </Option>
                        )
                    }
                </Select>
            </Form.Item>
        </Form>
    )
})

export default UserForm