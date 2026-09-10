import { useState, useMemo, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { PlayCircle, GraduationCap, BookOpen, ListOrdered } from 'lucide-react';
import { MOCK_COURSE_SUMMARY, type ICourseSummary } from '@/data/course-summary';
import { SAMPLE_COURSES } from '@/data/sample-courses';
import { sampleCoursesExtra } from '@/data/sample-courses-extra';
import { MOCK_CLASSES, type IClass } from '@/data/school-classes';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface StartClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultCourseId?: string;
  defaultLessonId?: string;
}

// 合并所有样板课 + 扩充课程
const ALL_SAMPLE_COURSES = [...SAMPLE_COURSES, ...sampleCoursesExtra];

const STORAGE_KEY_CLASS = 'zhixiang_last_class';
const STORAGE_KEY_COURSE = 'zhixiang_last_course';

export default function StartClassDialog({
  open,
  onOpenChange,
  defaultCourseId,
}: StartClassDialogProps) {
  const navigate = useNavigate();
  const [classId, setClassId] = useState<string>('');
  const [courseId, setCourseId] = useState<string>('');
  const [lessonId, setLessonId] = useState<string>('');

  // 打开时从 localStorage 读取上次选择
  useEffect(() => {
    if (open) {
      const lastClass = localStorage.getItem(STORAGE_KEY_CLASS) || '';
      const lastCourse = localStorage.getItem(STORAGE_KEY_COURSE) || '';

      // 校验班级是否还存在
      const validClass = MOCK_CLASSES.find((c) => c.id === lastClass);
      const initialClass = validClass ? lastClass : MOCK_CLASSES[0]?.id || '';
      setClassId(initialClass);

      // 课程优先用 defaultCourseId，其次用上次记忆的，最后根据班级学段选第一个
      if (defaultCourseId) {
        setCourseId(defaultCourseId);
      } else if (lastCourse) {
        const validCourse = MOCK_COURSE_SUMMARY.find((c) => c.id === lastCourse);
        if (validCourse) {
          setCourseId(lastCourse);
        } else {
          // 按班级学段匹配第一个
          const cls = MOCK_CLASSES.find((c) => c.id === initialClass);
          const matched = getCoursesForClass(cls);
          setCourseId(matched[0]?.id || '');
        }
      } else {
        const cls = MOCK_CLASSES.find((c) => c.id === initialClass);
        const matched = getCoursesForClass(cls);
        setCourseId(matched[0]?.id || '');
      }

      setLessonId('');
    }
  }, [open, defaultCourseId]);

  // 根据班级获取对应学段的课程
  function getCoursesForClass(cls?: IClass): ICourseSummary[] {
    if (!cls) return MOCK_COURSE_SUMMARY;
    const gradeLevel = cls.gradeLevel;
    if (gradeLevel <= 3) {
      return MOCK_COURSE_SUMMARY.filter((c) => c.stage === 'primary-low');
    }
    if (gradeLevel <= 6) {
      return MOCK_COURSE_SUMMARY.filter(
        (c) => c.stage === 'primary-low' || c.stage === 'primary-high',
      );
    }
    if (gradeLevel <= 9) {
      return MOCK_COURSE_SUMMARY.filter(
        (c) => c.stage === 'junior' || c.stage === 'primary-high',
      );
    }
    return MOCK_COURSE_SUMMARY.filter((c) => c.stage === 'senior' || c.stage === 'junior');
  }

  // 当前班级
  const currentClass = useMemo<IClass | undefined>(
    () => MOCK_CLASSES.find((c) => c.id === classId),
    [classId],
  );

  // 根据班级学段筛选课程
  const availableCourses = useMemo<ICourseSummary[]>(
    () => getCoursesForClass(currentClass),
    [currentClass],
  );

  // 班级变化时，如果当前课程不在可用列表，自动选第一个
  useEffect(() => {
    if (classId && courseId && !availableCourses.find((c) => c.id === courseId)) {
      setCourseId(availableCourses[0]?.id || '');
      setLessonId('');
    }
  }, [classId, availableCourses, courseId]);

  // 当前选择的课程
  const currentCourse = useMemo<ICourseSummary | undefined>(
    () => MOCK_COURSE_SUMMARY.find((c) => c.id === courseId),
    [courseId],
  );

  // 课时列表
  const lessonOptions = useMemo(() => {
    if (!courseId) return [];
    const sampleCourse = ALL_SAMPLE_COURSES.find((c) => c.id === courseId);
    if (sampleCourse) {
      return sampleCourse.units.flatMap((u) =>
        u.lessons.map((l) => ({
          id: l.id,
          label: `第${l.index}课 ${l.title}`,
          index: l.index,
          unitId: u.id,
          unitTitle: u.title,
        })),
      );
    }
    // 用 course-summary 的课时数生成
    const summary = MOCK_COURSE_SUMMARY.find((c) => c.id === courseId);
    if (summary) {
      const lessons: { id: string; label: string; index: number; unitId: string; unitTitle: string }[] = [];
      const unitCount = Math.ceil(summary.totalLessons / 5);
      for (let u = 0; u < unitCount; u++) {
        const unitTitle = `第${u + 1}单元`;
        const lessonsInUnit = Math.min(5, summary.totalLessons - u * 5);
        for (let l = 0; l < lessonsInUnit; l++) {
          const idx = u * 5 + l + 1;
          lessons.push({
            id: `${summary.id}-l${idx}`,
            label: `第${idx}课 课时${idx}`,
            index: idx,
            unitId: `${summary.id}-u${u + 1}`,
            unitTitle,
          });
        }
      }
      return lessons;
    }
    return [];
  }, [courseId]);

  // 当前选中的课时序号
  const currentLessonIndex = useMemo(() => {
    const lesson = lessonOptions.find((l) => l.id === lessonId);
    return lesson?.index;
  }, [lessonOptions, lessonId]);

  const handleConfirm = () => {
    if (!classId) {
      toast.warning('请选择班级');
      return;
    }
    if (!courseId) {
      toast.warning('请选择课程');
      return;
    }
    if (!lessonId) {
      toast.warning('请选择课时');
      return;
    }

    // 保存到 localStorage
    try {
      localStorage.setItem(STORAGE_KEY_CLASS, classId);
      localStorage.setItem(STORAGE_KEY_COURSE, courseId);

      const classInfo = {
        classId,
        className: currentClass?.name || '',
        courseId,
        courseName: currentCourse?.title || '',
        lessonId,
        lessonName: lessonOptions.find((l) => l.id === lessonId)?.label || '',
        startTime: new Date().toISOString(),
      };
      localStorage.setItem('zhixiang_current_teach_class', JSON.stringify(classInfo));
    } catch (e) {
      // ignore
    }

    toast.success('正在进入授课模式…');
    onOpenChange(false);
    navigate(`/teach/${courseId}?lesson=${lessonId}&class=${classId}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <PlayCircle className="size-5 text-primary" />
            开课设置
          </DialogTitle>
          <DialogDescription>选择班级、课程和课时，开始你的AI课堂</DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* 选择班级 */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <GraduationCap className="size-4 text-primary" />
              选择班级
            </Label>
            <Select value={classId} onValueChange={setClassId}>
              <SelectTrigger className="w-full h-11">
                <SelectValue placeholder="请选择授课班级" />
              </SelectTrigger>
              <SelectContent>
                {MOCK_CLASSES.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    <span className="flex items-center justify-between w-full gap-4">
                      <span>{c.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {c.studentCount}人
                      </span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {currentClass && (
              <p className="text-xs text-muted-foreground">
                {currentClass.grade} · {currentClass.studentCount}名学生 · {currentClass.stage}
              </p>
            )}
          </div>

          {/* 选择课程 */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <BookOpen className="size-4 text-primary" />
              选择课程
            </Label>
            <Select value={courseId} onValueChange={(v) => { setCourseId(v); setLessonId(''); }}>
              <SelectTrigger className="w-full h-11">
                <SelectValue placeholder="请选择授课课程" />
              </SelectTrigger>
              <SelectContent>
                {availableCourses.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    <span className="flex items-center justify-between w-full gap-4">
                      <span>{c.title}</span>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {c.totalLessons}课时
                      </span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {currentCourse && (
              <p className="text-xs text-muted-foreground">
                {currentCourse.stageLabel} · {currentCourse.difficulty}难度 · 共{currentCourse.totalLessons}课时
              </p>
            )}
          </div>

          {/* 选择课时 */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <ListOrdered className="size-4 text-primary" />
              选择课时
            </Label>
            <Select value={lessonId} onValueChange={setLessonId} disabled={!courseId}>
              <SelectTrigger className="w-full h-11">
                <SelectValue placeholder={courseId ? '请选择授课课时' : '请先选择课程'} />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {lessonOptions.map((l) => (
                  <SelectItem key={l.id} value={l.id}>
                    <span className="text-sm">{l.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {currentLessonIndex && (
              <p className="text-xs text-muted-foreground">
                第 {currentLessonIndex} 课时 · 40 分钟
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleConfirm}
            className="w-full h-11 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            <PlayCircle className="size-4 mr-1.5" />
            确定上课
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
