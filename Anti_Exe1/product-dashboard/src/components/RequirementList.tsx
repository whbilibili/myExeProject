import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { Requirement } from '../types';
import { Search, Filter, MoreHorizontal, Tag } from 'lucide-react';
import { clsx } from 'clsx';

const RequirementList: React.FC = () => {
    const [requirements, setRequirements] = useState<Requirement[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchRequirements = async () => {
        setLoading(true);
        try {
            const data = await api.getRequirements();
            setRequirements(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequirements();
    }, []);

    const filtered = requirements.filter(r =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.owner.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getPriorityColor = (p: string) => {
        switch (p) {
            case '高': return 'bg-red-50 text-red-600';
            case '中': return 'bg-orange-50 text-orange-600';
            case '低': return 'bg-green-50 text-green-600';
            default: return 'bg-slate-50 text-slate-600';
        }
    };

    const getStatusColor = (s: string) => {
        switch (s) {
            case '已上线': return 'bg-green-500 text-white';
            case '测试中': return 'bg-primary-500 text-white';
            case '开发中': return 'bg-blue-400 text-white';
            case '已评审': return 'bg-purple-400 text-white';
            default: return 'bg-slate-200 text-slate-700';
        }
    };

    return (
        <div className="py-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight">需求明细</h1>
                    <p className="text-slate-500 mt-1">管理和跟踪所有队列中的产品与技术需求</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="搜索需求名称或负责人..."
                            className="pl-11 pr-4 py-2.5 bg-white rounded-2xl border-none shadow-soft focus:ring-2 focus:ring-primary-500/10 w-64 transition-all"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="p-2.5 bg-white rounded-2xl shadow-soft hover:bg-slate-50 transition-all text-slate-600">
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            <div className="soft-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-50">
                                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">需求信息</th>
                                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">类型</th>
                                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">负责人</th>
                                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">优先级</th>
                                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">状态</th>
                                <th className="px-8 py-5 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3 text-slate-400">
                                            <div className="w-8 h-8 border-2 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
                                            <span className="text-sm font-medium">正在加载需求数据...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-20 text-center text-slate-400">
                                        暂无相关需求
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((req) => (
                                    <tr key={req.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-1">
                                                <span className="font-bold text-slate-700 group-hover:text-primary-600 transition-colors">{req.name}</span>
                                                <span className="text-sm text-slate-400 line-clamp-1">{req.description}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                                                <Tag size={14} className="text-slate-300" />
                                                {req.type}
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                                                <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 border border-white">
                                                    {req.owner.substring(0, 2).toUpperCase()}
                                                </div>
                                                {req.owner}
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <span className={clsx("px-3 py-1 rounded-full text-xs font-bold shadow-sm", getPriorityColor(req.priority))}>
                                                {req.priority}
                                            </span>
                                        </td>
                                        <td className="px-6 py-6">
                                            <span className={clsx("px-3 py-1 rounded-full text-xs font-bold shadow-sm", getStatusColor(req.status))}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
                                                <MoreHorizontal size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default RequirementList;
