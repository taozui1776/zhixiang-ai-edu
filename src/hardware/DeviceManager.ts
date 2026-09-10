// EXPORTS: DeviceManager, deviceManager

  import {
  type IHardwareDevice,
  type IDeviceInfo,
  type DeviceStatus,
  type ConnectionType,
  type ISensorReading,
  type HardwareType,
} from './types';

/**
 * 设备管理器 (DeviceManager)
 *
 * 统一管理所有已连接的硬件设备。
 *
 * 功能：
 * 1. 设备发现（scan）— 搜索附近可连接设备
 * 2. 设备连接（connect）— 连接指定设备
 * 3. 设备列表（getDevices）— 获取所有已注册设备
 * 4. 设备状态监听（onDeviceStatusChange）— 订阅全局设备状态变化
 * 5. 多设备同时连接支持
 *
 * 当前为架构预留阶段：
 * - 提供模拟设备用于 UI 演示（模拟数据）
 * - 真实驱动后续按 IHardwareDevice 接口接入
 * - 单例模式，全局唯一实例
 */

type StatusCallback = (deviceId: string, status: DeviceStatus) => void;
type DataCallback = (deviceId: string, data: unknown) => void;
type SensorCallback = (deviceId: string, readings: ISensorReading[]) => void;

export class DeviceManager {
  private static _instance: DeviceManager | null = null;

  private devices: Map<string, IHardwareDevice> = new Map();
  private statusListeners: Set<StatusCallback> = new Set();
  private dataListeners: Set<DataCallback> = new Set();
  private sensorListeners: Set<SensorCallback> = new Set();
  private scanning = false;

  // 模拟数据定时器（演示用）
  private mockTimer: number | null = null;

  private constructor() {
    // 私有化构造函数，单例
  }

  static getInstance(): DeviceManager {
    if (!DeviceManager._instance) {
      DeviceManager._instance = new DeviceManager();
    }
    return DeviceManager._instance;
  }

  // ===== 设备发现 =====
  /**
   * 扫描附近可连接的设备
   * @param connectionType 可选，指定连接方式，默认全部
   * @returns 发现的设备信息列表
   */
  async scan(connectionType?: ConnectionType): Promise<IDeviceInfo[]> {
    if (this.scanning) return [];
    this.scanning = true;

    try {
      // TODO: 预留 — 真实实现时按连接方式调用 WebSerial / WebBluetooth / mDNS 等 API
      // 当前返回模拟设备用于 UI 演示
      await new Promise((r) => setTimeout(r, 1500)); // 模拟扫描耗时

      const mockDevices: IDeviceInfo[] = [
        {
          deviceId: 'mock-mp-001',
          deviceName: '掌控板 3.0 - 讲台',
          deviceType: 'MainControlBoard',
          connectionType: 'WebSerial',
          manufacturer: '盛思',
          model: 'mPython 3.0',
          firmwareVersion: '3.2.1',
          serialNumber: 'MP30-2025-001234',
        },
        {
          deviceId: 'mock-husky-001',
          deviceName: '二哈识图 - 演示台',
          deviceType: 'AIVisionSensor',
          connectionType: 'WebSerial',
          manufacturer: 'DFRobot',
          model: 'HuskyLens',
          firmwareVersion: '0.5.3',
        },
        {
          deviceId: 'mock-voice-001',
          deviceName: '语音模块 - 分组1',
          deviceType: 'VoiceModule',
          connectionType: 'WebBluetooth',
          manufacturer: 'DFRobot',
          model: 'ASR01',
          firmwareVersion: '1.0.0',
        },
        {
          deviceId: 'mock-robot-001',
          deviceName: '麦昆 V5 - 小车A',
          deviceType: 'RobotKit',
          connectionType: 'WebBluetooth',
          manufacturer: 'DFRobot',
          model: 'Maqueen V5',
        },
      ];

      if (connectionType) {
        return mockDevices.filter((d) => d.connectionType === connectionType);
      }
      return mockDevices;
    } finally {
      this.scanning = false;
    }
  }

  isScanning(): boolean {
    return this.scanning;
  }

  // ===== 设备连接 =====
  /**
   * 连接设备（预留接口，当前演示用模拟连接）
   */
  async connect(deviceId: string): Promise<boolean> {
    // TODO: 真实实现时根据 deviceId 查找驱动并 connect
    // 当前模拟连接过程
    const existing = this.devices.get(deviceId);
    if (existing && existing.isConnected()) return true;

    this.emitStatus(deviceId, 'connecting');

    await new Promise((r) => setTimeout(r, 1200));

    // 模拟设备（简化实现，仅用于 UI 演示）
    const mockDevice = createMockDevice(deviceId);
    this.devices.set(deviceId, mockDevice);

    this.emitStatus(deviceId, 'connected');
    this.startMockSensorData();

    return true;
  }

