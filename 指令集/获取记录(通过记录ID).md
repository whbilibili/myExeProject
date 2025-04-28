【设计中】官方指令 - 获取指定记录 - V1.0.0

## 指令名称

GetRecordById / 获取指定记录

## 功能描述

根据提供的一个或多个记录 ID (`record_id`)，从指定的 ABS 数据表（由 `base_id` 和 `table_id` 标识）中精确获取对应的完整记录信息。

## 使用说明

1.  在工作流画布中添加"获取指定记录"节点。
2.  配置节点的输入参数，需要提供：
    *   **所属数据库 Base ID (`base_id`) (必填):** 目标数据表所在的 ABS 数据库的 ID。
    *   **目标数据表 Table ID (`table_id`) (必填):** 要获取记录的数据表的 ID。
    *   **记录 ID 列表 (`record_ids`) (必填):** 一个包含要获取的记录的唯一 ID 的数组。例如：`["rec_abc111", "rec_def222"]`。
    *   **（可选）返回字段 (`fields`):** 指定要返回的字段（列）名称或 ID 列表。如果为空，则返回所有可见字段。
3.  将节点的输入连接到前序节点（获取 `base_id`, `table_id`, `record_ids` 等）。
4.  将节点的输出 (`records` 列表等）连接到需要使用这些记录数据的后续节点。
5.  执行工作流。
6.  后续节点处理返回的记录数据。

## 注意事项

*   **权限:** 执行此操作需要在目标 ABS 数据表上拥有**读取**记录的权限。系统传递的 `token` 必须具有此权限。
*   **记录存在性:** 只有当提供的 `record_id` 对应的记录存在时，才能获取到该记录。如果列表中的某些 ID 不存在，响应中将只包含找到的记录，并可能在 `errors` 字段中提示未找到的 ID。
*   **ID 准确性:** 确保提供的 `record_ids` 列表中的 ID 是正确的。
*   **返回字段:** 使用 `fields` 参数可以减少不必要的数据传输，提高效率。
*   **数据量限制:** 虽然是按 ID 获取，但如果一次请求的 ID 数量过多，仍可能受到平台对单次请求返回数据量的限制。

## 适用场景

*   当你已经通过其他方式（如 `AddRecord`/`UpdateRecord` 的输出，或 `GetRecords` 查询）获得了**具体的记录 ID**，并需要获取这些记录的**详细信息**时。
*   在工作流中需要精确操作某几条已知记录之前，先获取它们的最新状态。
*   根据外部系统传入的记录 ID 来查找并处理 ABS 中的对应数据。

## 入参

| 参数名        | 参数说明                                                                     | 是否必填 | 用户是否配置 |
| :------------ | :--------------------------------------------------------------------------- | :------- | :----------- |
| base_id       | 所属 ABS 数据库的 Base ID                                                    | 是       | 是           |
| table_id      | 目标 ABS 数据表的 Table ID                                                   | 是       | 是           |
| record_ids    | 要获取的记录 ID 数组。例：`["rec_abc111", "rec_def222"]`                       | 是       | 是           |
| fields        | (可选) 指定要返回的字段名/ID 数组。如果为空，则返回所有可见字段。              | 否       | 是           |
| token         | ABS 调用令牌                                                                 | 是       | 否 (系统获取)|
| workspaceID   | 对应的 ABS 空间 ID （可能需要用于 API 调用上下文）                         | 是       | 否 (系统获取)|

**请求体示例 (获取两条指定记录的特定字段):**
```json
{
  "base_id": "base_xyz789",
  "table_id": "tbl_abc123",
  "record_ids": ["rec_abc111", "rec_def222"],
  "fields": ["任务名称", "状态", "负责人"]
}
```

## 出参

| 参数名              | 参数说明                                                                                                 |
| :------------------ | :------------------------------------------------------------------------------------------------------- |
| `success`           | 布尔值，指示操作是否成功执行（即使部分 ID 未找到，只要请求本身没问题，也可能为 true）。                        |
| `records`           | (如果 `success` 为 true) 包含成功获取到的记录对象的数组。数组顺序可能与输入 `record_ids` 顺序对应，也可能不对应。 |
| `found_count`       | 成功找到并返回的记录数量。                                                                                 |
| `errors`            | (可选) 如果输入的 `record_ids` 中有未找到或获取失败的 ID，这里可能包含相关信息。                             |
| `message`           | 操作结果的总体消息。                                                                                       |
| `error_code`        | (如果 `success` 为 false) 对应错误码与异常说明部分的错误代码。                                               |

**响应体示例 (全部找到):**
```json
{
  "success": true,
  "records": [
    {
      "record_id": "rec_abc111",
      "任务名称": "设计新版 Logo",
      "状态": "已完成",
      "负责人": ["user_id_456"]
    },
    {
      "record_id": "rec_def222",
      "任务名称": "准备周会报告",
      "状态": "进行中",
      "负责人": ["user_id_123"]
    }
  ],
  "found_count": 2,
  "errors": [],
  "message": "Successfully retrieved 2 records."
}
```
**响应体示例 (部分找到):**
```json
{
  "success": true, // 操作本身成功，但不是所有 ID 都找到了
  "records": [
    {
      "record_id": "rec_abc111",
      "任务名称": "设计新版 Logo",
      "状态": "已完成",
      "负责人": ["user_id_456"]
    }
    // rec_nonexistent 没有返回
  ],
  "found_count": 1,
  "errors": [
    {
      "record_id": "rec_nonexistent",
      "error_code": "DB022",
      "message": "Record not found."
    }
  ],
  "message": "Successfully retrieved 1 out of 2 requested records."
}
```
**响应体示例 (失败 - 权限不足):**
```json
{
  "success": false,
  "records": [],
  "found_count": 0,
  "errors": [],
  "message": "Error retrieving records: Permission denied.",
  "error_code": "DB005"
}
```

**前端展示:**
*   成功时，将 `records` 数据传递给下游节点。可选择性提示 "成功获取 X 条记录"。
*   失败时显示错误信息："获取记录失败: [message] (错误码: [error_code])。"

## XML 语法

```xml
<!-- XML 调用格式，待开发同学提供 -->
<!-- 示例结构 -->
<GetRecordById baseId="{{base_id}}" tableId="{{table_id}}">
  <RecordIds>
    <Id>{{record_id_from_upstream}}</Id>
    <Id>rec_def222</Id>
  </RecordIds>
  <Fields>
    <Field>任务名称</Field>
    <Field>状态</Field>
  </Fields>
  <!-- 系统会自动填充 token 和 workspaceID -->
</GetRecordById>
```

## Groovy 语法

```groovy
// Groovy 调用格式，待开发同学提供
// 示例结构
def recordIdsToFetch = ["rec_abc111", workflow.getVariable("last_updated_record_id")]

def getResult = engine.execute('GetRecordById', [
  base_id: 'base_xyz789',
  table_id: 'tbl_abc123',
  record_ids: recordIdsToFetch,
  fields: ["状态", "负责人"] // Only fetch specific fields
])

if (getResult.success) {
  println("Found ${getResult.output.found_count} records.")
  getResult.output.records.each { record ->
    println("Record ${record.record_id}: Status=${record.'状态'}, Assignee=${record.'负责人'}")
    // Process record data
  }
  if (getResult.output.errors) {
      getResult.output.errors.each { err -> println("Warning: Could not find record ${err.record_id}") }
  }
} else {
  println("Failed to get records by ID: " + getResult.error.message)
}
```

## 使用案例

*   **更新后获取完整信息:** 工作流先调用 `UpdateRecord` 更新了某条记录的"状态"字段（该指令现在也返回完整记录了，但假设之前的版本不返回），然后需要获取该记录更新后的**所有**信息（包括其他未修改的字段）以进行下一步处理，此时可以使用 `GetRecordById` 指令，传入更新操作返回的 `record_id` 来获取完整的记录数据。
*   **关联数据展示:** 在一个订单处理流程中，通过 `GetRecords` 找到了符合条件的订单记录（只查询了订单号和客户 ID），然后需要根据客户 ID 列表，调用 `GetRecordById` 从"客户信息表"中获取这些客户的详细联系方式。

## 分类与标签

数据库, Database, 数据表, Table, ABS, 读取, 查询, 获取, 指定 ID, Get, By ID, Record, Data Management, CR**U**D (Read)

## 错误码与异常说明

| 错误码 | 说明                                             | 处理建议                                                                                               |
| :----- | :----------------------------------------------- | :----------------------------------------------------------------------------------------------------- |
| DB000  | 未知错误                                         | 查看日志，联系管理员。                                                                                 |
| DB002  | 身份验证失败                                     | 检查 Token。                                                                                           |
| DB005  | 权限不足 (读取记录)                                | 确认凭证权限。                                                                                         |
| DB008  | 指定的数据库 (Base) 不存在或无权访问             | 确认 `base_id`。                                                                                       |
| DB010  | 指定的数据表在数据库 (Base) 中未找到             | 确认 `table_id`。                                                                                      |
| DB019  | 指定的返回字段 (`fields`) 无效                   | 检查 `fields` 数组中的字段名或 ID 是否在目标表中存在。                                                 |
| DB022  | (记录级) 输入的 `record_ids` 中有部分或全部未找到 | (批量时出现在 `errors` 数组中) 确认要获取的记录 ID 是否有效且存在。通常不表示指令执行失败，需检查 `found_count`。 |
| DB026  | (请求级) 请求的 ID 数量过多                      | 减少单次 `record_ids` 数组的大小，分批请求。 可能导致 `success: false`。                                |
| DB027  | (提示性) 部分记录获取成功，部分未找到或失败        | (非错误码，体现在 `success: true`, `found_count` > 0, 且 `errors` 数组非空) 必须检查 `errors` 数组获取失败详情。 |

## 权限与安全要求 (`permission`)

*   **需要登录:** 是。
*   **涉及敏感操作:** 可能。取决于所读取的数据是否包含敏感信息。指令本身是数据读取操作。
*   **具体权限:** 需要对目标 ABS 数据表拥有**读取**权限 (具体权限名称依 ABS 平台定义)。
*   **数据安全:** 返回的数据可能包含敏感信息，下游节点处理时需注意安全。

## 依赖关系与前置条件 (`dependencies/prerequisites`)

*   **目标 ABS 数据库 (Base) 和数据表:** 必须存在，且可通过 `base_id` 和 `table_id` 访问。
*   **有效凭证:** 系统必须能够获取到有效的、具有读取目标表权限的 ABS Token。
*   **有效记录 ID:** 必须提供一个或多个有效的 `record_id`。这些 ID 通常来自前序步骤的输出。
