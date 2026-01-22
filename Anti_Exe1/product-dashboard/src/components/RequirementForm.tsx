import React, { useState } from 'react';
import { api } from '../services/api';
import type { RequirementType, Priority, RequirementStatus } from '../types';
import { Send, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';

interface RequirementFormProps {
    onSuccess: () => void;
}

const RequirementForm: React.FC<RequirementFormProps> = ({ onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        type: '产品需求' as RequirementType,
        description: '',
        priority: '中' as Priority,
        status: '设计中' as RequirementStatus,
        owner: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.addRequirement(formData);
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                setFormData({
                    name: '',
                    type: '产品需求',
                    description: '',
                    priority: '中',
                    status: '设计中',
                    owner: '',
                });
                onSuccess();
            }, 2000);
        } catch (error) {
            console.error('Failed to add requirement', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-8">
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-slate-800 mb-2 tracking-tight">收集新需求</h1>
                <p className="text-slate-500">完善下方表单以提交您的产品或技术需求</p>
            </div>

            <form onSubmit={handleSubmit} className="soft-card p-10 relative overflow-hidden">
                <AnimatePresence>
                    {success && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-white/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center"
                        >
                            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white mb-4 shadow-lg shadow-green-500/30">
                                <CheckCircle2 size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">提交成功!</h3>
                            <p className="text-slate-500">您的需求已成功加入系统</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 ml-1">需求名称</label>
                        <input
                            required
                            type="text"
                            placeholder="请输入清晰简洁的需求名称"
                            className="w-full input-field"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 ml-1">需求类型</label>
                            <select
                                className="w-full input-field appearance-none"
                                value={formData.type}
                                onChange={e => setFormData({ ...formData, type: e.target.value as RequirementType })}
                            >
                                <option value="产品需求">产品需求</option>
                                <option value="技术需求">技术需求</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 ml-1">负责人</label>
                            <input
                                required
                                type="text"
                                placeholder="负责人姓名"
                                className="w-full input-field"
                                value={formData.owner}
                                onChange={e => setFormData({ ...formData, owner: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 ml-1">需求描述</label>
                        <textarea
                            required
                            rows={4}
                            placeholder="详细描述需求背景、目标和预期效果"
                            className="w-full input-field resize-none"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 ml-1">优先级</label>
                            <div className="flex gap-2">
                                {(['高', '中', '低'] as Priority[]).map(p => (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, priority: p })}
                                        className={twMerge(
                                            clsx(
                                                "flex-1 py-2.5 rounded-xl text-sm font-medium transition-all",
                                                formData.priority === p
                                                    ? "bg-primary-500 text-white shadow-md shadow-primary-500/20"
                                                    : "bg-surface-50 text-slate-500 hover:bg-slate-100"
                                            )
                                        )}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 ml-1">当前状态</label>
                            <select
                                className="w-full input-field appearance-none"
                                value={formData.status}
                                onChange={e => setFormData({ ...formData, status: e.target.value as RequirementStatus })}
                            >
                                <option value="设计中">设计中</option>
                                <option value="已评审">已评审</option>
                                <option value="开发中">开发中</option>
                                <option value="测试中">测试中</option>
                                <option value="已上线">已上线</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full btn-primary flex items-center justify-center gap-2 group disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    <span>提交需求</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default RequirementForm;
