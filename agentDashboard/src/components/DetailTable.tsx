import React, { useState } from 'react';
import { Table, Card, Button, Space, Input, Tooltip, Checkbox, Popover } from 'antd';
import { SearchOutlined, DownloadOutlined, SettingOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Agent } from '../types';
import * as XLSX from 'xlsx';
import dayjs from 'dayjs';

interface DetailTableProps {
  agents: Agent[];
  selectedAgentId?: string | null;
  onAgentSelect: (agent: Agent | null) => void;
}

export const DetailTable: React.FC<DetailTableProps> = ({ agents, selectedAgentId, onAgentSelect }) => {
  const [searchText, setSearchText] = useState('');
  
  // 列定义
  const allColumns: ColumnsType<Agent> = [
    // (A) 标识信息
    { 
        title: '智能体名称', 
        dataIndex: 'name', 
        key: 'name', 
        fixed: 'left',
        width: 180,
        filteredValue: [searchText],
        onFilter: (value, record) => {
            const v = String(value).toLowerCase();
            return record.name.toLowerCase().includes(v) || record.id.toLowerCase().includes(v);
        },
        render: (text) => <a className="font-medium">{text}</a>
    },
    { title: '智能体 ID', dataIndex: 'id', key: 'id', width: 100, ellipsis: true },
    { title: '创建者', dataIndex: 'creator', key: 'creator', width: 100 },
    { title: '所属租户', dataIndex: 'department', key: 'department', width: 100 },
    { title: '类型', dataIndex: 'type', key: 'type', width: 80 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 80 },
    
    // (B) 成本指标
    { 
        title: '总花费 (￥)', 
        dataIndex: 'totalCost', 
        key: 'totalCost', 
        sorter: (a, b) => a.totalCost - b.totalCost,
        defaultSortOrder: 'descend',
        render: (val) => val.toFixed(2),
        width: 120
    },
    { title: '总 Token', dataIndex: 'totalTokens', key: 'totalTokens', sorter: (a, b) => a.totalTokens - b.totalTokens, width: 120 },
    
    // (C) 使用指标
    { title: '总对话轮次', dataIndex: 'totalCalls', key: 'totalCalls', sorter: (a, b) => a.totalCalls - b.totalCalls, width: 120 },
    { title: '活跃用户数', dataIndex: 'activeUsers', key: 'activeUsers', sorter: (a, b) => a.activeUsers - b.activeUsers, width: 120 },
    { title: '人均轮次', dataIndex: 'callsPerUser', key: 'callsPerUser', render: (v) => v.toFixed(1), width: 100 },
    
    // (D) 效率
    { title: '单轮成本 (￥)', dataIndex: 'avgCostPerCall', key: 'avgCostPerCall', sorter: (a, b) => a.avgCostPerCall - b.avgCostPerCall, render: (v) => v.toFixed(4), width: 120 },
    { title: '成功率', dataIndex: 'successRate', key: 'successRate', sorter: (a, b) => a.successRate - b.successRate, render: (v) => `${v.toFixed(1)}%`, width: 100 },
    { title: '平均耗时 (ms)', dataIndex: 'avgLatency', key: 'avgLatency', sorter: (a, b) => a.avgLatency - b.avgLatency, width: 120 },

    // (E) 归因
    { title: '主要模型', dataIndex: 'primaryModel', key: 'primaryModel', width: 120 },
    { title: '最后运行', dataIndex: 'lastUsedDate', key: 'lastUsedDate', width: 150 },
  ];

  // 默认显示的列 Keys
  const defaultVisibleKeys = [
      'name', 'totalCost', 'totalCalls', 'avgCostPerCall', 'successRate', 
      'creator', 'type', 'status', 'primaryModel', 'lastUsedDate'
  ];

  const [visibleKeys, setVisibleKeys] = useState<string[]>(defaultVisibleKeys);

  // 过滤可见列
  const columns = allColumns.filter(col => visibleKeys.includes(col.key as string));

  // 导出功能
  const handleExport = () => {
      const ws = XLSX.utils.json_to_sheet(agents);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Agents");
      const filename = `Agent_Analysis_${dayjs().format('YYYYMMDD_HHmmss')}.xlsx`;
      XLSX.writeFile(wb, filename);
  };

  // 自定义列内容
  const columnSelector = (
      <div className="w-[200px] max-h-[300px] overflow-y-auto">
          <Checkbox.Group 
            style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
            value={visibleKeys}
            onChange={(list) => setVisibleKeys(list as string[])}
          >
              {allColumns.map(col => (
                  <Checkbox key={col.key} value={col.key} disabled={col.key === 'name'}>
                      {col.title as string}
                  </Checkbox>
              ))}
          </Checkbox.Group>
      </div>
  );

  return (
    <div id="table" className="mb-8">
        <Card 
            title="📋 智能体详细数据表" 
            className="rounded-lg shadow-none border border-[#DEE0E3]" 
            extra={
                <Space>
                    <Input 
                        placeholder="搜索智能体..." 
                        prefix={<SearchOutlined />} 
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                        style={{ width: 200 }}
                    />
                    
                    <Popover content={columnSelector} title="显示列" trigger="click" placement="bottomRight">
                        <Button icon={<SettingOutlined />}>列设置</Button>
                    </Popover>

                    <Button type="primary" icon={<DownloadOutlined />} onClick={handleExport}>
                        导出 Excel
                    </Button>
                </Space>
            }
        >
            <Table 
                columns={columns} 
                dataSource={agents} 
                rowKey="id"
                scroll={{ x: 1500 }}
                onRow={(record) => ({
                    onClick: () => {
                        // Toggle selection
                        onAgentSelect(selectedAgentId === record.id ? null : record);
                    },
                    style: {
                        cursor: 'pointer',
                        backgroundColor: selectedAgentId === record.id ? '#e6f7ff' : undefined
                    }
                })}
                pagination={{ defaultPageSize: 10, showSizeChanger: true }}
            />
        </Card>
    </div>
  );
};

