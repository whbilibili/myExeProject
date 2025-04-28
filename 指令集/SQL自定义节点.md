【设计中】官方指令 - SQL 自定义节点 - V1.0.0

## 指令名称

ExecuteCustomSQL / SQL自定义节点

## 功能描述

在当前上下文关联的 ABS 数据库（由 `base_id` 标识）上执行用户定义的 SQL 语句，以实现对该数据库内数据的动态管理（包括新增、查询、编辑、删除等操作）。支持通过参数化防止 SQL 注入，并可选地通过自然语言描述智能生成 SQL 语句。
**注意：V1.0.0 仅支持操作当前工作空间关联的 ABS 数据库。**

## 使用说明

1.  在工作流画布中添加"SQL 自定义节点"。
2.  **指定目标数据库 Base ID (`base_id`) (必填):** 输入要执行 SQL 的目标 ABS 数据库的 ID。
3.  **提供 SQL 语句:**
    *   **方式一 (直接编写):** 在 `custom_sql_statement` 参数中直接编写要执行的 SQL 语句（针对目标 Base 的表结构，推荐使用参数占位符）。
    *   **方式二 (智能生成):** 在 `generate_sql_prompt` 参数中输入自然语言描述，指令将尝试调用 AI 生成针对目标 Base 的 SQL 语句（生成的 SQL 可能需要用户确认或会直接执行）。*如果提供了此项，`custom_sql_statement` 可能会被忽略或用于校验。*
4.  **配置 SQL 参数 (`parameters`) (如果 SQL 中使用了占位符):**
    *   定义 SQL 语句中使用的参数及其值。
    *   值可以设置为固定值或引用上游节点的输出参数。
5.  将节点的输入连接到前序节点（获取 `base_id`, 参数值等），并将输出连接到后续节点。
6.  执行工作流。
7.  检查节点的输出，获取查询结果或受影响的行数。

## 注意事项

*   **权限:**
    *   执行此节点的工作流或用户，其关联的凭证（系统传递的 `token`)**必须**拥有在目标 ABS 数据库 (`base_id`) 上执行所提供 SQL 语句所需的**相应权限**（如对特定表的 SELECT, INSERT, UPDATE, DELETE 权限）。
*   **SQL 注入风险 (极其重要):** **必须**使用参数化查询（通过 `parameters` 入参）来传递动态值，严禁直接拼接 SQL 字符串。
*   **SQL 语法和方言:** 编写的 SQL 语句必须符合 **ABS/NocoDB 底层数据库引擎所支持的语法**（例如，可能是 PostgreSQL、MySQL 或 SQLite 的方言，需要平台明确）。
*   **NL-to-SQL 生成:**
    *   生成的 SQL 准确性依赖于自然语言描述的清晰度以及 AI 对目标 Base 结构的理解。建议进行审查。
    *   自然语言描述应明确针对目标 Base 内的表和字段。
*   **Schema 了解:** 用户编写或描述 SQL 时，需要了解目标 ABS 数据库 (`base_id`) 内的**数据表名称、字段名称和数据类型**。
*   **错误处理:** 自定义 SQL 可能因语法错误、权限不足、违反约束等原因失败。工作流需处理这些错误。
*   **资源消耗:** 复杂查询可能消耗较多 ABS/NocoDB 资源。
*   **返回数据量:** SELECT 查询考虑使用 `LIMIT` 或工作流分页。

## 适用场景

*   在单个 ABS 数据库 (Base) 内执行标准 CRUD 指令无法满足的复杂操作，例如：
    *   涉及 Base 内多表连接 (JOIN) 的查询。
    *   使用聚合函数 (COUNT, SUM, AVG, GROUP BY) 的查询。
    *   执行特定于底层数据库方言的高级函数（需谨慎）。
    *   进行复杂的条件更新或删除。
    *   执行批量插入/更新（可能比循环调用 Add/Edit Record 更高效）。
*   需要根据动态逻辑构建和执行针对特定 ABS Base 的 SQL 的场景。

## 入参

