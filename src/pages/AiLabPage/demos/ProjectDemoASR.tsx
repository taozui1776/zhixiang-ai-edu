import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Play, RotateCcw, Copy, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { toast } from 'sonner';


export default function ProjectDemoASR() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [finalText, setFinalText] = useState('');
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<number | null>(null);

  const isSupported =
    typeof window !== 'undefined' &&
    ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);

  const startRecording = () => {
    if (!isSupported) {
      toast.error('当前浏览器不支持语音识别，请使用 Chrome 浏览器');
      return;
    }

    const SpeechRecognition =
      (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'zh-CN';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';
      for (let i = 0; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }
      setTranscript(interim);
      if (final) {
        setFinalText((prev) => prev + final);
      }
    };

    recognition.onerror = (e: any) => {
      console.error('ASR error:', String(e.error));
      setIsRecording(false);
      if (e.error === 'not-allowed') {
        toast.error('请允许麦克风权限');
      }
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
    setFinalText('');
    setTranscript('');
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const clearText = () => {
    setFinalText('');
    setTranscript('');
  };

  const copyText = () => {
    const full = finalText + transcript;
    if (!full.trim()) {
      toast.info('没有文字可复制');
      return;
    }
    navigator.clipboard.writeText(full);
    toast.success('已复制到剪贴板');
  };

  const speakResult = () => {
    const full = finalText + transcript;
    if (!full.trim()) {
      toast.info('没有文字可朗读');
      return;
    }
    const utterance = new SpeechSynthesisUtterance(full);
    utterance.lang = 'zh-CN';
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-5">
      {!isSupported && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-sm">
          ⚠️ 当前浏览器不支持 Web Speech API，请使用 Chrome / Edge 浏览器体验语音识别功能。
        </div>
      )}

      <div className="flex flex-col items-center justify-center py-8">
        <motion.button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={!isSupported}
          whileHover={!isSupported ? {} : { scale: 1.05 }}
          whileTap={!isSupported ? {} : { scale: 0.95 }}
          className={`relative size-28 rounded-full flex items-center justify-center transition-all ${
            isRecording
              ? 'bg-gradient-to-br from-rose-500 to-red-600 shadow-lg shadow-rose-500/30'
              : 'bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-blue-500/30'
          } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isRecording && (
            <motion.div
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
              className="absolute inset-0 rounded-full bg-rose-500"
            />
          )}
          {isRecording ? (
            <MicOff className="size-10 relative z-10" />
          ) : (
            <Mic className="size-10 relative z-10" />
          )}
        </motion.button>

        <p className="mt-4 text-sm font-medium text-foreground">
          {isRecording ? '点击结束录音' : '点击开始说话'}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {isSupported ? '支持中文普通话识别' : '请使用 Chrome / Edge 浏览器'}
        </p>

        {isRecording && (
          <div className="flex items-center gap-1.5 mt-4 h-12">
            {Array.from({ length: 24 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ height: 4 }}
                animate={{ height: [4, 20 + Math.random() * 20, 8, 28, 6] }}
                transition={{
                  duration: 0.8 + Math.random() * 0.4,
                  repeat: Infinity,
                  delay: i * 0.04,
                  ease: 'easeInOut',
                }}
                className="w-1.5 rounded-full bg-gradient-to-t from-rose-400 to-red-500"
              />
            ))}
          </div>
        )}
      </div>

      {/* 识别结果 */}
      <div className="p-5 rounded-xl bg-card border border-border/60 min-h-[180px]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge className={isRecording ? 'bg-rose-500 border-0' : 'bg-muted text-muted-foreground border-0'}>
              {isRecording ? '识别中…' : '识别结果'}
            </Badge>
            {(finalText || transcript) && (
              <span className="text-xs text-muted-foreground">
                共 {(finalText + transcript).length} 字
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={speakResult}>
              <Volume2 className="size-3.5 mr-1" />
              朗读
            </Button>
            <Button variant="ghost" size="sm" onClick={copyText}>
              <Copy className="size-3.5 mr-1" />
              复制
            </Button>
            <Button variant="ghost" size="sm" onClick={clearText}>
              <RotateCcw className="size-3.5 mr-1" />
              清空
            </Button>
          </div>
        </div>

        <div className="text-sm leading-relaxed">
          {finalText && <span className="text-foreground">{finalText}</span>}
          {transcript && (
            <span className="text-primary border-b border-dashed border-primary/40">
              {transcript}
            </span>
          )}
          {!finalText && !transcript && (
            <span className="text-muted-foreground italic">
              识别结果会显示在这里。点击上方麦克风按钮开始说话…
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100">
          <p className="text-xs text-blue-600 mb-1">第 1 步</p>
          <p className="text-sm font-semibold text-blue-800">声音 → 波形</p>
          <p className="text-xs text-blue-600/80 mt-1">
            麦克风把声音信号转成数字波形数据，每秒采样几千次
          </p>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-100">
          <p className="text-xs text-violet-600 mb-1">第 2 步</p>
          <p className="text-sm font-semibold text-violet-800">波形 → 音素</p>
          <p className="text-xs text-violet-600/80 mt-1">
            神经网络分析波形，识别出一个个基本发音单位（音素）
          </p>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100">
          <p className="text-xs text-emerald-600 mb-1">第 3 步</p>
          <p className="text-sm font-semibold text-emerald-800">音素 → 文字</p>
          <p className="text-xs text-emerald-600/80 mt-1">
            结合语言模型，把音素序列拼成通顺的中文文字
          </p>
        </div>
      </div>
    </div>
  );
}
