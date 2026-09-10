// EXPORTS: IHardwareDevice, HARDWARE_DEVICES, getHardwareById

export interface IHardwareDevice {
  id: string;
  name: string;
  brand: string;
  chip: string;
  os?: string;
  communication: string[];
  language: string[];
  description: string;
  features: string[];
  suitableGrades: string;
  status: 'available' | 'coming-soon';
  imageUrl: string;
  sampleCode?: {
    name: string;
    code: string;
    description: string;
  }[];
}

export const HARDWARE_DEVICES: IHardwareDevice[] = [
  {
    id: 'xingkong-k10',
    name: '行空板 K10',
    brand: 'DFRobot',
    chip: 'ESP32-S3',
    os: 'MicroPython',
    communication: ['USB Type-C', 'Wi-Fi', '蓝牙'],
    language: ['MicroPython', '图形化编程', 'C++'],
    description:
      '入门级行空板，搭载 ESP32-S3 芯片，彩屏显示，支持 Wi-Fi 和蓝牙，适合中小学 AI 与物联网入门教学。',
    features: ['2.4 寸彩屏', 'ESP32-S3 双核', 'Wi-Fi + 蓝牙', '金手指扩展', '128x128 OLED'],
    suitableGrades: '小学高段 ~ 初中',
    status: 'available',
    imageUrl: '',
    sampleCode: [
      {
        name: '点亮板载 LED',
        description: '让行空板上的蓝色 LED 闪烁起来',
        code: `from machine import Pin
import time

# 板载 LED 在 13 号引脚
led = Pin(13, Pin.OUT)

while True:
    led.value(1)   # 点亮
    time.sleep(0.5)
    led.value(0)   # 熄灭
    time.sleep(0.5)`,
      },
      {
        name: '温湿度读取',
        description: '读取 DHT11 温湿度传感器数据',
        code: `from machine import Pin
import dht
import time

# DHT11 连接到 14 号引脚
sensor = dht.DHT11(Pin(14))

while True:
    try:
        sensor.measure()
        temp = sensor.temperature()
        humi = sensor.humidity()
        print(f"温度: {temp}°C, 湿度: {humi}%")
    except Exception as e:
        print("读取失败:", e)
    time.sleep(2)`,
      },
    ],
  },
  {
    id: 'xingkong-m10',
    name: '行空板 M10',
    brand: 'DFRobot',
    chip: '全志 V853 (ARM + NPU)',
    os: 'Linux + NPU',
    communication: ['USB Type-C', 'Wi-Fi', '以太网'],
    language: ['Python', 'C++', 'MicroPython'],
    description:
      '高性能 AI 行空板，搭载全志 V853 芯片，内置 NPU 支持边缘 AI 计算，适合机器视觉、深度学习等进阶 AI 教学。',
    features: ['Cortex-A7 + RISC-V + NPU', '1.5GHz 主频', '0.5TOPS 算力', '1.3寸 LCD', '支持 TensorFlow Lite'],
    suitableGrades: '初中 ~ 高中',
    status: 'available',
    imageUrl: '',
    sampleCode: [
      {
        name: '摄像头拍照',
        description: '调用摄像头拍摄一张照片',
        code: `import cv2

# 打开摄像头
cap = cv2.VideoCapture(0)

# 读取一帧
ret, frame = cap.read()
if ret:
    cv2.imwrite("photo.jpg", frame)
    print("拍照成功，已保存为 photo.jpg")

cap.release()`,
      },
      {
        name: '人脸识别',
        description: '使用 NPU 加速的人脸检测',
        code: `import cv2
from face_detection import FaceDetector

detector = FaceDetector()
cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    faces = detector.detect(frame)
    for (x, y, w, h) in faces:
        cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)

    cv2.imshow("Face Detection", frame)
    if cv2.waitKey(1) == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()`,
      },
    ],
  },
  {
    id: 'zhangkong-2',
    name: '掌控板 2.0',
    brand: '盛思',
    chip: 'ESP32',
    os: 'mPython / MicroPython',
    communication: ['USB', 'Wi-Fi', '蓝牙'],
    language: ['mPython 图形化', 'MicroPython', '图形化编程'],
    description:
      '经典掌控板 2.0，搭载 ESP32 芯片，OLED 显示屏，三轴加速度传感器，声音传感器，适合中小学编程入门。',
    features: ['ESP32 双核', '1.3 寸 OLED', '三轴加速度计', '声音传感器', '光线传感器'],
    suitableGrades: '小学中段 ~ 初中',
    status: 'available',
    imageUrl: '',
    sampleCode: [
      {
        name: 'OLED 显示',
        description: '在 OLED 屏幕上显示文字',
        code: `from mpython import *

# 清屏
oled.fill(0)
# 显示文字
oled.DispChar("你好，掌控板！", 10, 10)
oled.DispChar("Hello mPython", 10, 30)
# 刷新显示
oled.show()`,
      },
    ],
  },
  {
    id: 'zhangkong-3',
    name: '掌控板 3.0',
    brand: '盛思',
    chip: 'ESP32-S3',
    os: 'mPython / MicroPython',
    communication: ['USB Type-C', 'Wi-Fi 6', '蓝牙 5'],
    language: ['mPython 图形化', 'MicroPython', 'Python'],
    description:
      '新一代掌控板 3.0，性能更强，屏幕更大，支持 AI 语音和图像处理，适合新课标 AI 教学。',
    features: ['ESP32-S3', '1.9 寸彩屏', 'AI 语音识别', '摄像头接口', 'Wi-Fi 6 + 蓝牙 5'],
    suitableGrades: '小学高段 ~ 高中',
    status: 'available',
    imageUrl: '',
  },
  {
    id: 'zhixiang-box',
    name: '智象实验盒',
    brand: '智象',
    chip: '定制 AI 芯片',
    os: '智象 AI OS',
    communication: ['USB Type-C', 'Wi-Fi', '蓝牙'],
    language: ['图形化编程', 'Python', '积木式 AI 训练'],
    description:
      '智象自研 AI 教学实验盒，专为中小学 AI 通识教育设计，开箱即用，配套完整课程体系。',
    features: ['一体化设计', '内置 AI 加速', '多种传感器套件', '配套完整课程', '课堂管理系统'],
    suitableGrades: '小学低段 ~ 高中',
    status: 'coming-soon',
    imageUrl: '',
  },
  {
    id: 'arduino',
    name: 'Arduino Uno',
    brand: 'Arduino',
    chip: 'ATmega328P',
    os: '-',
    communication: ['USB'],
    language: ['Arduino C/C++', '图形化编程'],
    description:
      '经典开源电子平台，生态丰富，配件众多，适合创客教育和电子基础入门。',
    features: ['14 路数字 I/O', '6 路模拟输入', '丰富的扩展板', '海量教程资源', '开源硬件'],
    suitableGrades: '初中 ~ 高中',
    status: 'available',
    imageUrl: '',
    sampleCode: [
      {
        name: 'Blink 闪灯',
        description: 'Arduino 入门经典程序',
        code: `// 板载 LED 在 13 号引脚
int ledPin = 13;

void setup() {
  pinMode(ledPin, OUTPUT);
}

void loop() {
  digitalWrite(ledPin, HIGH);   // 点亮
  delay(1000);                  // 等待 1 秒
  digitalWrite(ledPin, LOW);    // 熄灭
  delay(1000);                  // 等待 1 秒
}`,
      },
    ],
  },
  {
    id: 'microbit',
    name: 'micro:bit',
    brand: 'BBC',
    chip: 'nRF52833',
    os: '-',
    communication: ['USB', '蓝牙 5'],
    language: ['MakeCode 图形化', 'MicroPython', 'Scratch'],
    description:
      '由英国 BBC 推出的微型计算机，5x5 LED 点阵，两个按钮，加速度计和磁力计，适合小学编程入门。',
    features: ['5x5 LED 点阵', '加速度计 + 磁力计', '蓝牙', '触摸感应', '丰富的扩展包'],
    suitableGrades: '小学低段 ~ 高段',
    status: 'available',
    imageUrl: '',
  },
];

export function getHardwareById(id: string): IHardwareDevice | undefined {
  return HARDWARE_DEVICES.find((h) => h.id === id);
}
