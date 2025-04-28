任务背景&目标

通过提供丰富的平台预置工具能力，帮助开发者快速落地场景， 提升平台 AI 应用复杂度。

概念对齐

什么是指令？

一个具有特定功能的组件，代表一个独立的步骤或逻辑。这些指令负责处理数据、执行任务或运行代码等等，指令一般会具备输入和输出。例如工作流的基础节点、AIE的编排指令，指令的开发方式包括但不限于原生代码开发、工作流搭建、一个 HTTP 接口或一个开发完成的 Agent 。

工作流指令

1、指令（节点）面板 Tab 

节点面板提供以下 3 大类，定义如下：

平台能力（官方提供指令、工作流、基础节点、Agent 节点等）

自定义资源（开发者自定义开发接入的工具、工作流、智能体等）

第三方应用（官方接入的第三方应用插件、开发者自定义接入应用插件）

2、平台能力的指令功能场景分类

常用推荐

大模型 LLM 

AI Agent

与用户交互

提问

发送消息-SSE

发送消息-Websocket

发送业务消息

知识与变量

数据库

会话管理

代码与逻辑

数据转化与处理

内容解析

搜索与 API 调用

图像处理

其他说明

技能树的分类后台可配置，先盘出具体的开发「指令」后，最后重新调整分类

内容解析：仅提取内容，转成大模型友好的格式 ，如 Markdown 格式，不涉及大模型的处理

AI Agent ：定义出几类的  Agent ，Agent 作为工具，在一个完成的任务中被使用

3、指令 的 UI 动态渲染

统一开发方式动态渲染前端展示

指令全集 

提示

指令开发完成后，请填写下表中的「开发方式」、「指令开发文档」字段 ，可参考该文档https://km.sankuai.com/collabpage/2710010730

目标完成时间：是预期「开发+自测完成」的时间，需要保证开发完成指令的质量；

在开发指令的过程中，优先考虑 AI 生成、工作流搭建等方式提升开发的效率；

一些需要内置开发的能力

1. 数据结构与格式处理

JSON处理：解析、序列化、反序列化、jsonpath提取、合并、扁平化、嵌套、格式校验   

XML处理：解析、序列化、xpath提取、xml2json、json2xml、格式校验

YAML处理：解析、yaml2json、json2yaml

数组/对象操作：map、filter、reduce、find、sort、去重、分组、合并、拆分、深拷贝、浅拷贝

表格/列表处理：行列筛选、分页、导入导出、数据透视、数据合并、批量处理

CSV/Excel处理：解析、导入导出、csv2json、excel2json、表单与表格互转

2. 字符串与文本处理

字符串操作：分割、拼接、替换、截取、大小写转换、去空格、填充、格式化

正则表达式：匹配、提取、替换、校验

模板字符串：变量插值、占位符替换、动态拼接

文本清洗：去除特殊字符、去重、分词、去停用词

3. 编码与格式转换

Base64 编解码

URL 编解码

HTML 编码/解码

Unicode/GBK/UTF-8 编码转换

二维码/条形码生成与解析

图片/文件转Base64、Base64转文件

4. 日期与时间处理

日期格式化/解析（yyyy-MM-dd、ISO、时间戳等）

当前时间获取

时间加减/区间计算（如加n天、相差天数/秒数）

时间戳与日期互转

日历组件/时间选择器

工作日/节假日判断

5. 数值与统计处理

数值计算：加减乘除、四舍五入、取整、取余、绝对值、随机数

聚合统计：求和、均值、最大最小值、计数、百分比

分组统计：groupby、pivot、分桶

货币/金额格式化

6. 数据校验与转换

数据校验：邮箱、手机号、身份证、正则校验、必填/唯一性校验、数值范围

类型转换：字符串与数字、布尔、日期、数组、对象等互转

数据脱敏：手机号、身份证、姓名等敏感信息脱敏

数据标准化/归一化：如手机号格式化、统一日期格式

7. 流程与条件逻辑

条件判断：if/else、switch/case、三元表达式

循环处理：for、foreach、while、批量处理

流程控制：跳转、等待、超时、重试、分支、并行

错误处理：try/catch、异常分支、默认值

8. API与网络请求

HTTP请求：GET/POST/PUT/DELETE、参数拼接、header设置、文件上传下载

API连接器：对接第三方API、数据库、消息队列、WebSocket等

GraphQL请求

Webhook/回调处理

数据缓存/本地存储

你的总结非常全面！下面我结合Apache Ant及其生态，帮你梳理下哪些功能有现成的Ant Task或常见开源扩展/集成方式，并标注出来：

1. 数据结构与格式处理

功能

Ant内置/插件/集成

说明/开源实现

JSON解析/序列化/反序列化

无内置，需用Groovy/脚本

用 

<groovy>

 + groovy.json.JsonSlurper/JsonOutput，或用js/python脚本

jsonpath提取

无内置，需用Groovy/脚本

<groovy>

 + Jayway JsonPath

JSON合并/扁平化/嵌套/校验

无内置，需用Groovy/脚本

<groovy>

/js/python脚本

XML解析/序列化

内置

 

<xmlproperty>

、

<xslt>

, 

<xmlcatalog>

解析/属性化/转换

xpath提取

无内置，需用Groovy/脚本

