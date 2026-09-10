// EXPORTS: IZhixiangHardware, ZHIXIANG_HARDWARE_LIST

import type { HardwareType } from './types';

/**
 * 智象自有品牌硬件（预留 / 规划中）
 *
 * 本文件定义智象自有硬件产品线，用于硬件生态页展示。
 * 当前为产品规划阶段，显示"即将推出"状态。
 */

export interface IZhixiangHardware {
  id: string;
  name: string;
  codeName: string;   // 产品代号
  type: HardwareType;
  tagline: string;    // 一句话定位
  description: string;
  targetPrice: string; // 目标价格区间
  expectedLaunch: string; // 预计上市时间
  coreFeatures: string[];
  targetStages: ('primary' | 'junior' | 'senior')[];
  benchmark: string;  // 对标产品
  status: 'planned' | 'developing' | 'beta' | 'released';
  notifyEnabled: boolean; // 是否开启"通知我"
}

export const ZHIXIANG_HARDWARE_LIST: IZhixiangHardware[] = [
  {
    id: 'zx-mainboard',
    name: '智象 AI 主控板',
    codeName: 'ZhiXiang Board',
    type: 'MainControlBoard',
    tagline: '专为 AI 通识教育打造的入门级主控板',
    description:
      '集成 Wi-Fi / 蓝牙 / 彩屏 / 多种传感器，支持图形化编程与 Python，对标行空板 K10，价格更亲民。',
    targetPrice: '¥99 - ¥149',
    expectedLaunch: '2026 年春季',
    coreFeatures: [
      '国产主控芯片，性能均衡',
      '1.54 寸彩屏 + 按键 + 蜂鸣器',
      'Wi-Fi / 蓝牙双模',
      '内置三轴加速度 + 温湿度 + 光线传感器',
      '支持 Mind+ / mPython / Python 三栈编程',
      'Type-C 供电与程序下载',
    ],
    targetStages: ['primary', 'junior'],
    benchmark: '行空板 K10 / 掌控板 3.0',
    status: 'developing',
    notifyEnabled: true,
  },
  {
    id: 'zx-vision',
    name: '智象 AI 视觉模块',
    codeName: 'ZhiXiang Vision',
    type: 'AIVisionSensor',
    tagline: '让每节课都能做 AI 视觉实验',
    description:
      '端侧 AI 视觉传感器，支持人脸识别、物体识别、颜色识别、形状识别、文字识别等算法，一键训练，无需联网。',
    targetPrice: '¥199 - ¥229',
    expectedLaunch: '2026 年春季',
    coreFeatures: [
      '内置 NPU 硬件加速，本地推理',
      '人脸 / 物体 / 颜色 / 形状 / 标签 5 大识别算法',
      '一键训练（按按钮即可训练新物体）',
      'LCD 彩屏实时预览',
      'UART / I2C 双接口，兼容主流主控板',
      '配套 20+ 课时教学案例',
    ],
    targetStages: ['primary', 'junior', 'senior'],
    benchmark: '二哈识图 HuskyLens',
    status: 'planned',
    notifyEnabled: true,
  },
  {
    id: 'zx-voice',
    name: '智象 AI 语音模块',
    codeName: 'ZhiXiang Voice',
    type: 'VoiceModule',
    tagline: '离线语音识别，打造会听话的装置',
    description:
      '离线语音交互模块，支持自定义唤醒词与命令词，低功耗、高识别率，适合语音控制类项目与智能家居实验。',
    targetPrice: '¥79 - ¥99',
    expectedLaunch: '2026 年夏季',
    coreFeatures: [
      '离线识别，无需联网',
      '支持 20+ 自定义命令词',
      '本地唤醒 + 命令识别两级架构',
      'I2C / UART 接口',
      '内置麦克风，3 米识别距离',
      '低功耗待机模式',
    ],
    targetStages: ['primary', 'junior'],
    benchmark: 'DFRobot 离线语音模块',
    status: 'planned',
    notifyEnabled: true,
  },
  {
    id: 'zx-sensor-kit',
    name: '智象传感器基础包',
    codeName: 'ZhiXiang Sensor Kit',
    type: 'Sensor',
    tagline: '开箱即用的传感器入门套装',
    description:
      '包含 12 种常用传感器模块与 6 种执行器，搭配智象主控板即插即用，配套完整教学资源与项目案例。',
    targetPrice: '¥199 - ¥299',
    expectedLaunch: '2026 年春季',
    coreFeatures: [
      '12 种传感器：温湿度 / 光线 / 声音 / 超声波 / 红外 / 触摸 / 雨滴 / 土壤 / 气体 / 火焰 / 旋钮 / 电位器',
      '6 种执行器：LED / 舵机 / 电机 / 蜂鸣器 / 继电器 / 风扇',
      'PH2.0 防反接接口',
      '配套 16 课时教学案例',
      '收纳盒包装，便于课堂管理',
    ],
    targetStages: ['primary', 'junior'],
    benchmark: 'Gravity 传感器系列',
    status: 'planned',
    notifyEnabled: true,
  },
];

/** 状态标签（中文） */
export const STATUS_LABELS: Record<IZhixiangHardware['status'], string> = {
  planned: '规划中',
  developing: '研发中',
  beta: '内测中',
  released: '已发售',
};
