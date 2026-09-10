// EXPORTS: HardwareType, ConnectionType, DeviceStatus, IDeviceInfo, ISensorReading, IHardwareDevice, IConnectionManager, IDataChannel, IDeviceStatusMonitor, IFirmwareManager

/**
 * 硬件抽象层 (HAL) - 类型定义
 *
 * 本文件定义所有硬件设备的统一接口。
 * 目前为架构预留阶段，接口已定义完整，后续各硬件驱动按此接口实现。
 *
 * 命名约定：
 *   - I 前缀 = 接口类型
 *   - 不带 I = 枚举 / 普通类型
 */

// ===== 硬件类型枚举 =====
/**
 * 硬件设备类型（按功能分类）
 * - AIVisionSensor: AI 视觉传感器（二哈识图、视觉模块等）
 * - MainControlBoard: 主控板（掌控板、行空板、micro:bit 等）
 * - Sensor: 通用传感器（温湿度、光线、声音等）
 * - Actuator: 执行器（电机、舵机、LED 等）
 * - RobotKit: 机器人套件（麦昆、智能小车等）
 * - VoiceModule: 语音模块（离线语音识别等）
 */
export type HardwareType =
  | 'AIVisionSensor'
  | 'MainControlBoard'
  | 'Sensor'
  | 'Actuator'
  | 'RobotKit'
  | 'VoiceModule';

// ===== 连接方式枚举 =====
/**
 * 设备连接方式
 * - WebSerial: 浏览器串口连接（掌控板/行空板等 USB 串口设备）
 * - WebBluetooth: 浏览器蓝牙连接（低功耗蓝牙设备）
 * - WiFi: Wi-Fi 网络连接（局域网内设备）
 * - USB: USB HID / 直连
 */
export type ConnectionType = 'WebSerial' | 'WebBluetooth' | 'WiFi' | 'USB';

// ===== 设备状态枚举 =====
/**
 * 设备连接状态
 * - disconnected: 未连接
 * - connecting: 连接中
 * - connected: 已连接（正常通信）
 * - error: 连接异常
 * - updating: 固件更新中
 */
export type DeviceStatus = 'disconnected' | 'connecting' | 'connected' | 'error' | 'updating';

// ===== 设备信息 =====
export interface IDeviceInfo {
  deviceId: string;          // 设备唯一标识（如串口名 / MAC / 序列号）
  deviceName: string;        // 设备显示名
  deviceType: HardwareType;  // 设备类型
  connectionType: ConnectionType; // 连接方式
  manufacturer: string;      // 厂商
  model?: string;            // 型号
  firmwareVersion?: string;  // 固件版本
  serialNumber?: string;     // 序列号
  hardwareVersion?: string;  // 硬件版本
}

// ===== 传感器读数 =====
export interface ISensorReading {
  sensorId: string;      // 传感器标识
  sensorName: string;    // 传感器名称
  value: number | number[] | string; // 读数（单值 / 多通道 / 字符串类型）
  unit?: string;         // 单位
  timestamp: number;     // 时间戳（ms）
  status: 'ok' | 'warn' | 'error'; // 状态
}

// ===== 硬件设备主接口 =====
/**
 * 所有硬件设备的统一抽象接口。
 * 具体驱动（如掌控板驱动、二哈识图驱动）必须实现此接口。
 *
 * 当前为预留架构，暂无真实实现；
 * 后续接入真实硬件时，按此接口编写驱动类即可。
 */
export interface IHardwareDevice {
  // --- 设备信息 ---
  readonly info: Readonly<IDeviceInfo>;
  readonly status: DeviceStatus;

  // --- 连接管理 ---
  /** 连接设备 */
  connect(options?: Record<string, unknown>): Promise<boolean>;
  /** 断开连接 */
  disconnect(): Promise<void>;
  /** 是否已连接 */
  isConnected(): boolean;
  /** 监听连接状态变化 */
  onConnectionChange(callback: (status: DeviceStatus) => void): () => void;

  // --- 数据通信 ---
  /** 发送数据到设备 */
  send(data: string | ArrayBuffer | Record<string, unknown>): Promise<boolean>;
  /** 监听设备返回的数据 */
  onData(callback: (data: string | Record<string, unknown>) => void): () => void;
  /** 发送命令并等待响应（带超时） */
  sendAndWaitResponse(
    cmd: string | Record<string, unknown>,
    timeoutMs?: number,
  ): Promise<unknown>;

  // --- 状态监控 ---
  /** 获取电量（百分比 0-100，不支持返回 -1） */
  getBatteryLevel(): Promise<number>;
  /** 获取信号强度（百分比 0-100，不支持返回 -1） */
  getSignalStrength(): Promise<number>;
  /** 获取设备温度（℃，不支持返回 -999） */
  getTemperature(): Promise<number>;

  // --- 固件管理 ---
  /** 获取当前固件版本 */
  getFirmwareVersion(): Promise<string>;
  /** 更新固件（返回进度 0-100 的回调） */
  updateFirmware(
    firmwareUrl: string,
    onProgress?: (percent: number) => void,
  ): Promise<boolean>;
}