| 参数名                | 参数说明                                                                                                                                                              | 是否必填                        | 用户是否配置 |
| :-------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------ | :----------- |
| base_id               | 目标 ABS 数据库的 Base ID。                                                                                                                                           | 是                              | 是           |
| custom_sql_statement  | (可选，与 `generate_sql_prompt` 二选一或配合使用) 用户直接编写的、针对目标 Base 的 SQL 语句，建议使用参数占位符（如 `:name`, `?`）。                                           | 条件性必填 (如果未提供 prompt) | 是           |
| generate_sql_prompt   | (可选，与 `custom_sql_statement` 二选一或配合使用) 用于智能生成 SQL 的自然语言描述（应包含目标表名等信息）。                                                                  | 条件性必填 (如果未提供 SQL)    | 是           |
| parameters            | (可选) 一个 JSON 对象，包含 SQL 语句中使用的参数名及其对应的值。键为参数名，值为具体数据或上游节点输出引用。例：`{"status": "active", "min_age": {{upstream.age_threshold}}}` | 否 (如果 SQL 无参数则不需要) | 是           |
| token                 | ABS 调用令牌 (用于访问指定的 `base_id`)                                                                                                                             | 是                              | 否 (系统获取)|
| workspaceID           | 对应的 ABS 空间 ID (用于 API 调用上下文和权限校验)                                                                                                                  | 是                              | 否 (系统获取)|

**`parameters` 请求体示例:**
```json
{
  "base_id": "base_project_tracker",
  "custom_sql_statement": "SELECT TaskName, DueDate FROM Tasks WHERE Status = :status ORDER BY Priority DESC LIMIT :limit",
  "parameters": {
    "status": "Pending",
    "limit": 5
  }
}
```
**请求体示例 (使用自然语言生成):**
```json
{
  "base_id": "base_sales_crm",
  "generate_sql_prompt": "从 '客户表' 中查找 '城市' 是 '北京' 并且 '上次联系时间' 在30天内的所有客户的姓名和电话",
  "parameters": {}
}
```

## 出参

| 参数名              | 参数说明                                                                                                                                        |
| :------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------- |
| `success`           | 布尔值，指示 SQL 执行是否成功。                                                                                                                  |
| `results`           | (仅对 SELECT 查询) 包含查询结果记录的数组。每个记录是一个对象，键为列名，值为数据。                                                                |
| `rows_affected`     | (对 INSERT, UPDATE, DELETE) 成功执行后影响的行数。                                                                                                |
| `column_names`      | (仅对 SELECT 查询，可选) 返回结果集的列名数组。                                                                                                   |
| `generated_sql`     | (如果使用了 `generate_sql_prompt`) 实际生成并执行（或准备执行）的 SQL 语句。                                                                      |
| `message`           | 操作结果的消息。成功时可能为空或提示成功，失败时包含数据库返回的错误信息或平台错误。                                                                  |
| `error_code`        | (如果 `success` 为 false) 对应错误码与异常说明部分的错误代码。                                                                                      |

**响应体示例 (SELECT 成功):**
```json
{
  "success": true,
  "results": [
    {"TaskName": "Submit report", "DueDate": "2024-05-15"},
    {"TaskName": "Schedule meeting", "DueDate": "2024-05-12"}
  ],
  "rows_affected": null,
  "message": "Query executed successfully, 2 rows returned."
}
```
**响应体示例 (INSERT 成功):**
```json
{
  "success": true,
  "results": null,
  "rows_affected": 1, // Assuming one row inserted
  "message": "Successfully inserted 1 record."
}
```
**响应体示例 (失败 - 表不存在):**
```json
{
  "success": false,
  "message": "Error executing SQL: relation \"non_existent_table\" does not exist", // Example PostgreSQL error
  "error_code": "DB_TABLE_NOT_FOUND" // Assuming a specific code for this
}
```

**前端展示:**
*   SELECT 成功时: 将 `results` 数据传递给下游处理。
*   INSERT/UPDATE/DELETE 成功时: 显示"成功影响 X 行。"
*   失败时: 显示错误信息："SQL 执行失败: [message] (错误码: [error_code])。"

## XML 语法

```xml
<!-- XML 调用格式，待开发同学提供 -->
<!-- 示例结构 -->
<ExecuteCustomSQL baseId="{{target_base}}">
  <Statement><![CDATA[UPDATE Tasks SET Status = :newStatus WHERE RecordID = :taskId]]></Statement>
  <Parameters>
    <Parameter name="newStatus">Completed</Parameter>
    <Parameter name="taskId">{{upstream.task_record_id}}</Parameter>
  </Parameters>
  <!-- 系统会自动填充 token 和 workspaceID -->
</ExecuteCustomSQL>
```

## Groovy 语法

