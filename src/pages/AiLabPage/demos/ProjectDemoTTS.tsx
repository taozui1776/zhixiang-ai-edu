import { useState } from 'react';
import { Volume2, Mic, Play, Pause, Type, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const VOICE_OPTIONS = [
  { id: 'zh-CN-XiaoxiaoNeural', name: '晓晓', desc: '甜美女声' },
  { id: 'zh-CN-YunxiNeural', name: '云希', desc: '沉稳男声' },
  { id: 'zh-CN-YunjianNeural', name: '云健', desc: '活力男声' },
];

const PRESET_TEXTS = [
  '大家好，欢迎来到智象 AI 实验室！',
  '人工智能正在改变我们的生活和学习方式。',
  '语音合成技术可以让机器像人一样说话。',
];

export default function ProjectDemoTTS() {
  const [text, setText] = useState(PRESET_TEXTS[0]);
  const [voice, setVoice] = useState(VOICE_OPTIONS[0].id);
  const [speed, setSpeed] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = () => {
    if (!text.trim()) {
      toast.info('请输入要合成的文字');
      return;
    }

    if (!('speechSynthesis' in window)) {
      toast.error('当前浏览器不支持语音合成');
      return;
    }

    // 停止之前的
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = speed;
    utterance.pitch = pitch;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 左侧：输入 */}
        <div className="md:col-span-2 space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground flex items-center gap-2 mb-2">
              <Type className="size-4 text-primary" />
              输入文字
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-36 p-4 rounded-xl border border-border/60 bg-card text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/60 transition-all"
              placeholder="请输入要合成的中文文字…"
              maxLength={200}
            />
            <div className="flex justify-between mt-1.5">
              <span className="text-xs text-muted-foreground">
                {text.length}/200 字
              </span>
              <div className="flex gap-2">
                {PRESET_TEXTS.map((t, i) => (
                  <button
                    key={i}
                    onClick={() => setText(t)}
                    className="text-xs text-primary hover:underline"
                  >
                    示例{i + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={isSpeaking ? stopSpeaking : speak}
              className="bg-gradient-to-r from-violet-600 to-purple-500 hover:from-violet-700 hover:to-purple-600"
            >
              {isSpeaking ? (
                <>
                  <Pause className="size-4 mr-2" />
                  停止播放
                </>
              ) : (
                <>
                  <Play className="size-4 mr-2" />
                  播放语音
                </>
              )}
            </Button>
          </div>
        </div>

        {/* 右侧：参数 */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-card border border-border/60">
            <p className="text-sm font-medium flex items-center gap-2 mb-3">
              <Languages className="size-4 text-primary" />
              语音选择
            </p>
            <RadioGroup value={voice} onValueChange={setVoice} className="space-y-2">
              {VOICE_OPTIONS.map((v) => (
                <div
                  key={v.id}
                  className="flex items-center gap-2 p-2.5 rounded-lg border border-border/60 hover:border-primary/30 hover:bg-primary/5 transition-colors"
                >
                  <RadioGroupItem value={v.id} id={`voice-${v.id}`} />
                  <Label htmlFor={`voice-${v.id}`} className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <div className="size-8 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                        {v.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{v.name}</p>
                        <p className="text-xs text-muted-foreground">{v.desc}</p>
                      </div>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border/60 space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium">语速</label>
                <span className="text-xs font-mono text-primary">{speed.toFixed(1)}x</span>
              </div>
              <Slider
                value={[speed * 10]}
                onValueChange={(v) => setSpeed(v[0] / 10)}
                min={5}
                max={20}
                step={1}
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium">音调</label>
                <span className="text-xs font-mono text-primary">{pitch.toFixed(1)}</span>
              </div>
              <Slider
                value={[pitch * 10]}
                onValueChange={(v) => setPitch(v[0] / 10)}
                min={5}
                max={15}
                step={1}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 可视化波形 */}
      <div className="p-6 rounded-xl bg-gradient-to-br from-violet-50/60 to-purple-50/40 border border-violet-100">
        <div className="flex items-center gap-2 mb-4">
          <Badge className="bg-violet-500 border-0">
            {isSpeaking ? '正在合成…' : '语音波形示意'}
          </Badge>
          {isSpeaking && (
            <span className="text-xs text-violet-600">
              AI 正在用「{VOICE_OPTIONS.find((v) => v.id === voice)?.name}」的声音朗读
            </span>
          )}
        </div>

        <div className="flex items-end justify-center gap-1 h-24">
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ height: 4 }}
              animate={
                isSpeaking
                  ? {
                      height: [
                        4 + Math.random() * 20,
                        20 + Math.random() * 30,
                        8 + Math.random() * 16,
                        30 + Math.random() * 20,
                        10 + Math.random() * 20,
                      ],
                    }
                  : { height: 4 }
              }
              transition={
                isSpeaking
                  ? {
                      duration: 0.8 + Math.random() * 0.5,
                      repeat: Infinity,
                      delay: i * 0.03,
                      ease: 'easeInOut',
                    }
                  : { duration: 0.3 }
              }
              className="w-1.5 rounded-full bg-gradient-to-t from-violet-500 to-purple-400"
            />
          ))}
        </div>
      </div>

      <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-100">
        <p className="text-xs text-amber-700">
          💡 <strong>TTS 语音合成原理：</strong>
          把文字先转成拼音/音标（前端处理），再通过神经网络生成声音波形（后端模型）。
          现在演示用的是浏览器内置的 SpeechSynthesis API，体验效果；生产级 TTS 需要云端大模型支持。
        </p>
      </div>
    </div>
  );
}