<groovy>

 + groovy.util.XmlParser/XmlSlurper、Java XPath API

xml2json/json2xml

无内置，需用脚本

<groovy>

/js/python脚本

XML格式校验（XSD）

内置

 

<schemavalidate>

XML Schema 校验

YAML处理

无内置，需用Groovy/脚本

<groovy>

 + snakeyaml

数组/对象操作

无内置，需用脚本

<groovy>

/js/python脚本

表格/列表处理

无内置，需用Groovy/脚本

<groovy>

 + Apache POI、csv库

CSV/Excel处理

无内置，需用Groovy/脚本

<groovy>

 + opencsv/Apache POI

2. 字符串与文本处理

功能

Ant内置/插件/集成

说明/开源实现

字符串操作

内置

 

<propertyregex>

 

<replace>

 

<replaceregexp>

 

<concat>

 

<echo>

支持分割、替换、拼接等简单操作

正则表达式

内置

 

<replaceregexp>

文本正则替换

模板字符串

内置

 

<filterset>

 

<propertyfile>

支持简单变量插值

文本清洗

内置

 

<replace>

 

<replaceregexp>

复杂清洗需脚本

3. 编码与格式转换

功能

Ant内置/插件/集成

说明/开源实现

Base64 编解码

无内置，需用Groovy/脚本

<groovy>

 + java.util.Base64

URL 编解码

无内置，需用Groovy/脚本

<groovy>

 + java.net.URLEncoder

HTML 编码/解码

无内置，需用Groovy/脚本

<groovy>

 + commons-text/JSoup

编码转换（如UTF-8）

内置

 

<native2ascii>

 

<fixcrlf>

支持部分编码转换

二维码/条形码

无内置，需用Groovy/脚本

<groovy>

 + ZXing

图片/文件转Base64

无内置，需用Groovy/脚本

<groovy>

 + Base64

4. 日期与时间处理

功能

Ant内置/插件/集成

说明/开源实现

日期格式化/解析

无内置，需用Groovy/脚本

<groovy>

 + java.time/DateFormat

当前时间获取

内置

 

${DSTAMP}

 

${TSTAMP}

 

${TODAY}

也可用 

<tstamp>

 生成属性

时间加减/区间计算

无内置，需用Groovy/脚本

<groovy>

 + java.time

日历/时间选择器

无内置

通常用于前端，不适合Ant

工作日/节假日判断

无内置，需用Groovy/脚本

<groovy>

 + 业务实现

5. 数值与统计处理

功能

Ant内置/插件/集成

说明/开源实现

数值计算

内置

 

<math>

（需ant-contrib插件）

基本加减乘除、取整

聚合统计/分组

无内置，需用Groovy/脚本

<groovy>

货币/金额格式化

无内置，需用Groovy/脚本

<groovy>

 + java.text.NumberFormat

6. 数据校验与转换

功能

Ant内置/插件/集成

说明/开源实现

数据校验

无内置，需用Groovy/脚本

<groovy>

 + 正则/自定义逻辑

类型转换

无内置，需用Groovy/脚本

<groovy>

数据脱敏

无内置，需用Groovy/脚本

<groovy>

数据标准化

无内置，需用Groovy/脚本

<groovy>

7. 流程与条件逻辑

功能

Ant内置/插件/集成

说明/开源实现

条件判断

内置

 

<condition>

 

<if>

 

<unless>

也可用 ant-contrib 的 

<if>

, 

<switch>

, 

<for>

循环处理

插件

 

<for>

 

<foreach>

（ant-contrib）

流程控制

内置

 

<target>

 

<depends>

 

<sequential>

 

<parallel>

也可用 ant-contrib 的 

<trycatch>

错误处理

插件

 

<trycatch>

（ant-contrib）

8. API与网络请求

功能

Ant内置/插件/集成

说明/开源实现

HTTP请求

插件

 

<http>

（ant-http-task）、 

<get>

 

<post>

（ant-contrib/ant-http）

也可用 

<groovy>

 + HttpURLConnection/HttpClient

API连接器/数据库

内置

 

<sql>

（JDBC）， 

<mail>

， 

<ftp>

也可用 

<groovy>

 调用第三方库

WebSocket/消息队列

无内置，需用Groovy/脚本

<groovy>

 + Java第三方库

GraphQL请求

无内置，需用Groovy/脚本

<groovy>

 + http/groovy.json

Webhook/回调

无内置，需用Groovy/脚本

<groovy>

数据缓存/本地存储

无内置，需用Groovy/脚本

<groovy>

9. 文件与图片处理

功能

Ant内置/插件/集成

说明/开源实现

文件上传/下载

内置

 

<copy>

 

<move>

 

<ftp>

 

<scp>

 

<get>

支持本地/远程/FTP/SCP

图片压缩/裁剪/转换

无内置，需用Groovy/脚本

<groovy>

 + Java图片处理库

文件解析（Excel/CSV）

无内置，需用Groovy/脚本

<groovy>

 + Apache POI/OpenCSV

文件预览/批量处理

无内置，需用Groovy/脚本

<groovy>

10. 安全与加密

功能

Ant内置/插件/集成

说明/开源实现

哈希/加密/解密

无内置，需用Groovy/脚本

<groovy>

 + java.security

签名/验签

无内置，需用Groovy/脚本

<groovy>

 + java.security

