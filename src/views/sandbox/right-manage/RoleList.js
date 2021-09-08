import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, Tree } from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import axios from 'axios';

const { confirm } = Modal;

export default function RoleList() {
    // 表格数据
    const [dataSource, setdataSource] = useState([]);
    // Modal中tree数据
    const [rightList, setrightList] = useState([])
    // 当前选中的rights状态
    const [currentRights, setcurrentRights] = useState([])
    // 当前选中的id
    const [currentId, setcurrentId] = useState(0)
    // 控制modal的显示
    const [isModalVisible, setisModalVisible] = useState(false)

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id'
        },
        {
            title: '角色名称',
            dataIndex: 'roleName'
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    <Button danger shape="circle" icon={<DeleteOutlined />}
                        onClick={() => confirmMethod(item)}
                    />
                    <Button type="primary" shape="circle" icon={<EditOutlined />}
                        onClick={() => {
                            setisModalVisible(true)
                            setcurrentRights(item.rights)
                            setcurrentId(item.id)
                        }}
                    />
                </div>
            }
        }
    ];

    // 删除确认框
    const confirmMethod = (item) => {
        confirm({
            title: '你确定要删除吗?',
            icon: <ExclamationCircleOutlined />,
            // content: 'Some descriptions',
            onOk() {
                deleteMethod(item);
            },
            onCancel() {
                // console.log('Cancel');
            },
        });
    }

    // 删除角色
    const deleteMethod = (item) => {
        // 当前页面同步状态 + 后端同步

        setdataSource(dataSource.filter(data => data.id !== item.id));
        axios.delete(`/roles/${item.id}`)
    }

    useEffect(() => {
        axios.get('/roles').then(res => {
            setdataSource(res.data)
        })
    }, [])

    useEffect(() => {
        axios.get('/rights?_embed=children').then(res => {
            setrightList(res.data)
        })
    }, [])

    // 点击确认
    const handleOk = () => {
        // console.log(currentRights)
        setisModalVisible(false);
        // 同步dataSource
        setdataSource(dataSource.map(item => {
            if(item.id === currentId){
                return {
                    ...item,
                    rights: currentRights
                }
            }
            return item;
        }))
        // patch
        axios.patch(`/roles/${currentId}`,{
            rights: currentRights
        })
    }

    const handleCancel = () => {
        setisModalVisible(false)
    }

    // 监听勾选，并改变状态，因为是受控组件
    const onCheck = (checkedKeys, info) => {
        // console.log('onCheck', checkedKeys, info);
        setcurrentRights(checkedKeys.checked)
    };

    return (
        <div>
            <Table dataSource={dataSource} columns={columns}
                rowKey={(item) => item.id}
            ></Table>

            <Modal title="权限分配" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Tree
                    checkable
                    checkStrictly
                    checkedKeys={currentRights}
                    onCheck={onCheck}
                    treeData={rightList}
                />
            </Modal>
        </div>
    )
}
