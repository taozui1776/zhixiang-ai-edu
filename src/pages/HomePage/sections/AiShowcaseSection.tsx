import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  FlaskConical,
  MessageSquare,
  Code2,
  Image as ImageIcon,
  BrainCircuit,
  ArrowRight,
  Wand2,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const AI_TOOLS = [
  {
    path: '/ai-tools?tab=lesson',
    title: 'AI 备课助手',
    desc: '输入课题和年级，AI 生成教案框架、教学目标与活动设计',
    icon: Sparkles,
    gradient: 'from-primary to-purple-500',
  },
  {
    path: '/ai-tools?tab=code',
    title: 'AI 实验代码生成',
    desc: '输入实验需求，生成 Python/图形化编程示例代码与步骤',
    icon: Code2,
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    path: '/ai-tools?tab=qa',
    title: 'AI 通识问答',
    desc: '学生或老师就 AI 概念提问，AI 给出通俗解答',
    icon: MessageSquare,
    gradient: 'from-emerald-500 to-teal-500',
  },
];

const AI_EXPERIMENTS = [
  { name: '图像识别实验', icon: ImageIcon, path: '/ai-lab/experiment/image-recognition' },
  { name: '人脸检测实验', icon: BrainCircuit, path: '/ai-lab/experiment/face-detect' },
  { name: '文字识别实验', icon: Wand2, path: '/ai-lab/experiment/ocr' },
  { name: '模型训练体验', icon: FlaskConical, path: '/ai-lab/experiment/train' },
  { name: 'AI 绘画实验', icon: ImageIcon, path: '/ai-lab/experiment/ai-paint' },
  { name: '语音识别实验', icon: MessageSquare, path: '/ai-lab/experiment/speech' },
  { name: '智能对话实验', icon: Sparkles, path: '/ai-lab/experiment/chat' },
];

export default function AiShowcaseSection() {
  const navigate = useNavigate();

  return (
    <section className="w-full py-16 md:py-20 bg-gradient-to-b from-background to-primary/[0.03]">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-3 bg-purple-500/10 text-purple-700 border-purple-500/20">
              <Sparkles className="size-3 mr-1" />
              真实 AI 能力
            </Badge>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-3"
          >
            AI 能力直达课堂
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-muted-foreground"
          >
            3 大教师 AI 工具 + 7 个学生动手实验，无需配置，浏览器即用
          </motion.p>
        </div>

        {/* AI 工具大卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {AI_TOOLS.map((tool, i) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.path}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <Card
                  className="group cursor-pointer hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 overflow-hidden border-border/60 h-full"
                  onClick={() => navigate(tool.path)}
                >
                  <CardContent className="p-6">
                    <div
                      className={`size-12 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center text-white shadow-md mb-4`}
                    >
                      <Icon className="size-6" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{tool.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      {tool.desc}
                    </p>
                    <span className="text-sm font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                      立即体验 <ArrowRight className="size-3.5" />
                    </span>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* AI 实验入口（简洁网格） */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-foreground">
              🧪 AI 实验（7 个）
            </h3>
            <button
              onClick={() => navigate('/ai-lab')}
              className="text-sm text-primary hover:gap-2 transition-all font-medium flex items-center gap-1"
            >
              全部实验 <ArrowRight className="size-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {AI_EXPERIMENTS.map((exp, i) => {
              const Icon = exp.icon;
              return (
                <motion.div
                  key={exp.name}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.35 + i * 0.05 }}
                  whileHover={{ y: -2 }}
                >
                  <Card
                    className="group cursor-pointer hover:border-primary/40 hover:shadow-sm transition-all h-full"
                    onClick={() => navigate(exp.path)}
                  >
                    <CardContent className="p-4 flex flex-col items-center text-center">
                      <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2 group-hover:bg-primary group-hover:text-white transition-colors">
                        <Icon className="size-5" />
                      </div>
                      <div className="text-xs font-medium text-foreground leading-tight">
                        {exp.name}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
