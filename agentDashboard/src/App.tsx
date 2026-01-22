import React, { useState, useMemo } from 'react';
import { ConfigProvider, Card } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import dayjs from 'dayjs';
import { DashboardLayout } from './components/DashboardLayout';
import { GlobalFilter, type FilterState } from './components/GlobalFilter';
import { KPICards } from './components/KPICards';
import { TrendChart } from './components/TrendChart';
import { QuadrantChart } from './components/QuadrantChart';
import { QuadrantSummary, AgentDetailDrawer } from './components/QuadrantSidebar';
import { HistogramChart } from './components/HistogramChart';
import { DetailTable } from './components/DetailTable';
import { generateMockData } from './mock';
import type { Agent } from './types';

// Generate data once
const RAW_DATA = generateMockData();
const ALL_TENANTS = Array.from(new Set(RAW_DATA.agents.map(a => a.department)));

const App: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    dateRange: [dayjs().subtract(29, 'day'), dayjs()],
    selectedTenants: [],
  });

  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    // Clear selection when filters change
    setSelectedAgentId(null);
  };

  // Filter Data
  const { filteredAgents, filteredDailyData, kpiData } = useMemo(() => {
      // 1. Filter Agents by Tenant
      let agents = RAW_DATA.agents;
      if (filters.selectedTenants.length > 0) {
          agents = agents.filter(a => filters.selectedTenants.includes(a.department));
      }

      // 2. Filter Daily Data by Date Range & Tenant
      let dailyData = RAW_DATA.dailyTrend;
      const [start, end] = filters.dateRange;
      
      dailyData = dailyData.filter(d => {
          const dDate = dayjs(d.date);
          const inDate = dDate.isAfter(start.subtract(1, 'day')) && dDate.isBefore(end.add(1, 'day'));
          const inTenant = filters.selectedTenants.length === 0 || 
                           agents.some(a => a.id === d.agentId); // simplified check
          return inDate && inTenant;
      });

      // Re-calculate KPI for filtered set (Simplified re-calc)
      // In real app, this would be backend aggregation
      const totalCost = agents.reduce((s, a) => s + a.totalCost, 0);
      const totalCalls = agents.reduce((s, a) => s + a.totalCalls, 0);
      const totalTokens = agents.reduce((s, a) => s + a.totalTokens, 0);
      const successCalls = agents.reduce((s, a) => s + (a.totalCalls * a.successRate / 100), 0);
      
      const newKpi = {
          ...RAW_DATA.totalMetrics,
          activeAgents: agents.filter(a => a.totalCalls > 0).length,
          totalCost,
          totalTokens,
          totalCalls,
          avgCostPerCall: totalCalls ? totalCost / totalCalls : 0,
          avgTokensPerCall: totalCalls ? totalTokens / totalCalls : 0,
          platformSuccessRate: totalCalls ? (successCalls / totalCalls) * 100 : 0,
      };

      return { filteredAgents: agents, filteredDailyData: dailyData, kpiData: newKpi };
  }, [filters]);

  const selectedAgent = useMemo(() => 
    selectedAgentId ? filteredAgents.find(a => a.id === selectedAgentId) || null : null, 
  [selectedAgentId, filteredAgents]);

  // Calculate Medians for Quadrant Chart
  const { medianCalls, medianCost } = useMemo(() => {
      if (filteredAgents.length === 0) return { medianCalls: 0, medianCost: 0 };
      const calls = [...filteredAgents].map(a => a.totalCalls).sort((a,b) => a-b);
      const costs = [...filteredAgents].map(a => a.avgCostPerCall).sort((a,b) => a-b);
      const mid = Math.floor(calls.length / 2);
      return { medianCalls: calls[mid], medianCost: costs[mid] };
  }, [filteredAgents]);

  return (
    <ConfigProvider locale={zhCN}>
      <DashboardLayout>
        
        {/* 1. Global Filter */}
        <GlobalFilter 
            filters={filters} 
            onFilterChange={handleFilterChange} 
            allTenants={ALL_TENANTS} 
        />

        {/* 2. KPI Cards */}
        <KPICards data={kpiData} />

        {/* 3. Trend Chart */}
        <TrendChart dailyData={filteredDailyData} />

        {/* 4. Quadrant Analysis - New Layout */}
        <div id="quadrant" className="mb-8">
             <Card title="📊 智能体成本 vs. 使用情况 (四象限分析)" className="rounded-lg shadow-none border border-[#DEE0E3]">
                <div className="h-[500px] w-full">
                    <QuadrantChart 
                        agents={filteredAgents} 
                        onAgentSelect={(a) => setSelectedAgentId(a?.id || null)}
                        selectedAgentId={selectedAgentId}
                    />
                </div>
                
                {/* Summary Cards below chart */}
                <div className="mt-4 border-t border-gray-100 pt-6 px-2 pb-2">
                    <QuadrantSummary 
                        agents={filteredAgents}
                        medianCalls={medianCalls}
                        medianCost={medianCost}
                    />
      </div>
             </Card>
      </div>

        {/* 5. Histogram */}
        <HistogramChart agents={filteredAgents} />

        {/* 6. Detail Table */}
        <DetailTable 
            agents={filteredAgents} 
            selectedAgentId={selectedAgentId} 
            onAgentSelect={(a) => setSelectedAgentId(a?.id || null)}
        />

        {/* Drawer for Detail View */}
        <AgentDetailDrawer 
            selectedAgent={selectedAgent}
            onClose={() => setSelectedAgentId(null)}
        />

      </DashboardLayout>
    </ConfigProvider>
  );
};

export default App;
