import React, { useState, useEffect } from 'react'
import { Table, Tag, Button, Modal, Popover, Switch } from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import axios from 'axios'

const { confirm } = Modal;

export default function RightList() {
    const [dataSource, setdataSource] = useState([])

    useEffect(() => {
        axios.get('/rights?_embed=children').then(res => {
            const list = res.data;
            list.forEach(item => {
                if (item.children.length === 0) {
                    item.children = "";
                }
            })
            setdataSource(list);
        })
    }, [])

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id'
        },
        {
            title: '权限名称',
            dataIndex: 'title'
        },
        {
            title: '权限路径',
            dataIndex: 'key',
            render: (key) => {
                return <Tag color="orange">{key}</Tag>
            }
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    <Button danger shape="circle" icon={<DeleteOutlined />}
                        onClick={() => confirmMethod(item)} />
                    <Popover content={<div style={{ textAlign: 'center' }}>
                        <Switch checked={item.pagepermisson} onChange={
                            () => switchMethod(item)
                        }></Switch>
                    </div>} title="页面配置项" trigger={item.pagepermisson === undefined ? '' : 'click'}>
                        <Button type="primary" shape="circle" icon={<EditOutlined />}
                            disabled={item.pagepermisson === undefined}
                        />
                    </Popover>
                </div>
            }
        }
    ];

    const switchMethod = (item) => {
        // 擦边球，为什么这儿直接修改item会影响到dataSource呢，可能这里其实是引用吧
        item.pagepermisson = item.pagepermisson === 1 ? 0 : 1;
        // 重新设置dataSource可以触发更新
        setdataSource([...dataSource]);
        if (item.grade === 1) {
            axios.patch(`/rights/${item.id}`, {
                pagepermisson: item.pagepermisson
            })
        } else {
            axios.patch(`/children/${item.id}`, {
                pagepermisson: item.pagepermisson
            })
        }
    }

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

    const deleteMethod = (item) => {
        // 当前页面同步状态 + 后端同步

        if (item.grade === 1) {
            setdataSource(dataSource.filter(data => data.id !== item.id));
            axios.delete(`/rights/${item.id}`)
        } else {
            let list = dataSource.filter(data => data.id === item.rightId);
            list[0].children = list[0].children.filter(data => data.id !== item.id);
            // console.log(dataSource);
            setdataSource([...dataSource]);
            axios.delete(`/children/${item.id}`)

        }
    }

    return (
        <div>
            <Table dataSource={dataSource} columns={columns}
                pagination={{
                    pageSize: 5
                }}
            />
        </div>
    )
}
