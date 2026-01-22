import React from 'react';
import { DatePicker, Select, Space, Card } from 'antd';
import dayjs, { Dayjs } from 'dayjs';

const { RangePicker } = DatePicker;

export interface FilterState {
  dateRange: [Dayjs, Dayjs];
  selectedTenants: string[];
}

interface GlobalFilterProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  allTenants: string[];
}

const RANGE_PRESETS: { label: string; value: [Dayjs, Dayjs] }[] = [
  { label: '今天', value: [dayjs(), dayjs()] },
  { label: '最近7天', value: [dayjs().subtract(6, 'day'), dayjs()] },
  { label: '最近一个月', value: [dayjs().subtract(29, 'day'), dayjs()] },
  { label: '最近180天', value: [dayjs().subtract(179, 'day'), dayjs()] },
  { label: '最近一年', value: [dayjs().subtract(1, 'year'), dayjs()] },
];

export const GlobalFilter: React.FC<GlobalFilterProps> = ({ 
  filters, 
  onFilterChange, 
  allTenants 
}) => {
  return (
    <Card className="mb-6 shadow-none rounded-lg border border-[#DEE0E3]" bodyStyle={{ padding: '20px 24px' }}>
      <Space size="large" wrap>
        <Space direction="vertical" size="small">
          <span className="font-bold text-gray-700">时间范围</span>
          <RangePicker 
            presets={RANGE_PRESETS}
            value={filters.dateRange}
            onChange={(dates) => {
              if (dates && dates[0] && dates[1]) {
                onFilterChange({ dateRange: [dates[0], dates[1]] });
              }
            }}
            allowClear={false}
          />
        </Space>

        <Space direction="vertical" size="small">
          <span className="font-bold text-gray-700">租户 (Tenant)</span>
          <Select
            mode="multiple"
            allowClear
            style={{ width: 300 }}
            placeholder="所有租户"
            value={filters.selectedTenants}
            onChange={(value) => onFilterChange({ selectedTenants: value })}
            options={allTenants.map(t => ({ label: t, value: t }))}
            maxTagCount="responsive"
          />
        </Space>
      </Space>
    </Card>
  );
};

