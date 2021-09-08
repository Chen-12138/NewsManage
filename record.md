# 安装 sass
npm i --save sass

# 安装axios
npm i --save axios

# 反向代理 安装中间件
npm i --save-dev http-proxy-middleware
具体可以上这个网站查看https://create-react-app.dev/docs/proxying-api-requests-in-development/

# 安装路由
npm i --save react-router-dom

# 获取路由对象
可以引入withRouter(高阶组件)

<!-- 跳转方法 -->
props.history.push

<!-- 获取pathname -->
props.location.pathname

# JsonServer
json-server --watch ./test.json --port 8000

get
post
put(直接替换)
patch(局部更新)
delete

_embed 获取关联的东西
"http://localhost:8000/posts?_embed=comments"

_expand 获取上级的东西(关联)
"http://localhost:8000/comments?_expand=post"

`/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6`

_sort 根据哪个字段进行排序
_order 根据什么顺序
_limit 限制返回的数据数量

comments中可以关联posts，如在comments中加一个字段postId(值为posts中的id)

# 受控组件，非受控组件？

# 权限管理
根据后台返回的列表渲染页面，根据pagepermisson字段来控制是否渲染

# antd中的表格
需要自定义显示内容可以用render属性，传进来的第一个形参是dataIndex对应的后台内容, 第二个还是该项
如果没有dataIndex，则形参是该项内容

如果dataSource原来就有key值的话那就可以不写key
没有的话在Table中设置rowKey={(item) => item.id}

# forwardRef
从外面创建一个useRef(null)，然后传给用
forwardRef包住的组件，则有第二个参数为该ref值，该ref可以放在一个元素的ref中，这样在外面就可以使用该ref啦

# 关于set改变状态的坑
此处有坑，用set方法改完state后其实不会马上改变，modal不会马上创建，所以直接updateForm为null
但可以放在异步中执行，这是React的批量处理state会变成ture，会马上改变，然后创建出modal（就是说变成同步执行）
(放setTimeout中执行)

对Drawer也有这个坑

# redux react-redux

# lodash
    react中自带的一个高性能操作数组方法的库，一般引入方式:
    import _ from 'lodash'
    _.goupby(数据，回调(根据什么来分组))

# echarts
    可视化工具

# 路由管理
对于这种根据权限来渲染页面的，其实应该在前端构造一个路由组件映射表，根据后端返回的字段来决定渲染哪个组件
然后没有返回的就渲染403页面

# 权限管理
通过与后端侧边栏数据匹配，筛选出当前用户所属角色应看到的侧边栏信息
角色列表（控制每种角色所拥有的权限）

# 新闻发布流程
未发布，待发布，已发布，已下线 分别对应着某个字段，只需修改某个字段即可
未审核，正在审核，已通过，未通过

# 改变数据应该做到的是 本地状态的改变 + 后台同步

# 粒子插件
react particle

# 数据持久化
redux-persisit

# 富文本编辑
react draft