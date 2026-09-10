// EXPORTS: ICopyrightInfo, COPYRIGHT_MAP, RESOURCE_TYPE_LABELS, LICENSE_LABELS
// 课程版权信息映射

export type ResourceOrigin = '自研原创' | '公共资源聚合' | '合规改编';
export type LicenseType = '自研版权' | 'CC BY' | 'CC BY-SA' | 'CC BY-NC' | '公共领域';

export interface ICopyrightInfo {
  lessonId: string;
  origin: ResourceOrigin; // 资源类型
  license: LicenseType; // 授权类型
  source: string; // 来源说明
  commercial: string; // 商用边界
  attribution?: string; // 署名要求
}

export const RESOURCE_TYPE_LABELS: Record<ResourceOrigin, { label: string; color: string; desc: string }> = {
  '自研原创': {
    label: '自研',
    color: 'bg-primary/15 text-primary border-primary/25',
    desc: '智象教研团队原创开发',
  },
  '公共资源聚合': {
    label: '聚合',
    color: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/25',
    desc: '聚合 CC 协议等公共领域教育资源',
  },
  '合规改编': {
    label: '改编',
    color: 'bg-amber-500/15 text-amber-700 border-amber-500/25',
    desc: '基于开源项目/开放资源合规二次开发',
  },
};

export const LICENSE_LABELS: Record<LicenseType, string> = {
  '自研版权': '智象自研版权所有',
  'CC BY': 'Creative Commons 署名 (CC BY 4.0)',
  'CC BY-SA': 'Creative Commons 署名-相同方式共享 (CC BY-SA 4.0)',
  'CC BY-NC': 'Creative Commons 署名-非商业 (CC BY-NC 4.0)',
  '公共领域': '公共领域 (Public Domain)',
};

// 按课程 id 映射的版权信息（示例数据，每课不同）
export const COPYRIGHT_MAP: Record<string, ICopyrightInfo> = {
  'primary-g3-u1-l1': {
    lessonId: 'primary-g3-u1-l1',
    origin: '自研原创',
    license: '自研版权',
    source: '智象教研团队结合《中小学人工智能通识教育指南(2025版)》原创开发',
    commercial: '仅限智象平台授权学校教学使用，禁止商用转售',
    attribution: '智象 AI 通识教育平台',
  },
  'primary-g3-u1-l2': {
    lessonId: 'primary-g3-u1-l2',
    origin: '自研原创',
    license: '自研版权',
    source: '智象教研团队原创开发',
    commercial: '仅限授权学校教学使用',
    attribution: '智象 AI 通识教育平台',
  },
  'primary-g3-u1-l3': {
    lessonId: 'primary-g3-u1-l3',
    origin: '公共资源聚合',
    license: 'CC BY-SA',
    source: '课件改编自 Wikimedia Commons 开放教育资源，实验参考 AI4K12 指南',
    commercial: '非商业用途可自由使用，衍生作品需相同方式共享',
    attribution: '改编自 AI4K12 Initiative · CC BY-SA 4.0',
  },
  'primary-g3-u1-l4': {
    lessonId: 'primary-g3-u1-l4',
    origin: '合规改编',
    license: 'CC BY-NC',
    source: '参考麻省理工学院 K-12 AI 教育项目开源资源改编',
    commercial: '仅限非商业教学使用',
    attribution: '基于 MIT AI Education Project 改编',
  },
  'primary-g4-u2-l1': {
    lessonId: 'primary-g4-u2-l1',
    origin: '自研原创',
    license: '自研版权',
    source: '智象教研团队原创开发',
    commercial: '仅限授权学校教学使用',
    attribution: '智象 AI 通识教育平台',
  },
  'junior-g7-u1-l1': {
    lessonId: 'junior-g7-u1-l1',
    origin: '合规改编',
    license: 'CC BY',
    source: '创意绘画实验参考 Stable Diffusion 开源项目案例改编',
    commercial: '可自由使用和改编，需保留原始版权声明',
    attribution: '参考开源 AI 项目 · CC BY 4.0',
  },
  'junior-g8-u2-l1': {
    lessonId: 'junior-g8-u2-l1',
    origin: '自研原创',
    license: '自研版权',
    source: '智象教研团队结合人教版信息技术教材原创开发',
    commercial: '仅限授权学校教学使用',
    attribution: '智象 AI 通识教育平台',
  },
  'senior-g10-u1-l1': {
    lessonId: 'senior-g10-u1-l1',
    origin: '自研原创',
    license: '自研版权',
    source: '智象教研团队原创开发，参考 Andrew Ng 机器学习课程框架',
    commercial: '仅限授权学校教学使用',
    attribution: '智象 AI 通识教育平台',
  },
  'senior-g11-u2-l1': {
    lessonId: 'senior-g11-u2-l1',
    origin: '公共资源聚合',
    license: 'CC BY-SA',
    source: '伦理案例参考联合国教科文组织 AI 伦理建议书及国内相关法规',
    commercial: '非商业用途可自由使用，衍生作品需相同方式共享',
    attribution: '参考 UNESCO AI Ethics Recommendation',
  },
};

// 默认版权信息（未特别标注的课程使用此默认值）
export const DEFAULT_COPYRIGHT: ICopyrightInfo = {
  lessonId: '',
  origin: '自研原创',
  license: '自研版权',
  source: '智象教研团队结合《中小学人工智能通识教育指南(2025版)》与《安徽省中小学人工智能通识教育课程纲要(2025版)》原创开发',
  commercial: '仅限智象平台授权学校教学使用，禁止商用转售',
  attribution: '智象 AI 通识教育平台',
};

export function getCopyrightInfo(lessonId: string): ICopyrightInfo {
  return COPYRIGHT_MAP[lessonId] || { ...DEFAULT_COPYRIGHT, lessonId };
}

export function getResourceOrigin(lessonId: string): ResourceOrigin {
  return getCopyrightInfo(lessonId).origin;
}