Token/JWT处理

无内置，需用Groovy/脚本

<groovy>

 + JWT第三方库

11. 用户与权限、通知、设备、AI等

这些通常为业务/平台级功能，Ant 本身不内置，需通过 <groovy>、自定义 Task 或外部系统集成实现。

总结

Ant 内置 Task：主要覆盖文件/目录、流程控制、基本字符串/正则、XML、SQL、FTP、邮件等。

ant-contrib 等开源插件：增强 if/for/trycatch/math 等流程与计算能力。

Groovy Task：极大增强 Ant 的数据处理能力，可用 Java/Groovy/第三方库完成几乎所有功能。

HTTP/网络/数据库/文件：有 Task 或插件支持，API/webhook/AI等需脚本或自定义扩展。

如需具体 Task 用法、插件下载链接或 <groovy> 脚本示例，请补充说明你的场景！

指令定义文档规范

参考：https://www.coze.cn/store/plugin/7329410795979161663?from=plugin_card

指令名称

功能描述

使用说明

注意事项

适用场景

入参

参数名、参数说明、是否必填、请求体示例

出参

响应体示例、前端展示

XML 语法  

groovy 语法

使用案例

分类与标签

错误码与异常说明

权限与安全要求。permission 字段：如是否需要登录、是否涉及敏感操作，便于大模型生成安全合规的流程。

依赖关系与前置条件。dependencies/prerequisites 字段：指明本指令依赖于哪些前置操作或状态（如“必须已登录”），便于 LLM 做全流程规划。

可视化/交互示意。ui_preview 字段：可放操作前后页面截图、动图或简要流程图，帮助大模型更好理解 UI 变化（如有条件可选）。

使用效果预览

建议将每个指令定义为一个对象，整体可组织为一个 tool list（数组），便于大模型批量 ingest 或检索。例如：

json复制代码

[ { "name": "ClickElement", "description": "点击指定页面元素", "usage": "...", "notes": "...", "scenarios": "...", "input": { "parameters": [ { "name": "selector", "desc": "元素选择器", "required": true, "type": "string" }, ... ], "example": { ... } }, "output": { "example": { ... }, "frontend": "展示说明..." }, "syntax": { "xml": "<ClickElement selector=\"...\" />", "groovy": "ant.ClickElement(selector: '...')" }, "case": { "desc": "点击登录按钮", "code": "...", "effect": "页面跳转到首页" } } ]

2. 字段详细建议

字段

建议说明

name

指令英文唯一标识，建议统一风格，便于大模型检索和调用。

description

简明功能描述，适合大模型理解和摘要。

usage

使用说明，含调用方式、典型流程、特殊用法。

notes

注意事项，列举易错点、限制、与其他指令的关系。

scenarios

适用场景，便于大模型进行语境推理。

input

入参，建议包含参数列表、参数说明、示例（可拆为参数表和请求体示例）。

output

出参，建议包含响应体示例、前端展示建议。

syntax

XML 语法、Groovy 语法等多种调用格式，便于不同代码生成和落地场景。

case

使用案例（含描述、代码、预期效果），便于大模型学习和代码补全。

BetterYeah  插件效果预览

说明：以下标注为蓝色的，以及加入到指令全集

BetterYeah  

官方通用插件

分类

插件描述

详情

网络搜索

Bing搜索

从Bing中搜索相关信息

https://ai.betteryeah.com/plugin/system/013258d5-e717-4c79-9041-38416dd963be?pageType=infoWithSidebar

AI搜索

通过AI搜索查询网络内容，并回答问题

https://ai.betteryeah.com/plugin/system/717f5e057c8d49a48d808181fc183fb6?pageType=infoWithSidebar

博查搜索

通过博查搜索网络内容，可总结摘要

https://ai.betteryeah.com/plugin/system/05f6fd811087407c875e72d21f37c24e?pageType=infoWithSidebar

图像处理

AI识图

识别图片中的内容和信息

https://ai.betteryeah.com/plugin/system/d8d11dd3-c20e-405a-b00c-10acc27ea110?pageType=infoWithSidebar

AI生图

通过文字描述生成图片

https://ai.betteryeah.com/plugin/system/4cf52bff-01f8-4ddf-9de3-cbdec64ee89c?pageType=infoWithSidebar

AI图生视频

通过图片和描述生成视频

https://ai.betteryeah.com/plugin/system/eb64a91d0b6c0e4479f6941eddd6940e?pageType=infoWithSidebar

OCR识图

识别并提取图像中的文本信息。

https://ai.betteryeah.com/plugin/system/88f33fda750d4b5aa5fd9b3811adecad?pageType=infoWithSidebar

通用工具

图表绘制

能够根据用户的要求绘制echarts图表，兼容各种格式的自定义数据和个性化的绘制要求

https://ai.betteryeah.com/plugin/system/ca6561efe5f7486c9feb2855c10d6aa7?pageType=infoWithSidebar

解析能力

通用文档解析：解析文档内容，支持以下类型文件：PDF、Word、PPT、Excel、Markdown、TXT、Msg、Json

https://ai.betteryeah.com/plugin/system/20d59d321cd54d82b02abd9215cf37c8?pageType=infoWithSidebar

网页解析

输入网页链接，分析网页内容

