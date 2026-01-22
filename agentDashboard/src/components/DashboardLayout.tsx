import React, { ReactNode } from 'react';
import { Layout, theme, Typography, BackTop } from 'antd';
import { UpOutlined } from '@ant-design/icons';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

interface DashboardLayoutProps {
  children: ReactNode;
}

const NAV_ITEMS = [
  { key: 'kpi', label: '关键指标', href: '#kpi' },
  { key: 'trend', label: '趋势分析', href: '#trend' },
  { key: 'quadrant', label: '成本使用', href: '#quadrant' },
  { key: 'histogram', label: '群体分布', href: '#histogram' },
  { key: 'table', label: '详细数据', href: '#table' },
];

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      // Offset for sticky header
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <Layout className="min-h-screen bg-[#F5F6F7]">
      <Header 
        style={{ 
          position: 'sticky', 
          top: 0, 
          zIndex: 50, 
          width: '100%', 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#FFFFFF',
          borderBottom: '1px solid #DEE0E3',
          padding: '0 24px',
          height: '60px',
          boxShadow: 'none'
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#3370FF] rounded-md flex items-center justify-center text-white font-bold">
            A
          </div>
          <Title level={4} style={{ margin: 0, color: '#1F2329', fontSize: '16px', fontWeight: 600 }}>智能体运营报表</Title>
        </div>
        <div className="hidden md:flex gap-1">
          {NAV_ITEMS.map(item => (
            <a 
              key={item.key} 
              href={item.href}
              onClick={(e) => handleScroll(e, item.href)}
              className="text-[#646A73] hover:text-[#3370FF] hover:bg-[#EFF0F1] px-3 py-1.5 rounded-[4px] transition-all text-sm font-medium"
            >
              {item.label}
            </a>
          ))}
        </div>
      </Header>
      <Content style={{ padding: '24px 32px', maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
        {children}
      </Content>
      <Footer style={{ textAlign: 'center', background: 'transparent', color: '#9ca3af' }}>
        Agent Analytics Dashboard ©{new Date().getFullYear()} Created by AI
      </Footer>
    </Layout>
  );
};
