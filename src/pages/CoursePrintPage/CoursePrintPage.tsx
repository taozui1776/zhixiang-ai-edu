import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft, Printer, Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getLessonById, getAllLessons, type ILesson } from '@/data/courses';
import { getPrepareNotes } from '@/pages/TeachModePage/tools';

export default function CoursePrintPage() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<ILesson | null>(null);
  const [relatedLessons, setRelatedLessons] = useState<ILesson[]>([]);
  const [scope, setScope] = useState<'single' | 'unit'>('single');

  useEffect(() => {
    if (!lessonId) return;
    const l = getLessonById(lessonId);
    if (l) {
      setLesson(l);
      // 同单元课程
      const unitLessons = getAllLessons().filter(
        (x) => x.unitId === l.unitId,
      );
      setRelatedLessons(unitLessons);
    }
  }, [lessonId]);

  const lessonsToPrint =
    scope === 'unit' ? relatedLessons : lesson ? [lesson] : [];

  const handlePrint = () => {
    window.print();
  };

  if (!lesson) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">课程不存在</p>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="size-4" /> 返回
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 顶部工具栏（打印时隐藏） */}
      <div className="print:hidden sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border/50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="gap-1 shrink-0"
            >
              <ArrowLeft className="size-4" />
              返回
            </Button>
            <div className="min-w-0">
              <h1 className="text-sm font-semibold truncate">课件下载 · {lesson.title}</h1>
              <p className="text-[10px] text-muted-foreground truncate">
                {lesson.gradeName} · {lesson.unitTitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {relatedLessons.length > 1 && (
              <select
                value={scope}
                onChange={(e) => setScope(e.target.value as 'single' | 'unit')}
                className="text-sm h-9 px-2 rounded-md border border-border bg-background"
              >
                <option value="single">仅本课</option>
                <option value="unit">整单元 ({relatedLessons.length} 课)</option>
              </select>
            )}
            <Button size="sm" onClick={handlePrint} className="gap-1.5">
              <Printer className="size-4" />
              打印 / 保存 PDF
            </Button>
          </div>
        </div>
      </div>

      {/* 打印内容区 */}
      <div className="max-w-4xl mx-auto px-4 py-8 print:max-w-none print:px-0 print:py-0">
        <div className="print-content">
          {/* 封面 */}
          <section className="mb-12 pb-8 border-b-2 border-border print:break-after-page">
            <div className="text-center space-y-4 py-12">
              <div className="text-6xl mb-2">🐘</div>
              <h1 className="text-3xl font-bold text-foreground">{lesson.unitTitle}</h1>
              <p className="text-lg text-muted-foreground">
                {lesson.gradeName} · {scope === 'single' ? '单课教案' : `单元教案（${relatedLessons.length} 课时）`}
              </p>
              <div className="flex items-center justify-center gap-6 pt-4 text-sm text-muted-foreground">
                <span>课程模块：{lesson.module}</span>
                <span>·</span>
                <span>总课时：{lessonsToPrint.length} 课时</span>
              </div>
              <div className="pt-8 text-xs text-muted-foreground">
                智象 AI 通识教育平台 · 教师备课资料
              </div>
            </div>
          </section>

          {/* 每一课 */}
          {lessonsToPrint.map((l, idx) => {
            const notes = getPrepareNotes(l.id);
            return (
              <section
                key={l.id}
                className="mb-12 pb-8 border-b border-border/50 last:border-b-0 print:break-after-page"
              >
                <header className="mb-6">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-primary font-bold text-lg">
                      第 {idx + 1} 课
                    </span>
                    <h2 className="text-2xl font-bold">{l.title}</h2>
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <span>📚 {l.unitTitle}</span>
                    <span>🎯 {l.gradeName}</span>
                    <span>⏱️ {l.duration} 分钟</span>
                    <span>🧩 {l.module}</span>
                  </div>
                </header>

                {/* 一、教学目标 */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold mb-3 text-primary flex items-center gap-2">
                    <span className="size-6 rounded bg-primary/10 text-primary flex items-center justify-center text-xs">
                      1
                    </span>
                    教学目标
                  </h3>
                  <ul className="space-y-1.5 pl-8 list-disc">
                    {l.objectives.map((obj, i) => (
                      <li key={i} className="text-foreground leading-relaxed">{obj}</li>
                    ))}
                  </ul>
                </div>

                {/* 二、教案要点 */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold mb-3 text-primary flex items-center gap-2">
                    <span className="size-6 rounded bg-primary/10 text-primary flex items-center justify-center text-xs">
                      2
                    </span>
                    教案要点
                  </h3>
                  <div className="pl-8 space-y-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">📌 导入</h4>
                      <p className="text-foreground/80 leading-relaxed">
                        {l.lessonPlan.introduction}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">🔑 教学重点</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {l.lessonPlan.keyPoints.map((kp, i) => (
                          <li key={i} className="text-foreground/80 leading-relaxed">
                            {kp}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">🎬 教学活动</h4>
                      <ol className="list-decimal pl-5 space-y-1">
                        {l.lessonPlan.activities.map((act, i) => (
                          <li key={i} className="text-foreground/80 leading-relaxed">
                            {act}
                          </li>
                        ))}
                      </ol>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">📝 课堂小结</h4>
                      <p className="text-foreground/80 leading-relaxed">
                        {l.lessonPlan.summary}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 三、课件大纲 */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold mb-3 text-primary flex items-center gap-2">
                    <span className="size-6 rounded bg-primary/10 text-primary flex items-center justify-center text-xs">
                      3
                    </span>
                    课件大纲（共 {l.courseware.slides} 页）
                  </h3>
                  <div className="pl-8">
                    {l.courseware.slidesDetail && l.courseware.slidesDetail.length > 0 ? (
                      <div className="space-y-2">
                        {l.courseware.slidesDetail.map((slide, i) => (
                          <div key={i} className="border border-border/60 rounded-lg p-3 bg-muted/20">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs text-muted-foreground bg-background px-1.5 py-0.5 rounded border border-border/60 font-mono">
                                P{i + 1}
                              </span>
                              <span className="font-semibold text-foreground text-sm">
                                {slide.title}
                              </span>
                            </div>
                            <ul className="text-xs text-foreground/70 space-y-0.5 pl-5 list-disc">
                              {slide.points.slice(0, 5).map((p, j) => (
                                <li key={j}>{p}</li>
                              ))}
                              {slide.points.length > 5 && (
                                <li className="list-none text-muted-foreground">
                                  … 等 {slide.points.length} 个要点
                                </li>
                              )}
                            </ul>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <ul className="list-disc pl-5 space-y-1">
                        {l.courseware.topics.map((topic, i) => (
                          <li key={i} className="text-foreground/80">{topic}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* 四、实验任务 */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold mb-3 text-primary flex items-center gap-2">
                    <span className="size-6 rounded bg-primary/10 text-primary flex items-center justify-center text-xs">
                      4
                    </span>
                    实验任务
                  </h3>
                  <div className="pl-8 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">🧪 {l.experiment.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 border border-amber-500/20">
                        难度：{l.experiment.difficulty}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-1">材料清单</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {l.experiment.materials.map((m, i) => (
                          <span
                            key={i}
                            className="text-xs px-2 py-1 bg-muted/50 border border-border/60 rounded"
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-1">实验步骤</h4>
                      <ol className="list-decimal pl-5 space-y-1">
                        {l.experiment.steps.map((step, i) => (
                          <li key={i} className="text-foreground/80 leading-relaxed">
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>

                {/* 五、作业布置 */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold mb-3 text-primary flex items-center gap-2">
                    <span className="size-6 rounded bg-primary/10 text-primary flex items-center justify-center text-xs">
                      5
                    </span>
                    作业布置
                  </h3>
                  <div className="pl-8">
                    <div className="inline-flex items-center gap-2 mb-2">
                      <span className="text-sm font-semibold text-foreground">
                        {l.homework.title}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
                        {l.homework.type}
                      </span>
                    </div>
                    <p className="text-foreground/80 leading-relaxed">
                      {l.homework.description}
                    </p>
                  </div>
                </div>

                {/* 六、硬件提示 */}
                {l.hardwareTips && l.hardwareTips.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold mb-3 text-primary flex items-center gap-2">
                      <span className="size-6 rounded bg-primary/10 text-primary flex items-center justify-center text-xs">
                        6
                      </span>
                      硬件支持
                    </h3>
                    <ul className="pl-8 list-disc space-y-1">
                      {l.hardwareTips.map((h, i) => (
                        <li key={i} className="text-foreground/80 leading-relaxed">
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 七、备课笔记 */}
                {notes && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold mb-3 text-primary flex items-center gap-2">
                      <span className="size-6 rounded bg-amber-500/20 text-amber-700 flex items-center justify-center text-xs">
                        📝
                      </span>
                      我的备课笔记
                    </h3>
                    <div className="pl-8 bg-amber-500/5 border border-amber-500/20 rounded-lg p-4">
                      <p className="text-foreground/80 leading-relaxed whitespace-pre-line text-sm">
                        {notes}
                      </p>
                    </div>
                  </div>
                )}
              </section>
            );
          })}

          {/* 页脚 */}
          <footer className="text-center text-xs text-muted-foreground pt-8 border-t border-border">
            <p>智象 AI 通识教育平台 · 仅供教学使用</p>
            <p className="mt-1">本资料由智象平台自动生成，教师可根据实际教学情况调整</p>
          </footer>
        </div>
      </div>

      <style>{`
        @media print {
          body {
            font-size: 12pt;
            line-height: 1.6;
          }
          .print-content h1 { font-size: 20pt; }
          .print-content h2 { font-size: 16pt; }
          .print-content h3 { font-size: 13pt; }
          .print-content h4 { font-size: 11pt; }
          @page {
            size: A4;
            margin: 20mm 18mm;
          }
        }
      `}</style>
    </div>
  );
}