https://ai.betteryeah.com/plugin/system/cbf2b60b-5776-45f2-ae99-3ff8e2aef67c?pageType=infoWithSidebar

Excel表格解析

识别Excel表格内容，可以解析或数据清洗

https://ai.betteryeah.com/plugin/system/1376d6e4-62ef-47d5-9916-50cc78a2494a?pageType=infoWithSidebar

音频解析

将音频转为文字，可以提取文字或解析音频内容。

https://ai.betteryeah.com/plugin/system/ab907ce98b894333b0517824f0b3792e?pageType=infoWithSidebar

长文本解析

支持1~2个长文本(文件/URL)的解析。 可以帮你分析论文、总结文章。

https://ai.betteryeah.com/plugin/system/9b4409785ebd4fe2a4cbafc2f78c9d27?pageType=infoWithSidebar

PPT、PDF转Word/文本

解析并提取PPT、PDF文件内容

https://ai.betteryeah.com/plugin/system/a53bd06b7fa644228e3f5001f90f2001?pageType=infoWithSidebar

视频解析

将视频中的音频转为文字，可以提取视频的截图片段

https://ai.betteryeah.com/plugin/system/1e6e6f07e5eb4b6698764930abf08aec?pageType=infoWithSidebar

外部三方应用接口

应用名称

插件描述

详情

抖音

抖音视频分析：输入抖音链接，分析视频信息

https://ai.betteryeah.com/plugin/system/c4b8394e-92dc-47c3-a15b-c1daad5ffef0?pageType=infoWithSidebar

抖音实时热榜：获取抖音实时热搜榜

https://ai.betteryeah.com/plugin/system/a659a9e153bd4f999151e3c316632a99?pageType=infoWithSidebar

抖音评论获取：根据抖音链接获取相关评论

https://ai.betteryeah.com/plugin/system/eb287aad-34f9-4d24-ae00-0d52335efe80?pageType=infoWithSidebar

小红书

笔记详情：输入小红书笔记链接，返回笔记详情

https://ai.betteryeah.com/plugin/system/b1fea677-d915-4d9c-aa07-dbdc5fdb9261?pageType=infoWithSidebar

笔记搜索：通过关键词，查询小红书笔记

https://ai.betteryeah.com/plugin/system/8336cf25-bbd2-4248-a581-9e85e3465631?pageType=infoWithSidebar

爆款笔记查询：搜索关键词，获取最热门的笔记，可指定要获取的笔记数目，默认获取10条

https://ai.betteryeah.com/plugin/system/4c13fbabf2214ba08c68f6a485f9b044?pageType=infoWithSidebar

低粉爆款笔记查询：搜索关键词，查询低粉爆款笔记（低粉丝量的作者发布的爆款笔记，条件：粉丝量 < 1w、笔记点赞量 > 1000、赞粉比 > 10），可指定要获取的笔记数目，默认获取10条

https://ai.betteryeah.com/plugin/system/4e4b307705894d2a8231908288b335fa?pageType=infoWithSidebar

笔记评论查询：输入小红书笔记链接，返回评论数据

https://ai.betteryeah.com/plugin/system/6c755c0b-a6f9-4956-9540-59c81d69a3a4?pageType=infoWithSidebar

查询指定账号下热门笔记：将指定账号下的笔记按照点赞量排行，返回点赞量最高的多篇笔记，返回笔记数量可配置，默认10篇

https://ai.betteryeah.com/plugin/system/3c0407b06367421f8ddc53b5cfe3a9fc?pageType=infoWithSidebar

评论洞察：搜索关键词，批量获取热评，发现领域热点

https://ai.betteryeah.com/plugin/system/722ddf97126848518102cf59c845de96?pageType=infoWithSidebar

笔记封面批量查询：输入笔记链接列表，批量获取封面

https://ai.betteryeah.com/plugin/system/f2171ae432c8436d909795602338df76?pageType=infoWithSidebar

笔记评论批量查询：输入笔记链接列表，批量获取评论，可配置单篇笔记要获取的评论数

https://ai.betteryeah.com/plugin/system/f2171ae432c8436d909795602338df76?pageType=infoWithSidebar

知乎

知乎实时热榜

获取知乎实时热搜榜

https://ai.betteryeah.com/plugin/system/c00321b042a844859abd18fb97aad1b4?pageType=infoWithSidebar

知乎内容搜索

搜索知乎内容，返回三篇问答 / 文章

https://ai.betteryeah.com/plugin/system/e1ee83d8a73f42488f8ec6e9e254f9b3?pageType=infoWithSidebar

微博

微博实时热搜

获取实时微博热搜榜单

https://ai.betteryeah.com/plugin/system/e9c7bd451a044efcadd82a135768b273?pageType=infoWithSidebar

今日头条

今日头条实时热榜

获取今日头条实时热搜榜

https://ai.betteryeah.com/plugin/system/82f4fd657af84d15ab952c2f7d5216b9?pageType=infoWithSidebar

Bilibili

Bilibili实时热榜

获取Bilibili实时热搜榜

https://ai.betteryeah.com/plugin/system/8a0bd04e7a984d239ce2b498182ae980?pageType=infoWithSidebar

视频评论获取

批量获取多个B站视频的评论，可配置单个视频要获取的评论数量

https://ai.betteryeah.com/plugin/system/4fb65e09aa074ee3b599996e493ab1e7?pageType=infoWithSidebar

