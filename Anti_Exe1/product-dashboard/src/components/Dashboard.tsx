import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { Stats, Requirement } from '../types';
import {
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { CheckCircle2, Clock, Code2, Rocket, TrendingUp } from 'lucide-react';

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState<Stats | null>(null);
    const [requirements, setRequirements] = useState<Requirement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const [s, data] = await Promise.all([api.getStats(), api.getRequirements()]);
            setStats(s);
            setRequirements(data);
            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading || !stats) {
        return (
            <div className="h-[80vh] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
            </div>
        );
    }

    const statusData = [
        { name: '设计中', value: stats.designing, color: '#94a3b8' },
        { name: '开发中', value: stats.developing, color: '#60a5fa' },
        { name: '测试中', value: stats.testing, color: '#4f70ff' },
        { name: '已上线', value: stats.live, color: '#22c55e' },
    ];

    const typeData = [
        { name: '产品需求', count: requirements.filter(r => r.type === '产品需求').length },
        { name: '技术需求', count: requirements.filter(r => r.type === '技术需求').length },
    ];

    const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
        <div className="soft-card p-6 flex items-start justify-between group">
            <div>
                <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
                <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
                {trend && (
                    <div className="flex items-center gap-1 mt-2 text-xs font-bold text-green-500">
                        <TrendingUp size={12} />
                        <span>{trend}</span>
                    </div>
                )}
            </div>
            <div className={`p-4 rounded-3xl ${color} bg-opacity-10 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className={color.replace('bg-', 'text-')} size={24} />
            </div>
        </div>
    );

    return (
        <div className="py-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-800 tracking-tight">项目概览</h1>
                <p className="text-slate-500 mt-1">实时追踪产品演进与技术迭代状态</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="总需求量" value={stats.total} icon={Clock} color="bg-slate-500" trend="+12% 本月" />
                <StatCard title="开发中" value={stats.developing} icon={Code2} color="bg-primary-500" trend="+2 较昨日" />
                <StatCard title="测试中" value={stats.testing} icon={CheckCircle2} color="bg-blue-400" />
                <StatCard title="已上线" value={stats.live} icon={Rocket} color="bg-green-500" trend="+5 本周" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 soft-card p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="font-bold text-slate-800 text-lg">需求状态分布</h3>
                        <div className="flex gap-4">
                            {statusData.map(d => (
                                <div key={d.name} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                                    <span className="text-xs text-slate-500 font-medium">{d.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={statusData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4f70ff" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#4f70ff" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.1)' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#4f70ff" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="soft-card p-8 flex flex-col items-center justify-center">
                    <h3 className="font-bold text-slate-800 text-lg mb-8 w-full text-left">需求类型占比</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={typeData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={8}
                                    dataKey="count"
                                >
                                    <Cell fill="#4f70ff" />
                                    <Cell fill="#94a3b8" />
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.1)' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 space-y-3 w-full">
                        {typeData.map((d, i) => (
                            <div key={d.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full ${i === 0 ? 'bg-primary-500' : 'bg-slate-400'}`} />
                                    <span className="text-sm font-bold text-slate-700">{d.name}</span>
                                </div>
                                <span className="text-sm font-bold text-slate-500">{Math.round((d.count / (requirements.length || 1)) * 100)}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
