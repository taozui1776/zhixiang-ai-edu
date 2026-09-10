import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, FileText, Search, Filter, ChevronRight, Play, Download, Star, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MOCK_COURSE_SUMMARY } from '@/data/course-summary';

export default function PreparePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState('全部');

  const stages = ['全部', '小学低段', '小学高段', '初中', '高中'];

  const filteredCourses = MOCK_COURSE_SUMMARY.filter((course) => {
    const matchSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStage = selectedStage === '全部' || course.stageLabel === selectedStage;
    return matchSearch && matchStage;
  });

  const getGradient = (id: string) => {
    const gradients = [
      'from-blue-500 to-cyan-400',
      'from-purple-500 to-pink-400',
      'from-orange-500 to-amber-400',
      'from-emerald-500 to-teal-400',
      'from-rose-500 to-red-400',
    ];
    const index = id.charCodeAt(id.length - 1) % gradients.length;
    return gradients[index];
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 页面头部 */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-8 h-8" />
            <h1 className="text-3xl font-bold">备课工作台</h1>
          </div>
          <p className="text-white/80 text-lg">课前准备，资源齐备 — 选择课程，查看教案、课件和实验指导</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* 搜索和筛选 */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="搜索课程名称、知识点、标签..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {stages.map((stage) => (
              <Button
                key={stage}
                variant={selectedStage === stage ? 'default' : 'outline'}
                onClick={() => setSelectedStage(stage)}
                className="whitespace-nowrap"
              >
                {stage}
              </Button>
            ))}
          </div>
        </div>

        {/* 快捷功能 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/ai-tools')}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-semibold">AI备课助手</div>
                <div className="text-xs text-muted-foreground">智能生成教案</div>
              </div>
            </div>
          </Card>
          <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/ai-lab')}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <Play className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-semibold">AI实验室</div>
                <div className="text-xs text-muted-foreground">23个实验即开即用</div>
              </div>
            </div>
          </Card>
          <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/coding-lab')}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-semibold">编程工具</div>
                <div className="text-xs text-muted-foreground">13款开源编程环境</div>
              </div>
            </div>
          </Card>
          <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/teacher-training')}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-semibold">教师培训</div>
                <div className="text-xs text-muted-foreground">12个使用教程</div>
              </div>
            </div>
          </Card>
        </div>

        {/* 课程列表 */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">全部课程 <span className="text-muted-foreground font-normal">共 {filteredCourses.length} 门</span></h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card
              key={course.id}
              className="group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden border-border/60"
              onClick={() => navigate(`/courses/${course.id}`)}
            >
              <div className={`relative aspect-video overflow-hidden bg-gradient-to-br ${getGradient(course.id)}`}>
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-white/90 text-5xl font-bold opacity-30">{course.title.charAt(0)}</span>
                </div>
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge className="text-[10px] bg-white/90 text-foreground border-0">
                    {course.stageLabel}
                  </Badge>
                  <Badge className="text-[10px] bg-white/90 text-foreground border-0">
                    {course.difficulty}
                  </Badge>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">{course.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{course.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{Math.floor(course.duration / 60)}课时</span>
                    <span>·</span>
                    <span>{course.category}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-16">
            <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">没有找到匹配的课程</p>
          </div>
        )}
      </div>
    </div>
  );
}