Bilibili视频搜索

搜索B站视频

https://ai.betteryeah.com/plugin/system/83ad3fea43c444078319b0b93e422294?pageType=infoWithSidebar

工作流模板

分类

名称和描述

详情

检索增强

自决策AI检索

AI分析检索结果，并循环检索直到满足需求。适用于：1、用户问题含多个检索条件 2、部分检索内容语义低于阈值

https://ai-docs.betteryeah.com/Flow/%E6%A8%A1%E6%9D%BF/%E3%80%90%E8%87%AA%E5%86%B3%E7%AD%96AI%E6%A3%80%E7%B4%A2%E3%80%91%E6%A8%A1%E6%9D%BF.html

https://ai.betteryeah.com/application/e0569b1a04024703903fc45022cf8553/8346dd0afa054ced8ff382888d84d8b2/flow/8346dd0afa054ced8ff382888d84d8b2

自分段AI检索

直接从知识库检索对应的文档集，解读答案。用于总结全文等场景

https://ai-docs.betteryeah.com/Flow/%E6%A8%A1%E6%9D%BF/%E3%80%90%E8%87%AA%E5%88%86%E6%AE%B5AI%E6%A3%80%E7%B4%A2%E3%80%91%E6%A8%A1%E6%9D%BF.html

https://ai.betteryeah.com/application/e0569b1a04024703903fc45022cf8553/8346dd0afa054ced8ff382888d84d8b2/flow/8346dd0afa054ced8ff382888d84d8b2

解析增强

音频整理

使用AI梳理音频的内容，整理成格式规整的文本结构。（其他的类似功能比如：文档数据清洗等也可以根据这个模板来修改）

https://ai-docs.betteryeah.com/Flow/%E6%A8%A1%E6%9D%BF/%E3%80%90%E9%9F%B3%E9%A2%91%E6%95%B4%E7%90%86%E3%80%91%E6%A8%A1%E6%9D%BF.html

https://ai.betteryeah.com/application/e0569b1a04024703903fc45022cf8553/8346dd0afa054ced8ff382888d84d8b2/flow/8346dd0afa054ced8ff382888d84d8b2

AI文档分段

用Al对文档进行分段，并存入知识库中，暂不支持表格。

https://ai.betteryeah.com/application/e0569b1a04024703903fc45022cf8553/8346dd0afa054ced8ff382888d84d8b2/flow/8346dd0afa054ced8ff382888d84d8b2

逻辑增强

意图识别增强

结合RAG，给意图判断增加样本示例，提升识别效果

https://ai.betteryeah.com/application/e0569b1a04024703903fc45022cf8553/8346dd0afa054ced8ff382888d84d8b2/flow/8346dd0afa054ced8ff382888d84d8b2

N8N 节点

先高优开发 AI Agent  节点，后续在迭代补齐其他节点

节点

功能描述

详情

AI Agent 

Conversational Agent

The Conversational Agent has human-like conversations. It can maintain context, understand user intent, and provide relevant answers. This agent is typically used for building chatbots, virtual assistants, and customer support systems.

Conversational Agent

OpenAI Functions Agent

Use the OpenAI Functions Agent node to use an OpenAI functions model. These are models that detect when a function should be called and respond with the inputs that should be passed to the function.

OpenAI Functions Agent

Plan and Execute Agent

The Plan and Execute Agent is like the ReAct agent but with a focus on planning. It first creates a high-level plan to solve the given task and then executes the plan step by step. This agent is most useful for tasks that require a structured approach and careful planning.

Plan and Execute Agent

ReAct Agent

The ReAct Agent node implements ReAct logic. ReAct (reasoning and acting) brings together the reasoning powers of chain-of-thought prompting and action plan generation.

ReAct Agent

SQL Agent

The Tools Agent uses external tools and APIs to perform actions and retrieve information. It can understand the capabilities of different tools and determine which tool to use depending on the task. This agent helps integrate LLMs with various external services and databases.

SQL Agent

Tools Agent

Tools Agent

coze 官方插件

https://www.coze.cn/store/plugin?cate_type=category&cate_value=7327137275714781221

端插件

插件

功能说明

参考链接

英特尔AI PC工具箱

“英特尔AI PC工具箱”提供一套本地计算机能力集合，涵盖了 PC 操作、本地多模态向量知识库，本地图片理解，本地语音转文本等支持，未来还会逐步引入更多端侧AI能力。适用于第11代英特尔®酷睿™或者更高版本的处理器，推荐使用英特尔®酷睿™Ultra系列处理器。

https://www.coze.cn/store/plugin/7483814720839925811?from=plugin_card

浏览器工具箱

浏览器操作的工具集（端插件）

https://www.coze.cn/store/plugin/7478266787008725032?from=plugin_card

FoloToy AI 玩具端插件

FoloToy AI 智能玩具同款端插件：可以通过音量/语速调节实现声效优化，同时，头部转动控制模块提供拟真互动，并搭载多媒体控制系统实现音乐/音频文件的播放管理。

https://www.coze.cn/store/plugin/7480110543395700771?from=plugin_card

机智云AI智能体硬件端插件

机智云AI智能体硬件专属端插件，可用于调节机智云设备的播放音量、提示灯亮度等

