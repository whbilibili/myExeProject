import React from 'react';
import { LayoutDashboard, ListTodo, PlusCircle, Settings, LogOut } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
    const menuItems = [
        { id: 'dashboard', label: '仪表盘', icon: LayoutDashboard },
        { id: 'list', label: '需求明细', icon: ListTodo },
        { id: 'form', label: '新增需求', icon: PlusCircle },
    ];

    return (
        <div className="w-72 h-screen flex flex-col bg-white border-r border-slate-100 p-6">
            <div className="flex items-center gap-3 px-2 mb-10">
                <div className="w-10 h-10 bg-primary-500 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30 text-white">
                    <LayoutDashboard size={24} />
                </div>
                <span className="text-xl font-bold tracking-tight text-slate-800">ReqHub</span>
            </div>

            <nav className="flex-1 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={twMerge(
                                clsx(
                                    "w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group",
                                    isActive
                                        ? "bg-primary-50 text-primary-500 shadow-sm"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                                )
                            )}
                        >
                            <Icon size={20} className={clsx(isActive ? "text-primary-500" : "text-slate-400 group-hover:text-slate-600")} />
                            <span className="font-medium">{item.label}</span>
                            {isActive && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500 shadow-lg shadow-primary-500/50" />
                            )}
                        </button>
                    );
                })}
            </nav>

            <div className="mt-auto space-y-2">
                <button className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all">
                    <Settings size={20} />
                    <span className="font-medium">设置</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all">
                    <LogOut size={20} />
                    <span className="font-medium">退出</span>
                </button>

                <div className="mt-6 p-4 bg-primary-50 rounded-3xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-primary-100">
                        <span className="text-sm font-bold text-primary-500">WH</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800">Wang Hong</span>
                        <span className="text-xs text-slate-500">管理员</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
