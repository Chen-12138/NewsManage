import React, { useEffect, useState, useRef } from 'react'
import { PageHeader, Steps, Button, Form, Input, Select, message, notification } from 'antd'
import styles from './News.module.css';
import axios from 'axios';

import NewsEditor from '../../../components/news-manage/NewsEditor';

const { Step } = Steps
const { Option } = Select

export default function NewsUpdate(props) {

    const [current, setCurrent] = useState(0);

    const [categoryList, setcategoryList] = useState([])

    const [formInfo, setformInfo] = useState({})

    const [content, setcontent] = useState('')

    // const User = JSON.parse(localStorage.getItem('token'));

    const next = () => {
        if (current === 0) {
            NewsForm.current.validateFields().then(res => {
                setformInfo(res)
                setCurrent(current + 1);
            }).catch(err => {
                console.log(err);
            })
        } else {
            if (content === '' || content.trim() === '<p></p>') {
                message.error("新闻内容不能为空")
            } else {
                setCurrent(current + 1);
            }
        }
    }

    const prev = () => {
        setCurrent(current - 1);
    }

    const layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
    };

    useEffect(() => {
        axios.get('/categories').then(res => {
            setcategoryList(res.data)
        })
    }, [])

    const NewsForm = useRef(null);

    // 保存到草稿箱
    const handleSave = (auditState) => {
        axios.patch(`/news/${props.match.params.id}`, {
            ...formInfo,
            "content": content,
            "auditState": auditState,
        }).then(res => {
            props.history.push(auditState === 0 ? '/news-manage/draft' : '/audit-manage/list');
            notification.info({
                message: `通知`,
                description:
                    `您可以到${auditState===0?'草稿箱' : '审核列表'}中查看您的新闻`,
                placement: 'bottomRight',
            });
        })
    }

    useEffect(() => {
        // console.log(props.match.params.id);
        axios.get(`/news/${props.match.params.id}?_expand=category&_expand=role`).then(res => {
            // setnewsInfo(res.data)

            let {title, categoryId, content} = res.data;
            NewsForm.current.setFieldsValue({
                title,
                categoryId
            })

            setcontent(content)

        })
    }, [props.match.params.id]);

    return (
        <div>
            <PageHeader
                className="site-page-header"
                title="更新新闻"
                onBack={() => props.history.goBack()}
                subTitle="This is a subtitle"
            />

            <Steps current={current}>
                <Step title="基本信息" description="新闻标题，新闻分类" />
                <Step title="新闻内容" description="新闻主体内容" />
                <Step title="新闻提交" description="保存草稿或者提交审核" />
            </Steps>

            <div style={{ marginTop: '50px' }}>
                <div className={current === 0 ? '' : styles.active}>
                    <Form
                        name="basic"
                        {...layout}
                        ref={NewsForm}
                    >
                        <Form.Item
                            label="新闻标题"
                            name="title"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your username!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="新闻分类"
                            name="categoryId"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                            ]}
                        >
                            <Select>
                                {
                                    categoryList.map(item =>
                                        <Option value={item.id} key={item.id}>{item.title}</Option>
                                    )
                                }
                            </Select>
                        </Form.Item>
                    </Form>
                </div>
                <div className={current === 1 ? '' : styles.active}>
                    <NewsEditor getContent={(val) => {
                        setcontent(val);
                    }} content={content}></NewsEditor>
                </div>
                <div className={current === 2 ? '' : styles.active}>3333</div>
            </div>


            <div style={{ marginTop: '50px' }}>
                {
                    current === 2 && <span>
                        <Button type="primary" onClick={() => handleSave(0)}>保存草稿箱</Button>
                        <Button danger onClick={() => handleSave(1)}>提交审核</Button>
                    </span>
                }
                {
                    current < 2 && <Button type="primary" onClick={next}>下一步</Button>
                }
                {
                    current > 0 && <Button onClick={prev}>上一步</Button>
                }
            </div>
        </div>
    )
}