https://www.coze.cn/store/plugin/7483026193323687970?from=plugin_card

官方插件--进行中

分类

功能说明

参考链接

新闻阅读

头条新闻

这是一款实时更新最新头条新闻和新闻文章的插件。它可以帮助用户随时获取到全网最热门的新闻话题，让你的知识库永不落后。

https://www.coze.cn/store/plugin/7328311079681949705?from=plugin_card

头条视频搜索

头条视频搜索插件是一款强大的工具，用户可以通过该插件搜索想要观看的视频。插件提供了详细的入参和出参，以便用户获取准确的视频信息。

https://www.coze.cn/store/plugin/7345693026326446080?from=plugin_card

搜狐热闻

搜狐新闻插件可以根据用户query帮助用户获取搜狐网上的每日热闻。

https://www.coze.cn/store/plugin/7343894357063385100?from=plugin_card

头条图片搜索

头条图片搜索插件是一款功能强大的插件，能够帮助用户轻松搜索并获取他们想要的图片。它可以根据用户提供的搜索关键词，从各大图片库中抓取与关键词相关的图片，并返回给用户。通过该插件，用户可以方便快捷地找到所需的图片素材，满足他们的个人或商业需求。

该插件支持以下核心功能：

图片搜索：用户可以输入关键词进行图片搜索。插件会自动从多个可信赖的图片库中检索相关的图片，并展示给用户。

搜索结果展示：搜索结果以图片的方式呈现，用户可以一目了然地浏览并选择合适的图片。

https://www.coze.cn/store/plugin/7345719541038579747?from=plugin_card

便利生活

墨迹天气

搜索提供的省、市、区县的未来40天的天气情况，包括温度、湿度、日夜风向等。

使用示例：

1.北京市石景山区的天气如何？

2.江西省九江市武宁县罗坪镇长水村的天气怎么样？

3.重庆市渝中区南纪门街道的天气好吗？

4.北京周末天气怎样？

5.河北省保定市安新县的天气今天怎么样？

https://www.coze.cn/store/plugin/7329787887074197545?from=plugin_card

高德地图

功能描述

路线规划

该插件能够帮助用户规划出最优的骑行、电动车、步行、开车及公共交通路线。它能够依据用户的起点和终点信息（支持地点关键词或经纬度），智能计算出最佳的出行路线及预计的出行时间。除此之外，它还会展示不同路线的交通信息，比如可能的交通拥堵情况、是否有施工情况等，让用户能够全面掌握行程信息。

搜索附近地点

这个功能可以帮助用户搜索出周围的相关设施或服务点，如餐饮、住宿、娱乐等地点。用户只需要输入特定关键词，就可以获取到所需信息，非常便捷。

地理信息转换

该插件不仅支持从 IP 到地理位置信息的转换，也支持将地理位置信息转换成经纬度，以及从经纬度转换成地理位置信息。这类功能能帮助用户更直观、更精确地查看和定位位置。

https://www.coze.cn/store/plugin/7379953949534715956?from=plugin_card

飞书多维表格

飞书多维表格，支持以下功能：

1. 创建多维表格；

2. 创建多维表格数据表；

3. 列出多维表格下的全部数据表；

4. 获取多维表格的元数据；

5. 在多维表格数据表中新增多条记录；

6. 根据 record_id 检索多维表格数据表中的记录；

7. 批量更新多维表格数据表中的现有记录；

8. 查询多维表格数据表中的记录；

9. 搜索多维表格类型的文档；

https://www.coze.cn/store/plugin/7395043460165779483?from=plugin_card

飞书云文档

飞书云文档，支持以下操作：

1. 创建文档；

2. 获取文档的纯文本内容；

3. 获取文档的所有块；

4. 获取文档的基本信息；

5. 搜索文档类型的文档；

6. 搜索 PPT 类型的文档；

https://www.coze.cn/store/plugin/7395041536909574154?from=plugin_card

飞常准

功能描述

"飞常准"插件是一款高效准确的航班信息查询插件，它能根据用户提供的出发城市名称（dep)、到达城市名称（arr)及出发日期（depTime)以获取相应的航班列表。针对用户输入的出发和到达城市名，该插件可以快速返回匹配的航班信息，无需用户手动输入城市代码，用户体验更加友好。

https://www.coze.cn/store/plugin/7328314169139380234?from=plugin_card

猎聘

帮助用户根据工作经验、教育经历、地理位置、薪水、职位名称、工作性质等条件搜索猎聘上提供的招聘信息。

https://www.coze.cn/store/plugin/7330155407547138089?from=plugin_card

百度地图

利用百度地图帮助你搜索周边，路线规划等。

使用示例：

北京西站转换成经纬度

39.901483,116.327823是哪？

搜索北京西站附近的银行

北京有什么银行

开车从北京西站到北京朝阳站，给我规划一下路线

https://www.coze.cn/store/plugin/7394300204087787570?from=plugin_card

国内快递查询

国内快递查询，顾名思义，根据公司名和快递单号查询快递状态。

Tools：

ExpressDeliveryPlugin：查询快递状态。

参数：express_name：快递公司名称。

express_number：快递单号

使用示例：

1. 帮我查询一下顺丰速运单号为xxxxx的快递。

注意事项：

1. 注意输入正确的快递单号并填写准确快递公司的名称