```groovy
// Groovy 调用格式，待开发同学提供
// 示例结构
def query = "SELECT COUNT(*) as cnt FROM Orders WHERE OrderDate >= :start_date AND Status = 'Shipped'"
def params = [ start_date: workflow.getVariable("reporting_start_date") ]

def sqlResult = engine.execute('ExecuteCustomSQL', [
  base_id: 'base_ecommerce',
  custom_sql_statement: query,
  parameters: params
])

if (sqlResult.success && sqlResult.output.results) {
  println("Shipped orders count: " + sqlResult.output.results[0].cnt)
} else {
  println("Failed to execute custom SQL: " + sqlResult.error.message)
}
```

## 使用案例

*   **复杂数据聚合:** 在一个名为 "订单统计 Base" (`base_id: base_stats`) 中，使用自定义 SQL 查询 `订单表` (Orders) 和 `客户表` (Customers)，按月统计每个客户的总订单金额，并将结果输出。SQL 类似: `SELECT c.CustomerName, strftime('%Y-%m', o.OrderDate) as OrderMonth, SUM(o.TotalAmount) as MonthlyTotal FROM Orders o JOIN Customers c ON o.CustomerID = c.RecordID WHERE o.OrderDate >= :startDate GROUP BY c.CustomerName, OrderMonth;`

## 分类与标签

数据库, Database, SQL, Custom Query, ABS, NocoDB, Data Access, Execute, Raw SQL

## 错误码与异常说明

| 错误码                 | 说明                                                         | 处理建议                                                                                                    |
| :--------------------- | :----------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------- |
| DB000                  | 未知错误                                                     | 查看工作流执行日志，联系平台管理员。                                                                          |
| DB002                  | 身份验证失败 / Token 无效                                     | 检查系统配置的 ABS Token 是否有效或已过期。                                                                  |
| DB005                  | 权限不足                                                     | 确认 Token 具有在目标 Base 上执行该 SQL 所需的数据库内部权限（SELECT/INSERT/UPDATE/DELETE on specific tables）。 |
| DB008                  | 指定的数据库 (Base) 不存在或无权访问                         | 确认传入的 `base_id` 是否正确，以及 Token 是否有权访问该 Base。                                                  |
| DB_SQL_SYNTAX_ERROR    | SQL 语句存在语法错误                                         | 仔细检查 SQL 语法是否符合 ABS/NocoDB 底层数据库方言。                                                             |
| DB_EXECUTION_ERROR     | SQL 执行时发生错误（如表/字段不存在、违反约束、类型错误等）     | 检查 SQL 逻辑、参数值、目标 Base 内的表结构和约束。错误 `message` 通常包含具体数据库错误。                      |
| DB_PARAM_BINDING_ERROR | SQL 参数绑定失败（参数名不匹配、类型错误等）                 | 检查 `parameters` 对象的键名是否与 SQL 中的占位符一致，值类型是否可被接受。                                   |
| NL_TO_SQL_FAILED       | 自然语言生成 SQL 失败                                        | 尝试修改或简化 `generate_sql_prompt`；或者切换为手动编写 SQL。                                                 |
| DB_TABLE_NOT_FOUND     | SQL 中引用的表在 Base 中不存在                              | 确认 SQL 语句中使用的表名是否正确存在于目标 `base_id` 中。                                                     |

## 权限与安全要求 (`permission`)

*   **需要登录:** 是。
*   **涉及敏感操作:** **是，非常敏感**。取决于执行的 SQL 语句和关联 Token 的数据库权限，可能读取、修改或删除数据。存在 SQL 注入风险（需通过参数化缓解）。
*   **具体权限:** Token 需要拥有执行具体 SQL 所需的**数据库内部权限**（SELECT, INSERT, UPDATE, DELETE on specific tables/views within the Base）。平台可能还需要校验用户是否有权对指定的 `base_id` 执行自定义 SQL。
*   **安全要求:** **必须强制使用参数化查询 (`parameters`)，严禁直接拼接 SQL 字符串。** 对允许使用此节点的用户和工作流需严格控制。

## 依赖关系与前置条件 (`dependencies/prerequisites`)

*   **目标 ABS 数据库 (Base):** 必须存在，且可通过 `base_id` 访问。
*   **有效凭证 (Token):** 系统必须能获取到有效的、具有执行 SQL 所需数据库权限的 ABS Token。
*   **Schema 知识:** 用户（或 AI）需了解目标 Base 的模式（表、字段等）。
*   **（可选）上游数据:** 如果 SQL 需要参数，需由前序节点提供。
