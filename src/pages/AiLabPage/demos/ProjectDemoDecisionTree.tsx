import { useState, useMemo, useCallback } from 'react';
import { TreeDeciduous, Play, RotateCcw, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

interface DataItem {
  id: number;
  studyHours: number; // 学习时长 0-10
  attendance: number; // 出勤率 0-100
  homework: number; // 作业完成度 0-100
  result: '优秀' | '良好' | '及格';
}

function generateData(count: number): DataItem[] {
  const results: DataItem['result'][] = ['优秀', '良好', '及格'];
  return Array.from({ length: count }, (_, i) => {
    const studyHours = Math.random() * 10;
    const attendance = 30 + Math.random() * 70;
    const homework = 20 + Math.random() * 80;

    // 简单的分类规则（用于模拟标签）
    let result: DataItem['result'];
    const score = studyHours * 8 + attendance * 0.3 + homework * 0.3;
    if (score > 85) result = '优秀';
    else if (score > 60) result = '良好';
    else result = '及格';

    return {
      id: i + 1,
      studyHours: Number(studyHours.toFixed(1)),
      attendance: Math.round(attendance),
      homework: Math.round(homework),
      result,
    };
  });
}

interface TreeNode {
  id: string;
  feature?: string;
  threshold?: number;
  result?: string;
  left?: TreeNode;
  right?: TreeNode;
  gini?: number;
  samples?: number;
}

function calculateGini(items: DataItem[]): number {
  if (items.length === 0) return 0;
  const counts: Record<string, number> = {};
  items.forEach((item) => {
    counts[item.result] = (counts[item.result] || 0) + 1;
  });
  let gini = 1;
  Object.values(counts).forEach((c) => {
    gini -= (c / items.length) ** 2;
  });
  return gini;
}

function buildTree(items: DataItem[], depth: number = 0, maxDepth: number = 3): TreeNode {
  const id = `node-${depth}-${items.length}-${Math.random().toString(36).slice(2, 7)}`;

  if (depth >= maxDepth || items.length < 3) {
    // 叶子节点：多数投票
    const counts: Record<string, number> = {};
    items.forEach((item) => {
      counts[item.result] = (counts[item.result] || 0) + 1;
    });
    let maxCount = 0;
    let maxResult = items[0]?.result || '未知';
    Object.entries(counts).forEach(([r, c]) => {
      if (c > maxCount) {
        maxCount = c;
        maxResult = r;
      }
    });
    return {
      id,
      result: maxResult,
      gini: calculateGini(items),
      samples: items.length,
    };
  }

  // 找最优分裂特征和阈值
  const features = [
    { key: 'studyHours', name: '学习时长', min: 0, max: 10 },
    { key: 'attendance', name: '出勤率', min: 0, max: 100 },
    { key: 'homework', name: '作业完成', min: 0, max: 100 },
  ];

  let bestFeature = features[0];
  let bestThreshold = 5;
  let bestGiniGain = -Infinity;
  let bestLeft: DataItem[] = [];
  let bestRight: DataItem[] = [];

  const currentGini = calculateGini(items);

  features.forEach((f) => {
    const values = items.map((item) => item[f.key as keyof DataItem] as number);
    const sorted = [...new Set(values)].sort((a, b) => a - b);

    // 试几个阈值
    const thresholds = [];
    for (let i = 1; i < sorted.length; i++) {
      thresholds.push((sorted[i - 1] + sorted[i]) / 2);
    }
    if (thresholds.length === 0) return;

    thresholds.forEach((thresh) => {
      const left = items.filter((item) => (item[f.key as keyof DataItem] as number) < thresh);
      const right = items.filter((item) => (item[f.key as keyof DataItem] as number) >= thresh);
      if (left.length === 0 || right.length === 0) return;

      const weightedGini =
        (left.length / items.length) * calculateGini(left) +
        (right.length / items.length) * calculateGini(right);
      const giniGain = currentGini - weightedGini;

      if (giniGain > bestGiniGain) {
        bestGiniGain = giniGain;
        bestFeature = f;
        bestThreshold = thresh;
        bestLeft = left;
        bestRight = right;
      }
    });
  });

  return {
    id,
    feature: bestFeature.name,
    threshold: Number(bestThreshold.toFixed(1)),
    gini: currentGini,
    samples: items.length,
    left: buildTree(bestLeft, depth + 1, maxDepth),
    right: buildTree(bestRight, depth + 1, maxDepth),
  };
}

const RESULT_COLORS: Record<string, string> = {
  优秀: 'bg-emerald-500',
  良好: 'bg-blue-500',
  及格: 'bg-amber-500',
};

const RESULT_BG: Record<string, string> = {
  优秀: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  良好: 'bg-blue-100 text-blue-700 border-blue-200',
  及格: 'bg-amber-100 text-amber-700 border-amber-200',
};

export default function ProjectDemoDecisionTree() {
  const [dataCount, setDataCount] = useState(30);
  const [maxDepth, setMaxDepth] = useState(3);
  const [data, setData] = useState<DataItem[]>(() => generateData(30));
  const [tree, setTree] = useState<TreeNode | null>(null);
  const [treeBuilt, setTreeBuilt] = useState(false);

  const stats = useMemo(() => {
    const counts: Record<string, number> = { 优秀: 0, 良好: 0, 及格: 0 };
    data.forEach((d) => (counts[d.result] = (counts[d.result] || 0) + 1));
    return counts;
  }, [data]);

  const generateNewData = () => {
    const newData = generateData(dataCount);
    setData(newData);
    setTree(null);
    setTreeBuilt(false);
  };

  const buildDecisionTree = () => {
    const newTree = buildTree(data, 0, maxDepth);
    setTree(newTree);
    setTreeBuilt(true);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-3 items-center">
        <Button variant="outline" onClick={generateNewData}>
          <RotateCcw className="size-4 mr-2" />
          生成新数据
        </Button>
        <Button
          onClick={buildDecisionTree}
          className="bg-gradient-to-r from-emerald-600 to-teal-500"
        >
          <TreeDeciduous className="size-4 mr-2" />
          构建决策树
        </Button>

        <div className="flex items-center gap-3 ml-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">样本数</span>
            <div className="w-24">
              <Slider
                value={[dataCount]}
                onValueChange={(v) => setDataCount(v[0])}
                min={10}
                max={80}
                step={10}
              />
            </div>
            <span className="text-xs font-mono text-primary w-6">{dataCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">深度</span>
            <div className="w-20">
              <Slider
                value={[maxDepth]}
                onValueChange={(v) => setMaxDepth(v[0])}
                min={2}
                max={5}
                step={1}
              />
            </div>
            <span className="text-xs font-mono text-primary w-5">{maxDepth}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* 数据分布 */}
        <div className="p-4 rounded-xl bg-card border border-border/60">
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            📊 学生数据分布 ({data.length} 人)
          </h4>
          <div className="flex gap-2 mb-3">
            {Object.entries(stats).map(([r, c]) => (
              <Badge key={r} className={RESULT_BG[r]}>
                {r}: {c} 人
              </Badge>
            ))}
          </div>
          <div className="space-y-1.5 max-h-[280px] overflow-y-auto pr-1">
            {data.slice(0, 20).map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 p-2 rounded-lg bg-muted/30"
              >
                <span className="text-xs text-muted-foreground w-6">#{item.id}</span>
                <div className="flex-1 flex gap-3 text-xs">
                  <span className="w-16">学时 {item.studyHours}h</span>
                  <span className="w-16">出勤 {item.attendance}%</span>
                  <span className="w-16">作业 {item.homework}%</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${RESULT_BG[item.result]}`}>
                  {item.result}
                </span>
              </motion.div>
            ))}
            {data.length > 20 && (
              <p className="text-xs text-muted-foreground text-center py-1">
                还有 {data.length - 20} 条数据…
              </p>
            )}
          </div>
        </div>

        {/* 决策树可视化 */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50/50 to-teal-50/30 border border-emerald-100">
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            🌳 决策树结构
          </h4>

          <AnimatePresence mode="wait">
            {!treeBuilt ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-[280px] text-center"
              >
                <TreeDeciduous className="size-16 text-emerald-300 mb-3" />
                <p className="text-sm text-muted-foreground">点击「构建决策树」开始</p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  AI 会自动找出最优的分类规则
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="tree"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="overflow-auto max-h-[340px]"
              >
                <TreeVisualization node={tree!} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-100">
        <p className="text-sm text-amber-900">
          <strong>💡 决策树原理：</strong>
          像流程图一样，每次选一个最有区分度的特征（比如"学习时长是否大于5小时"），
          把数据分成两部分，不断递归直到分出最终类别。每个节点选特征的标准是
          <strong>基尼系数（Gini）</strong>——基尼越小，分类越"纯"。
        </p>
      </div>
    </div>
  );
}

function TreeVisualization({ node }: { node: TreeNode }) {
  const isLeaf = !!node.result;

  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`px-3 py-2 rounded-lg text-center text-xs ${
          isLeaf
            ? `${RESULT_COLORS[node.result || '']} text-white font-semibold min-w-[60px]`
            : 'bg-white border border-emerald-200 shadow-sm min-w-[100px]'
        }`}
      >
        {isLeaf ? (
          <div>{node.result}</div>
        ) : (
          <div>
            <div className="font-semibold text-emerald-700">
              {node.feature} ≤ {node.threshold}
            </div>
            <div className="text-[10px] text-muted-foreground mt-0.5">
              Gini: {node.gini?.toFixed(2)} · {node.samples}样本
            </div>
          </div>
        )}
      </motion.div>

      {!isLeaf && node.left && node.right && (
        <div className="flex justify-center gap-4 mt-4">
          <div className="flex flex-col items-center">
            <div className="text-[10px] text-emerald-600 mb-1 flex items-center">
              是 <ChevronRight className="size-3" />
            </div>
            <TreeVisualization node={node.left} />
          </div>
          <div className="flex flex-col items-center">
            <div className="text-[10px] text-rose-600 mb-1 flex items-center">
              否 <ChevronRight className="size-3" />
            </div>
            <TreeVisualization node={node.right} />
          </div>
        </div>
      )}
    </div>
  );
}