https://www.coze.cn/store/plugin/7329788013695860747?from=plugin_card

飞书电子表格

对飞书电子表格做操作，包含以下操作：

1.创建电子表格；

2.新增多行至工作表；

3.新增多列至工作表；

4.搜索电子表格类型文档；

5.获取电子表格信息；

6.获取所有工作表；

7.读取工作表行列内容；

https://www.coze.cn/store/plugin/7395040352337559578?from=plugin_card

追书

据描述返回符合要求的小说。

使用示例：

1.好评率最高的关于男生爱看的武侠类小说，要已完结的并且免费的，最好字数不要太多。

2.帮我找下适合女生看的关于都市类的爱情小说，正在连载的，最近更新时间在一周内的。

3.是否可以按照最新上架的小说进行排序和查看？关于古装言情的。

4.我想知道在追书小说平台上人气最高的，且字数在50万~200万的小说都有哪些？最好是女生爱看的。

5.可否帮我找出追书小说平台上，如《斗破苍穹》这种类型的小说？最好是收费类的。

https://www.coze.cn/store/plugin/7371340340680245286?from=plugin_card

什么值得买

什么值得买是一个购物插件，可以帮助用户查询商品的优惠信息，根据用户输入的商品相关提问，返回商品概况、价格、购买渠道、性价比推荐等信息，并给出优惠商品的链接地址。

https://www.coze.cn/store/plugin/7355060468744044595?from=plugin_card

幸福里

幸福里是一款提供二手房、新房、租房信息的插件。如果你想查询某个城市、区域、户型的房产信息，可以使用此插件。

https://www.coze.cn/store/plugin/7329411028809187369?from=plugin_card

淘票票

影片检索：用户通过输入页码和页大小这两个参数，可以访问淘票票的影片信息库，获取正在上映或即将上映的影片。

详细影片信息获取：无需手动筛选，直接返回影片名称、剧情简介、主演、导演、影片类型等一系列详细信息。

评价系统：返回影片的评分、评分人数及想看人数等评价信息，帮助用户快速评估影片口碑。

票务信息：提供影片的购票链接、预售及在映状态信息，帮助用户掌握第一手票务信息。

上映时间：返回影片上映日期及是否正在上映的信息。

https://www.coze.cn/store/plugin/7340117002398285843?from=plugin_card

智联招聘

智联招聘是Coze与合作方开发的官方插件，这个插件可以帮助用户根据职位名称、薪水、工作地点、学历、工作经验、公司名称、公司性质等条件搜索智联招聘上提供的招聘信息。

https://www.coze.cn/store/plugin/7356152229616730149?from=plugin_card

飞书消息

飞书消息，支持以下功能

1. 使用飞书自定义机器人 webhook 发送消息；

2. 使用飞书应用机器人发送消息；

https://www.coze.cn/store/plugin/7395041302766944275?from=plugin_card

飞书日历

在飞书上日历上创建日程、更新日程、删除日程、查询日程信息

https://www.coze.cn/store/plugin/7395041856574423075?from=plugin_card

飞书任务

调用飞书开放平台任务相关API，支持以下操作：

1.创建任务：输入任务标题、开始时间、结束时间等信息创建飞书任务；

2.更新任务：对飞书任务的任务标题、任务时间等信息做修改；

3.删除任务：对创建的飞书任务做删除；

4.列出所有任务：查询用户下单所有飞书任务；

https://www.coze.cn/store/plugin/7395041172152156186?from=plugin_card

36氪

根据用户的描述搜索相应的文章。

https://www.coze.cn/store/plugin/7380175430994690102?from=plugin_card

灯塔

根据您的要求，查找电影票房信息。

https://www.coze.cn/store/plugin/7375087417503694848?from=plugin_card

Microsoft Outlook Calendar

Microsoft Outlook Calendar 是一款功能强大的插件，它可以帮助您轻松设置 Microsoft 日历的日程安排，并快速获取日程安排信息。您可以使用此插件创建、更新和删除事件，还可以根据关键词、时间等条件筛选日程信息。此外，该插件还支持添加参与者，让您更方便地与他人共享日程安排。​

https://www.coze.cn/store/plugin/7391846517373550619?from=plugin_card

Microsoft Outlook Email

该插件提供了一系列的功能，帮助用户管理 Outlook 邮箱。用户可以使用插件的各个工具来发送草稿邮件、创建草稿、列出所有的 Outlook 类别、创建 Outlook 邮箱的目录、列出用户邮箱中的消息、发送邮件、回复消息以及修改草稿邮件。

https://www.coze.cn/store/plugin/7391830237610491944?from=plugin_card

飞书知识库

飞书知识库搜索Wiki、获取Wiki全部子节点列表

https://www.coze.cn/store/plugin/7408195262340104230?from=plugin_card

飞书认证及授权

飞书认证及授权

https://www.coze.cn/store/plugin/7395041877151514662?from=plugin_card

图像

图片理解

工具名称：imgUnderstand

 一款通过解析特定URL上的图片内容并为其生成含义且相关的文本描述的插件。它使用了先进的机器视觉和自然语言处理技术，旨在帮助用户理解图片的主要内容。

https://www.coze.cn/store/plugin/7328314686280138803?from=plugin_card

ByteArtist

根据文本描述生成图像，可指定图像数量和大小。

