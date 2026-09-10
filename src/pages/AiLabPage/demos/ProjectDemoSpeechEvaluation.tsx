import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Volume2, BarChart3, Award, TrendingUp, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface PronunciationScore {
  accuracy: number; // 发音准确度
  fluency: number; // 流利度
  completeness: number; // 完整度
  totalScore: number; // 总分
  grade: string; // 等级
  suggestions: string[];
}

const SAMPLE_SENTENCES = [
  {
    text: '人工智能正在改变我们的生活方式。',
    pinyin: 'rén gōng zhì néng zhèng zài gǎi biàn wǒ men de shēng huó fāng shì',
    difficulty: '初级',
  },
  {
    text: 'The quick brown fox jumps over the lazy dog.',
    pinyin: '快速的棕色狐狸跳过懒狗',
    difficulty: '英语·初级',
  },
  {
    text: '少年智则国智，少年富则国富，少年强则国强。',
    pinyin: 'shào nián zhì zé guó zhì, shào nián fù zé guó fù, shào nián qiáng zé guó qiáng',
    difficulty: '进阶',
  },
];

export default function ProjectDemoSpeechEvaluation() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [result, setResult] = useState<PronunciationScore | null>(null);
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState(0);
  const [audioWaveform, setAudioWaveform] = useState<number[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentSentence = SAMPLE_SENTENCES[currentSentenceIdx];

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = () => {
    // 检查浏览器是否支持麦克风
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      toast.info('当前浏览器不支持录音，将使用演示模式');
      simulateRecording();
      return;
    }

    setIsRecording(true);
    setRecordDuration(0);
    setResult(null);
    setAudioWaveform([]);

    // 波形动画
    let count = 0;
    timerRef.current = setInterval(() => {
      setRecordDuration((d) => d + 0.1);
      setAudioWaveform((prev) => {
        const next = [...prev, Math.random() * 60 + 20];
        return next.slice(-40);
      });
      count++;
    }, 100);
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    runEvaluation();
  };

  const simulateRecording = () => {
    setIsRecording(true);
    setRecordDuration(0);
    setResult(null);
    setAudioWaveform([]);

    let elapsed = 0;
    timerRef.current = setInterval(() => {
      elapsed += 0.1;
      setRecordDuration(elapsed);
      setAudioWaveform((prev) => [...prev, Math.random() * 60 + 20].slice(-40));
      if (elapsed >= 3.5) {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsRecording(false);
        runEvaluation();
      }
    }, 100);
  };

  const runEvaluation = () => {
    setIsEvaluating(true);
    setTimeout(() => {
      const accuracy = 85 + Math.random() * 12;
      const fluency = 80 + Math.random() * 15;
      const completeness = 90 + Math.random() * 8;
      const total = Math.round((accuracy * 0.4 + fluency * 0.3 + completeness * 0.3) * 10) / 10;

      let grade = 'A';
      if (total >= 90) grade = 'A+';
      else if (total >= 85) grade = 'A';
      else if (total >= 75) grade = 'B';
      else if (total >= 60) grade = 'C';
      else grade = 'D';

      setResult({
        accuracy: Math.round(accuracy * 10) / 10,
        fluency: Math.round(fluency * 10) / 10,
        completeness: Math.round(completeness * 10) / 10,
        totalScore: total,
        grade,
        suggestions: [
          '整体发音清晰，语速适中',
          '部分声调可以再准确一些',
          '建议多练习轻声和儿化音',
        ],
      });
      setIsEvaluating(false);
      toast.success('语音评测完成');
    }, 1500);
  };

  const playSample = () => {
    toast.info('示范朗读播放中…');
  };

  const formatDuration = (sec: number) => {
    const s = Math.floor(sec);
    const ms = Math.floor((sec - s) * 10);
    return `${s}.${ms}s`;
  };

  const gradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (grade === 'B') return 'text-blue-600 bg-blue-50 border-blue-200';
    if (grade === 'C') return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {['选择句子', '录音跟读', 'AI评分反馈'].map((step, i) => (
          <div key={step} className="flex items-center gap-2">
            <span className="size-6 rounded-full bg-violet-500/10 text-violet-600 text-xs flex items-center justify-center font-medium">
              {i + 1}
            </span>
            <span className="text-xs text-muted-foreground">{step}</span>
          </div>
        ))}
      </div>

      {/* 句子选择 */}
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Volume2 className="size-4 text-violet-600" />
            <span className="text-sm font-medium text-foreground">跟读句子</span>
            <Badge variant="outline" className="text-[10px] ml-auto">
              {currentSentence.difficulty}
            </Badge>
          </div>
          <p className="text-lg font-medium text-foreground mb-1 leading-relaxed">
            {currentSentence.text}
          </p>
          <p className="text-xs text-muted-foreground mb-3">{currentSentence.pinyin}</p>
          <Button variant="secondary" size="sm" onClick={playSample}>
            <Play className="size-3.5 mr-1.5" />
            听示范朗读
          </Button>

          <div className="flex gap-2 mt-4 pt-3 border-t border-border/40">
            {SAMPLE_SENTENCES.map((s, i) => (
              <button
                key={i}
                onClick={() => {
                  setCurrentSentenceIdx(i);
                  setResult(null);
                }}
                className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  i === currentSentenceIdx
                    ? 'bg-violet-100 text-violet-700 border border-violet-200'
                    : 'bg-muted/30 text-muted-foreground border border-transparent hover:bg-muted/60'
                }`}
              >
                句子 {i + 1}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 左：录音区 */}
        <Card className="overflow-hidden">
          <CardContent className="p-6 min-h-[320px] flex flex-col items-center justify-center">
            {/* 波形显示 */}
            <div className="w-full h-20 flex items-center justify-center gap-0.5 mb-6">
              {isRecording || audioWaveform.length > 0 ? (
                audioWaveform.map((h, i) => (
                  <div
                    key={i}
                    className="w-1 bg-violet-500 rounded-full transition-all duration-75"
                    style={{ height: `${h}%` }}
                  />
                ))
              ) : (
                <div className="text-xs text-muted-foreground">点击下方按钮开始录音</div>
              )}
            </div>

            {/* 录音按钮 */}
            <div className="mb-4">
              {isRecording ? (
                <Button
                  size="lg"
                  onClick={stopRecording}
                  className="size-20 rounded-full bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30"
                >
                  <Square className="size-8" />
                </Button>
              ) : (
                <Button
                  size="lg"
                  onClick={startRecording}
                  disabled={isEvaluating}
                  className="size-20 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/30"
                >
                  <Mic className="size-8" />
                </Button>
              )}
            </div>

            <p className="text-sm text-foreground font-medium mb-1">
              {isRecording ? '正在录音…' : isEvaluating ? 'AI 正在评分…' : '按住或点击开始录音'}
            </p>
            <p className="text-xs text-muted-foreground tabular-nums">
              {isRecording ? `已录制 ${formatDuration(recordDuration)}` : '建议朗读 3-10 秒'}
            </p>

            {isEvaluating && (
              <div className="w-full max-w-[200px] mt-4">
                <Progress value={60} className="h-1" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* 右：评分结果 */}
        <Card className="overflow-hidden">
          <CardContent className="p-4 min-h-[320px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-foreground flex items-center gap-2">
                <BarChart3 className="size-4 text-violet-600" />
                评测结果
              </span>
              {result && (
                <Badge className={`text-sm ${gradeColor(result.grade)}`}>
                  <Award className="size-3 mr-1" />
                  {result.grade}
                </Badge>
              )}
            </div>

            <div className="flex-1">
              {result ? (
                <div className="space-y-4">
                  {/* 总分 */}
                  <div className="text-center py-4 bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl">
                    <p className="text-4xl font-black text-violet-700 tabular-nums mb-1">
                      {result.totalScore}
                    </p>
                    <p className="text-xs text-violet-600/70">综合得分（满分 100）</p>
                  </div>

                  {/* 分项 */}
                  <div className="space-y-3">
                    {[
                      { label: '发音准确度', value: result.accuracy, icon: '🎯' },
                      { label: '流利度', value: result.fluency, icon: '💨' },
                      { label: '完整度', value: result.completeness, icon: '📝' },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-foreground">
                            <span className="mr-1.5">{item.icon}</span>
                            {item.label}
                          </span>
                          <span className="font-medium text-violet-600 tabular-nums">
                            {item.value.toFixed(1)}
                          </span>
                        </div>
                        <Progress value={item.value} className="h-1.5 bg-violet-100/50" />
                      </div>
                    ))}
                  </div>

                  {/* 建议 */}
                  <div className="pt-3 border-t border-border/40">
                    <p className="text-xs font-medium text-foreground mb-2 flex items-center gap-1.5">
                      <TrendingUp className="size-3.5 text-violet-600" />
                      改进建议
                    </p>
                    <ul className="space-y-1">
                      {result.suggestions.map((s, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                          <span className="text-violet-400 mt-0.5">•</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center py-8">
                  <div className="size-14 rounded-2xl bg-muted/60 flex items-center justify-center mb-3">
                    <BarChart3 className="size-7 text-muted-foreground/40" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">暂无评分结果</p>
                  <p className="text-xs text-muted-foreground/70">录音完成后自动评测</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Sparkles className="size-3.5 text-violet-500" />
        <span>
          技术原理：语音评测基于深度神经网络，从准确度（音准）、流利度（语速节奏）、完整度（读全了多少）三个维度综合打分
        </span>
      </div>
    </div>
  );
}
