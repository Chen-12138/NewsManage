import React, { useEffect, useState, useRef } from 'react'
import { Card, Col, Row, List, Avatar, Drawer } from 'antd';
import { PieChartOutlined } from '@ant-design/icons';
import axios from 'axios';
import * as echarts from 'echarts';
import _ from 'lodash'

const { Meta } = Card;

export default function Home() {

    const [viewList, setviewList] = useState([]);
    const [starList, setstarList] = useState([]);
    const [allList, setallList] = useState([])
    // 控制drawer显示
    const [visible, setvisible] = useState(false)

    // 记录是否初始化过
    const [pieChart, setpieChart] = useState(null)

    // 柱状图
    const barRef = useRef()
    // 饼状图
    const pieRef = useRef()

    useEffect(() => {
        axios.get(`/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6`).then(res => {
            setviewList(res.data);
        })
    }, [])

    useEffect(() => {
        axios.get(`/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6`).then(res => {
            setstarList(res.data);
        })
    }, [])

    const { username, region, role: { roleName } } = JSON.parse(localStorage.getItem('token'))

    // 获取全部数据并且初始化柱状图
    useEffect(() => {

        axios.get(`/news?publishState=2&_expand=category`).then(res => {
            // console.log(res.data)
            setallList(res.data)
            renderBarView(_.groupBy(res.data, item => item.category.title))
        })

        return () => {
            window.onresize = null;
        }
    }, [])

    // 初始化柱状图
    const renderBarView = (obj) => {
        var myChart = echarts.init(barRef.current);

        // specify chart configuration item and data
        var option = {
            title: {
                text: '新闻分类图示'
            },
            tooltip: {},
            legend: {
                data: ['数量']
            },
            xAxis: {
                data: Object.keys(obj),
                axisLabel: {
                    rotate: '45',
                    interval: 0
                }
            },
            yAxis: {
                minInterval: 1
            },
            series: [{
                name: '数量',
                type: 'bar',
                data: Object.values(obj).map(item => item.length)
            }]
        };

        // use configuration item and data specified to show chart
        myChart.setOption(option);

        window.onresize = () => {
            myChart.resize()
        }
    }

    // 初始化饼状图
    const renderPieView = () => {
        // 数据处理工作

        var currentList = allList.filter(item => item.author === username);
        var groupObj = _.groupBy(currentList, item => item.category.title);
        // console.log(groupObj)
        var list = [];
        for(var i in groupObj) {
            list.push({
                name: i,
                value: groupObj[i].length
            })
        }

        var myChart;
        if (!pieChart) {
            myChart = echarts.init(pieRef.current);
            setpieChart(myChart);
        } else {
            myChart = pieChart;
        }
        var option;

        option = {
            title: {
                text: '当前用户新闻分类图示',
                // subtext: '纯属虚构',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
            },
            series: [
                {
                    name: '发布数量',
                    type: 'pie',
                    radius: '50%',
                    data: list,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };

        option && myChart.setOption(option);
    }

    return (
        <div className="site-card-wrapper">
            <Row gutter={16}>
                <Col span={8}>
                    <Card title="用户最常浏览" bordered={true}>
                        <List
                            size="small"
                            dataSource={viewList}
                            renderItem={item => <List.Item><a href={`#/news-manage/preview/${item.id}`}>{item.title}</a></List.Item>}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="用户点赞最多" bordered={true}>
                        <List
                            size="small"
                            dataSource={starList}
                            renderItem={item => <List.Item><a href={`#/news-manage/preview/${item.id}`}>{item.title}</a></List.Item>}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card
                        cover={
                            <img
                                alt="example"
                                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                            />
                        }
                        actions={[
                            <PieChartOutlined key="setting" onClick={() => {
                                setTimeout(() => {
                                    setvisible(true);
                                    // 初始化
                                    renderPieView()
                                }, 0);
                            }} />
                        ]}
                    >
                        <Meta
                            avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                            title={username}
                            description={
                                <div>
                                    <b>{region ? region : '全球'}</b>
                                    <span style={{ paddingLeft: "30px" }}>
                                        {roleName}
                                    </span>
                                </div>
                            }
                        />
                    </Card>,
                </Col>
            </Row>

            <Drawer
                title="个人新闻分类"
                width="680px"
                placement="right"
                closable={true}
                onClose={() => {
                    setvisible(false);
                }}
                visible={visible}
            >
                <div ref={pieRef} style={{
                    width: "680px",
                    height: "600px",
                    marginTop: "30px"
                }}></div>
            </Drawer>

            <div ref={barRef} style={{
                width: "100%",
                height: "360px",
                marginTop: "30px"
            }}>

            </div>
        </div>
    )
}