https://www.coze.cn/store/plugin/7328315861222031410?from=plugin_card

必应图片搜索

Bing 图像搜索API允许用户查找图片。

使用示例：

1.帮我搜一张演唱会的照片

2.帮我搜两张富士山的照片

3.找一张猫的图片

4.找一张长城的图片

5.帮我搜一下电脑的键盘

https://www.coze.cn/store/plugin/7328314606554824742?from=plugin_card

豆包图像生成大模型

豆包图像生成大模型是一款强大的 AI 图像助手，提供两大核心功能：

图片生成：根据用户提供的文本描述生成全新的图像。只需输入文字描述，模型就能基于此创作出独特的图像作品。

图片编辑：使用任何文本提示修改给定图像。通过输入文本指令和待编辑图片，模型会根据指令对图片进行相应编辑和修改。

https://www.coze.cn/store/plugin/7449356651498471463?from=plugin_card

ByteArtist Pets

ByteArtist下的宠物类别的图像处理插件。上传宠物照片，来为你的宠物换装吧。

https://www.coze.cn/store/plugin/7359145197827145738?from=plugin_card

实用工具

链接读取

该插件是一个强大的网页内容抓取工具。它不仅能够返回网页的原始内容，包括标题、内容、链接等，而且还可以对这些内容进行筛选和解析。无论是需要进行网页内容分析，还是需要从各种网页中提取有价值的信息，这个插件都能大显身手。

https://www.coze.cn/store/plugin/7329410795979161663?from=plugin_card

代码执行器

该插件是一个代码执行器，主要用于运行Python代码，并在指定时间内获取结果。它具有以下功能和特性：

1. **执行Python代码**：该插件可以接收Python代码作为输入，并通过Python解释器执行。用户可以将问题描述为代码问题，并通过插件执行代码来解决问题。

2. **多领域支持**：该插件特别适用于处理数学、计算机、图片和文件等领域的问题。用户可以利用Python语言的强大功能和库来处理与这些领域相关的任务。

3. **动态代码生成**：基于问题分析的结果，LLM可以立即生成相应的Python代码，按照步骤解决问题。这样用户无需自行编写代码，可以更快地实现解决方案。

4. **反馈和调试支持**：当运行代码时，LLM会参考错误消息来调整代码，直到成功执行。这提供了及时反馈和支持，帮助用户解决问题。

5. **文件上传和保存**：当LLM接收到文件链接时，用户可以将文件的URL和文件名作为参数传递给插件中的参数upload_file_url和upload_file_name，并且插件将保存这些文件供后续使用。

https://www.coze.cn/store/plugin/7328314220632834074?from=plugin_card

TreeMind树图

TreeMind树图，新一代的AI人工智能思维导图软件。我们提供智能思维导图制作工具和丰富的模板，支持脑图、逻辑图、树形图、鱼骨图、组织架构图、时间轴、时间线等多种专业格式。利用先进的AI技术，助您高效学习与工作。注意：图片内容只支持展示中文。

http://coze.cn/store/plugin/7343901610403184652?from=plugin_card

OCR

可以从包含文字的图片中识别包含的文字。不包含文字的图片无法进行识别。

https://www.coze.cn/store/plugin/7342856270615052327?from=plugin_card

Doc Maker

Doc Maker是一个创建多种格式文档的插件，目前支持生成pdf、csv、xlsx、pptx、docx、html、markdown、latex格式的文档，用户可以使用此插件自由创建文档。

https://www.coze.cn/store/plugin/7328314298990788659?from=plugin_card

AiPPT

新一代的AI人工智能产品。最快10秒一句话智能生成PPT，自动生成大纲内容，自动选择和设计幻灯片的布局、颜色和字体，自动配图，拥有海量版权模板 ，支持在线编辑、演示、下载、存储等功能。通过先进的AI技术，助您提高学习办公效率。

https://www.coze.cn/store/plugin/7345361954749300771?from=plugin_card

Wolfram Alpha

强大的数学工具，可以对算式进行计算。

使用示例：

1.什么是2+3的结果

2.1938+1278等于几

3.90度是直角还是锐角

4.求解二次方程5x^2 + 7x - 8 = 0的解

5.给出两个向量(2, 0) 和 (3, 4)，计算内积

https://www.coze.cn/store/plugin/7328314516272463923?from=plugin_card

图表大师

图表生成插件：该插件基于用户提供的参数，可以生成多种类型的图表，包括饼图、折线图、柱状图和雷达图。用户可以通过设置各种参数，自定义图表的标题、子标题、坐标轴、图例等属性，从而生成符合需求的图表。插件支持多种样式设置，能够满足用户对图表的个性化要求。

https://www.coze.cn/store/plugin/7362419607065640972?from=plugin_card

文件读取

帮助用户阅读文档内容，输入文档链接，返回文档内容，目前支持html、xml、doc、docx、txt、pdf、csv、xlsx格式。

https://www.coze.cn/store/plugin/7405803685659295782?from=plugin_card

语音转文本

语音转文字是一个识别语音url链接，提取语音文本的插件。

https://www.coze.cn/store/plugin/7342819789989052470?from=plugin_card

板栗看板

对任务进行拆解，并生成一个看板。

https://www.coze.cn/store/plugin/7358789295274049572?from=plugin_card