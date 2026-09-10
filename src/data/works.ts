// EXPORTS: IWork, MOCK_WORKS
export interface IWork {
  id: string
  title: string
  author: string
  stage: 'primary' | 'junior' | 'senior'
  grade: string
  category: string
  description: string
  imageUrl: string
}

export const MOCK_WORKS: IWork[] = [
  {
    id: '1',
    title: '智能垃圾分类小助手',
    author: '李明',
    stage: 'primary',
    grade: '五年级',
    category: 'AI 创意项目',
    description: '用图像识别帮你快速分类垃圾，绿色环保小能手',
    imageUrl: ''
  },
  {
    id: '2',
    title: '语音控制智能小车',
    author: '王小雨',
    stage: 'junior',
    grade: '八年级',
    category: '具身智能',
    description: '通过语音指令控制小车前进、转弯、避障',
    imageUrl: ''
  },
  {
    id: '3',
    title: '古诗词 AI 作画',
    author: '陈思远',
    stage: 'senior',
    grade: '高一',
    category: 'AI 绘画创作',
    description: '输入古诗词，AI 生成对应的意境山水画',
    imageUrl: ''
  }
]