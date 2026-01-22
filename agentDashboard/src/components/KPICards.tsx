import React from 'react';
import { Tooltip } from 'antd';
import { 
  InfoCircleOutlined, 
  PayCircleOutlined, 
  DatabaseOutlined, 
  MessageOutlined,
  RiseOutlined,
  CheckCircleOutlined,
  RocketOutlined,
  FireOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import type { DashboardData } from '../types';

interface KPICardsProps {
  data: DashboardData['totalMetrics'];
}

// 格式化数字，增加千分位
const formatNumber = (num: number, precision: number = 0) => {
  return new Intl.NumberFormat('en-US', { 
    minimumFractionDigits: precision,
    maximumFractionDigits: precision 
  }).format(num);
};

const KPIItem = ({ 
  title, 
  value, 
  prefix, 
  suffix, 
  tooltip,
  icon,
  iconColor = "text-[#3370FF]",
  bgClass = "bg-[#E1EAFF]"
}: { 
  title: string; 
  value: string | number; 
  prefix?: React.ReactNode; 
  suffix?: string; 
  tooltip?: string;
  icon?: React.ReactNode;
  iconColor?: string;
  bgClass?: string;
}) => (
  <div className="bg-white p-5 rounded-lg border border-[#DEE0E3] hover:border-[#3370FF] hover:shadow-md transition-all duration-200 flex flex-col justify-between h-[120px] group cursor-default">
    
    {/* 头部：图标与标题 */}
    <div className="flex items-center gap-3 mb-2">
         {icon && (
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${bgClass} ${iconColor} bg-opacity-40`}>
                {icon}
            </div>
        )}
        <div className="flex items-center gap-1.5">
          <span className="text-[14px] text-[#646A73] font-medium">{title}</span>
          {tooltip && (
            <Tooltip title={tooltip} placement="top">
              <InfoCircleOutlined className="text-[#8F959E] hover:text-[#646A73] cursor-help transition-colors text-xs" />
            </Tooltip>
          )}
        </div>
    </div>
    
    {/* 数值区域 */}
    <div>
        <div className="flex items-baseline">
            {prefix && <span className="text-lg text-[#1F2329] mr-1 font-bold">{prefix}</span>}
            <span className="text-[26px] font-bold text-[#1F2329] tracking-tight font-sans leading-none">
                {value}
            </span>
            {suffix && <span className="text-sm text-[#646A73] ml-2 font-normal">{suffix}</span>}
        </div>
    </div>
  </div>
);

const RankingItem = ({
    label,
    value,
    icon,
    colorClass
}: {
    label: string;
    value: string;
    icon: React.ReactNode;
    colorClass: string;
}) => (
    <div className="flex items-center justify-between p-2.5 rounded-md hover:bg-[#F5F6F7] transition-colors cursor-default">
        <div className="flex items-center gap-3 overflow-hidden">
            <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm ${colorClass} bg-opacity-10`}>
                {icon}
            </div>
            <div className="flex flex-col overflow-hidden">
                <span className="text-xs text-[#8F959E] scale-90 origin-left">{label}</span>
                <span className="text-sm font-semibold text-[#1F2329] truncate max-w-[120px]">{value}</span>
            </div>
        </div>
    </div>
);

export const KPICards: React.FC<KPICardsProps> = ({ data }) => {
  return (
    <div id="kpi" className="mb-6">
      <h2 className="text-[16px] font-bold mb-4 flex items-center gap-2 text-[#1F2329]">
        运营概览
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 第一行：核心规模指标 */}
        <KPIItem 
          title="活跃智能体" 
          value={formatNumber(data.activeAgents)}
          tooltip="在选定时间内，至少产生过1轮对话的智能体总数"
          suffix="个"
          icon={<RocketOutlined />}
          iconColor="text-[#3370FF]"
          bgClass="bg-[#E1EAFF]"
        />
        <KPIItem 
          title="总花费" 
          value={formatNumber(data.totalCost, 2)}
          prefix="¥"
          tooltip="所有智能体消耗的 Token 总成本"
          icon={<PayCircleOutlined />}
          iconColor="text-[#00B69B]"
          bgClass="bg-[#DFFBF6]"
        />
        <KPIItem 
          title="总 Token 消耗" 
          value={formatNumber(data.totalTokens / 1000000, 2)}
          suffix="M" 
          tooltip="所有智能体的 Token 总消耗 (单位: 百万)"
          icon={<DatabaseOutlined />}
          iconColor="text-[#3370FF]"
          bgClass="bg-[#E1EAFF]"
        />
        <KPIItem 
          title="总对话轮次" 
          value={formatNumber(data.totalCalls)}
          tooltip="所有智能体被调用的总次数"
          suffix="次"
          icon={<MessageOutlined />}
          iconColor="text-[#7C3AED]"
          bgClass="bg-[#F3E8FF]"
        />

        {/* 第二行：效率与质量指标 */}
        <KPIItem 
          title="平均单轮成本" 
          value={formatNumber(data.avgCostPerCall, 4)}
          prefix="¥"
          tooltip="智能体总花费 / 智能体总对话轮次"
          icon={<RiseOutlined />}
          iconColor="text-[#F97316]"
          bgClass="bg-[#FFEDD5]"
        />
        <KPIItem 
          title="平均单轮 Token" 
          value={formatNumber(data.avgTokensPerCall)}
          tooltip="智能体总Token消耗 / 智能体总对话轮次"
          icon={<DatabaseOutlined />}
          iconColor="text-[#06B6D4]"
          bgClass="bg-[#CFFAFE]"
        />
        <KPIItem 
          title="调用成功率" 
          value={data.platformSuccessRate.toFixed(1)}
          suffix="%"
          tooltip="所有智能体调用的总成功次数 / 总对话轮次"
          icon={<CheckCircleOutlined />}
          iconColor={data.platformSuccessRate > 90 ? "text-[#00B69B]" : "text-[#F59E0B]"}
          bgClass={data.platformSuccessRate > 90 ? "bg-[#DFFBF6]" : "bg-[#FEF3C7]"}
        />
        
        {/* 特殊卡片：榜单摘要 */}
        <div className="bg-white p-4 rounded-lg border border-[#DEE0E3] hover:border-[#3370FF] hover:shadow-md transition-all duration-200 flex flex-col justify-center h-[120px]">
            <div className="flex flex-col gap-1">
                <RankingItem 
                    label="成本最高" 
                    value={data.mostExpensiveAgent} 
                    icon={<FireOutlined />}
                    colorClass="text-[#F54A45] bg-[#FEECEA]"
                />
                <RankingItem 
                    label="最活跃" 
                    value={data.mostUsedAgent} 
                    icon={<TrophyOutlined />}
                    colorClass="text-[#FF8800] bg-[#FFF3D8]"
                />
            </div>
        </div>
      </div>
    </div>
  );
};
