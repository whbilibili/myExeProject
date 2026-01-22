export type RequirementType = '产品需求' | '技术需求';

export type Priority = '高' | '中' | '低';

export type RequirementStatus = '设计中' | '已评审' | '开发中' | '测试中' | '已上线';

export interface Requirement {
    id: string;
    name: string;
    type: RequirementType;
    description: string;
    priority: Priority;
    status: RequirementStatus;
    owner: string;
    createdAt: string;
    updatedAt: string;
}

export interface Stats {
    total: number;
    designing: number;
    developing: number;
    testing: number;
    live: number;
}
