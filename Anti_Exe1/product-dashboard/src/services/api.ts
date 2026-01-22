import type { Requirement } from '../types';

const STORAGE_KEY = 'requirements_data';

// Helper to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const INITIAL_DATA = [
    {
        id: '1',
        name: '移动端自适应优化',
        type: '产品需求',
        description: '针对平板和手机浏览器进行样式兼容性处理，确保核心看板可以正常显示。',
        priority: '高',
        status: '设计中',
        owner: '张三',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: '2',
        name: '后端API性能压测',
        type: '技术需求',
        description: '对核心接口进行1000QPS下的并发压力测试，输出瓶颈分析报告。',
        priority: '中',
        status: '测试中',
        owner: '李四',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: '3',
        name: 'SSO单点登录集成',
        type: '技术需求',
        description: '对接集团内部账户中心，实现OAuth2.0协议的单点登录功能。',
        priority: '高',
        status: '开发中',
        owner: '王五',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: '4',
        name: '数据导出模块上线',
        type: '产品需求',
        description: '支持将需求明细导出为Excel或PDF格式，方便离线汇报。',
        priority: '低',
        status: '已上线',
        owner: '赵六',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];

export const api = {
    getRequirements: async (): Promise<Requirement[]> => {
        await delay(500);
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
            return INITIAL_DATA as Requirement[];
        }
        return JSON.parse(data);
    },

    addRequirement: async (requirement: Omit<Requirement, 'id' | 'createdAt' | 'updatedAt'>): Promise<Requirement> => {
        await delay(800);
        const requirements = await api.getRequirements();
        const newRequirement: Requirement = {
            ...requirement,
            id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        const updated = [newRequirement, ...requirements];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return newRequirement;
    },

    updateRequirement: async (id: string, updates: Partial<Requirement>): Promise<Requirement> => {
        await delay(500);
        const requirements = await api.getRequirements();
        const index = requirements.findIndex(r => r.id === id);
        if (index === -1) throw new Error('Requirement not found');

        const updatedRequirement = {
            ...requirements[index],
            ...updates,
            updatedAt: new Date().toISOString(),
        };
        requirements[index] = updatedRequirement;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(requirements));
        return updatedRequirement;
    },

    deleteRequirement: async (id: string): Promise<void> => {
        await delay(500);
        const requirements = await api.getRequirements();
        const filtered = requirements.filter(r => r.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    },

    getStats: async () => {
        const requirements = await api.getRequirements();
        return {
            total: requirements.length,
            designing: requirements.filter(r => r.status === '设计中').length,
            developing: requirements.filter(r => r.status === '开发中').length,
            testing: requirements.filter(r => r.status === '测试中').length,
            live: requirements.filter(r => r.status === '已上线').length,
        };
    }
};
