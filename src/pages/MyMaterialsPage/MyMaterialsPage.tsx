import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Image, Video, FileText, Code, FolderOpen, Search, Upload, Grid3X3, List, Download, Star, MoreHorizontal } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const mockMaterials = [
  { id: 1, name: 'AI通识入门-第1课课件', type: 'ppt', size: '12.5 MB', date: '2026-09-01', category: '课件' },
  { id: 2, name: '机器视觉应用-实验指导书', type: 'pdf', size: '3.2 MB', date: '2026-09-02', category: '文档' },
  { id: 3, name: '图像识别实验-演示视频', type: 'video', size: '45.8 MB', date: '2026-09-03', category: '视频' },
  { id: 4, name: '机器学习入门-源代码', type: 'code', size: '1.1 MB', date: '2026-09-04', category: '代码' },
  { id: 5, name: 'AI通识PBL项目-评价量表', type: 'pdf', size: '0.8 MB', date: '2026-09-05', category: '文档' },
  { id: 6, name: '初中视觉课-第3课课件', type: 'ppt', size: '18.3 MB', date: '2026-09-06', category: '课件' },
  { id: 7, name: '语音识别实验-素材包', type: 'folder', size: '—', date: '2026-09-07', category: '文件夹' },
  { id: 8, name: '高中算法课-练习题', type: 'pdf', size: '2.4 MB', date: '2026-09-08', category: '文档' },
];

const categories = ['全部', '课件', '文档', '视频', '代码', '文件夹'];

export default function MyMaterialsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredMaterials = mockMaterials.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = selectedCategory === '全部' || m.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ppt': return <FileText className="w-6 h-6 text-orange-500" />;
      case 'pdf': return <FileText className="w-6 h-6 text-red-500" />;
      case 'video': return <Video className="w-6 h-6 text-purple-500" />;
      case 'code': return <Code className="w-6 h-6 text-blue-500" />;
      case 'folder': return <FolderOpen className="w-6 h-6 text-amber-500" />;
      default: return <Image className="w-6 h-6 text-gray-500" />;
    }
  };

  const getTypeBg = (type: string) => {
    switch (type) {
      case 'ppt': return 'bg-orange-50';
      case 'pdf': return 'bg-red-50';
      case 'video': return 'bg-purple-50';
      case 'code': return 'bg-blue-50';
      case 'folder': return 'bg-amber-50';
      default: return 'bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 页面头部 */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-500 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <FolderOpen className="w-8 h-8" />
            <h1 className="text-3xl font-bold">我的素材库</h1>
          </div>
          <p className="text-white/80 text-lg">管理你的教学素材 — 课件、文档、视频、代码，一站式存储与管理</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* 工具栏 */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="搜索素材名称..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Upload className="w-4 h-4" />
              上传素材
            </Button>
            <div className="flex border rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 ${viewMode === 'grid' ? 'bg-primary text-white' : 'hover:bg-muted'}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 ${viewMode === 'list' ? 'bg-primary text-white' : 'hover:bg-muted'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 分类标签 */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-6">
          <TabsList>
            {categories.map((cat) => (
              <TabsTrigger key={cat} value={cat}>{cat}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* 统计信息 */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">共 {filteredMaterials.length} 个素材</p>
        </div>

        {/* 网格视图 */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredMaterials.map((material) => (
              <Card
                key={material.id}
                className="group cursor-pointer hover:shadow-lg transition-all duration-200 overflow-hidden"
              >
                <div className={`aspect-video ${getTypeBg(material.type)} flex items-center justify-center relative`}>
                  {getTypeIcon(material.type)}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 rounded-full bg-white/90 shadow-sm hover:bg-white">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                  <Badge className="absolute bottom-2 left-2 text-[10px] bg-white/90 text-foreground border-0">
                    {material.category}
                  </Badge>
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-sm truncate mb-1 group-hover:text-primary transition-colors">{material.name}</h3>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{material.size}</span>
                    <span>{material.date}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* 列表视图 */}
        {viewMode === 'list' && (
          <Card className="overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 text-sm font-medium">名称</th>
                  <th className="text-left p-4 text-sm font-medium">类型</th>
                  <th className="text-left p-4 text-sm font-medium">大小</th>
                  <th className="text-left p-4 text-sm font-medium">日期</th>
                  <th className="text-right p-4 text-sm font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredMaterials.map((material) => (
                  <tr key={material.id} className="border-t hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {getTypeIcon(material.type)}
                        <span className="font-medium">{material.name}</span>
                      </div>
                    </td>
                    <td className="p-4"><Badge variant="outline">{material.category}</Badge></td>
                    <td className="p-4 text-sm text-muted-foreground">{material.size}</td>
                    <td className="p-4 text-sm text-muted-foreground">{material.date}</td>
                    <td className="p-4 text-right">
                      <Button variant="ghost" size="sm" className="gap-1">
                        <Download className="w-3.5 h-3.5" />
                        下载
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}

        {filteredMaterials.length === 0 && (
          <div className="text-center py-16">
            <FolderOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">没有找到匹配的素材</p>
          </div>
        )}
      </div>
    </div>
  );
}