  async disconnect(deviceId: string): Promise<void> {
    const device = this.devices.get(deviceId);
    if (device) {
      await device.disconnect();
    }
    this.devices.delete(deviceId);
    this.emitStatus(deviceId, 'disconnected');

    if (this.devices.size === 0) {
      this.stopMockSensorData();
    }
  }

  // ===== 设备查询 =====
  getDevices(): IHardwareDevice[] {
    return Array.from(this.devices.values());
  }

  getDevice(deviceId: string): IHardwareDevice | undefined {
    return this.devices.get(deviceId);
  }

  getConnectedCount(): number {
    return this.getDevices().filter((d) => d.isConnected()).length;
  }

  // ===== 事件订阅 =====
  onDeviceStatusChange(callback: StatusCallback): () => void {
    this.statusListeners.add(callback);
    return () => this.statusListeners.delete(callback);
  }

  onDeviceData(callback: DataCallback): () => void {
    this.dataListeners.add(callback);
    return () => this.dataListeners.delete(callback);
  }

  onSensorData(callback: SensorCallback): () => void {
    this.sensorListeners.add(callback);
    return () => this.sensorListeners.delete(callback);
  }

  // ===== 内部方法 =====
  private emitStatus(deviceId: string, status: DeviceStatus): void {
    this.statusListeners.forEach((cb) => {
      try {
        cb(deviceId, status);
      } catch {
        /* 忽略单个监听器错误 */
      }
    });
  }

  /** 启动模拟传感器数据推送（演示用，真实硬件时替换） */
  private startMockSensorData(): void {
    if (this.mockTimer) return;

    let t = 0;
    this.mockTimer = window.setInterval(() => {
      t += 1;
      const readings: ISensorReading[] = [
        {
          sensorId: 'temp',
          sensorName: '温度',
          value: +(22 + Math.sin(t / 10) * 2 + Math.random() * 0.5).toFixed(1),
          unit: '℃',
          timestamp: Date.now(),
          status: 'ok',
        },
        {
          sensorId: 'humidity',
          sensorName: '湿度',
          value: +(55 + Math.cos(t / 8) * 5 + Math.random() * 1).toFixed(0),
          unit: '%',
          timestamp: Date.now(),
          status: 'ok',
        },
        {
          sensorId: 'light',
          sensorName: '光线',
          value: Math.floor(300 + Math.sin(t / 5) * 150 + Math.random() * 30),
          unit: 'lux',
          timestamp: Date.now(),
          status: 'ok',
        },
        {
          sensorId: 'sound',
          sensorName: '声音',
          value: Math.floor(40 + Math.random() * 25),
          unit: 'dB',
          timestamp: Date.now(),
          status: 'ok',
        },
      ];

      this.devices.forEach((_d, id) => {
        this.sensorListeners.forEach((cb) => {
          try {
            cb(id, readings);
          } catch {
            /* 忽略 */
          }
        });
      });
    }, 1000);
  }

  private stopMockSensorData(): void {
    if (this.mockTimer) {
      clearInterval(this.mockTimer);
      this.mockTimer = null;
    }
  }
}

/** 全局单例 */
export const deviceManager = DeviceManager.getInstance();

// ===== 模拟设备工厂（仅用于架构演示，后续替换为真实驱动） =====
function createMockDevice(deviceId: string): IHardwareDevice {
  let connected = true;
  const connListeners: Set<(s: DeviceStatus) => void> = new Set();
  const dataListeners: Set<(d: string | Record<string, unknown>) => void> = new Set();

  return {
    get info() {
      const deviceType: HardwareType = 'MainControlBoard';
      const connectionType: ConnectionType = 'WebSerial';
      return {
        deviceId,
        deviceName: `模拟设备 ${deviceId.slice(-4)}`,
        deviceType,
        connectionType,
        manufacturer: 'Demo',
        firmwareVersion: '1.0.0',
      };
    },
    get status() {
      return connected ? 'connected' : 'disconnected';
    },

    async connect() {
      connected = true;
      connListeners.forEach((cb) => cb('connected'));
      return true;
    },
    async disconnect() {
      connected = false;
      connListeners.forEach((cb) => cb('disconnected'));
    },
    isConnected() {
      return connected;
    },
    onConnectionChange(cb) {
      connListeners.add(cb);
      return () => connListeners.delete(cb);
    },

    async send() {
      return true;
    },
    onData(cb) {
      dataListeners.add(cb);
      return () => dataListeners.delete(cb);
    },
    async sendAndWaitResponse(cmd) {
      return { echo: cmd, ok: true };
    },

    async getBatteryLevel() {
      return 87;
    },
    async getSignalStrength() {
      return 92;
    },
    async getTemperature() {
      return 28.5;
    },

    async getFirmwareVersion() {
      return '1.0.0';
    },
    async updateFirmware(_url, onProgress) {
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((r) => setTimeout(r, 100));
        onProgress?.(i);
      }
      return true;
    },
  };
}
