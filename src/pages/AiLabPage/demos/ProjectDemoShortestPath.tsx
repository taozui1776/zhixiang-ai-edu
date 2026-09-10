import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, RotateCcw, MapPin, Route, Zap, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface Node {
  id: number;
  x: number;
  y: number;
  label: string;
}

interface Edge {
  from: number;
  to: number;
  weight: number;
}

const CANVAS_W = 600;
const CANVAS_H = 380;

type Algorithm = 'dijkstra' | 'bfs';

// 生成随机图
function generateGraph(nodeCount: number): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

  // 在画布上均匀分布节点
  const cols = Math.ceil(Math.sqrt(nodeCount * 1.5));
  const rows = Math.ceil(nodeCount / cols);

  for (let i = 0; i < nodeCount; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const cellW = CANVAS_W / cols;
    const cellH = CANVAS_H / rows;
    nodes.push({
      id: i,
      x: cellW * (col + 0.5) + (Math.random() - 0.5) * cellW * 0.5,
      y: cellH * (row + 0.5) + (Math.random() - 0.5) * cellH * 0.5,
      label: labels[i] || `N${i + 1}`,
    });
  }

  // 生成边：每个节点连接最近的 2-3 个节点
  const edges: Edge[] = [];
  const edgeSet = new Set<string>();

  for (let i = 0; i < nodeCount; i++) {
    // 计算距离
    const dists: { to: number; dist: number }[] = [];
    for (let j = 0; j < nodeCount; j++) {
      if (i === j) continue;
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      dists.push({ to: j, dist: Math.sqrt(dx * dx + dy * dy) });
    }
    dists.sort((a, b) => a.dist - b.dist);

    // 连最近的 2-3 个
    const connectCount = 2 + Math.floor(Math.random() * 2);
    for (let k = 0; k < connectCount && k < dists.length; k++) {
      const j = dists[k].to;
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (!edgeSet.has(key)) {
        edgeSet.add(key);
        edges.push({
          from: i,
          to: j,
          weight: Math.round(dists[k].dist / 10),
        });
      }
    }
  }

  // 确保图连通（简单处理：再补一些边）
  for (let i = 1; i < nodeCount; i++) {
    const hasEdge = edges.some((e) => e.from === i || e.to === i);
    if (!hasEdge) {
      edges.push({ from: i, to: 0, weight: 30 + Math.floor(Math.random() * 30) });
    }
  }

  return { nodes, edges };
}

// 邻接表
function buildAdjList(nodes: Node[], edges: Edge[]): Map<number, { to: number; weight: number }[]> {
  const adj = new Map<number, { to: number; weight: number }[]>();
  nodes.forEach((n) => adj.set(n.id, []));
  edges.forEach((e) => {
    adj.get(e.from)?.push({ to: e.to, weight: e.weight });
    adj.get(e.to)?.push({ to: e.from, weight: e.weight });
  });
  return adj;
}

// Dijkstra 算法
function dijkstra(
  nodes: Node[],
  edges: Edge[],
  start: number,
  end: number,
): { steps: { visited: number[]; current: number; distances: number[] }[]; path: number[]; totalDist: number } {
  const adj = buildAdjList(nodes, edges);
  const n = nodes.length;
  const dist = new Array(n).fill(Infinity);
  const prev = new Array(n).fill(-1);
  const visited = new Set<number>();
  const steps: { visited: number[]; current: number; distances: number[] }[] = [];

  dist[start] = 0;

  while (visited.size < n) {
    // 找未访问中距离最小的
    let minDist = Infinity;
    let u = -1;
    for (let i = 0; i < n; i++) {
      if (!visited.has(i) && dist[i] < minDist) {
        minDist = dist[i];
        u = i;
      }
    }
    if (u === -1) break;

    visited.add(u);
    steps.push({
      visited: [...visited],
      current: u,
      distances: [...dist],
    });

    if (u === end) break;

    // 松弛
    const neighbors = adj.get(u) || [];
    for (const { to, weight } of neighbors) {
      if (!visited.has(to) && dist[u] + weight < dist[to]) {
        dist[to] = dist[u] + weight;
        prev[to] = u;
      }
    }
  }

  // 回溯路径
  const path: number[] = [];
  let cur = end;
  if (dist[end] < Infinity) {
    while (cur !== -1) {
      path.unshift(cur);
      cur = prev[cur];
    }
  }

  return { steps, path, totalDist: dist[end] };
}

export default function ProjectDemoShortestPath() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodeCount, setNodeCount] = useState(8);
  const [algorithm, setAlgorithm] = useState<Algorithm>('dijkstra');
  const [graph, setGraph] = useState(() => generateGraph(8));
  const [startNode, setStartNode] = useState(0);
  const [endNode, setEndNode] = useState(1);
  const [stepIdx, setStepIdx] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [result, setResult] = useState<{ path: number[]; totalDist: number; steps: any[] } | null>(null);

  const regenerate = () => {
    const newGraph = generateGraph(nodeCount);
    setGraph(newGraph);
    setStartNode(0);
    setEndNode(1);
    setStepIdx(-1);
    setIsPlaying(false);
    setResult(null);
  };

  const startAlgorithm = () => {
    if (algorithm === 'dijkstra') {
      const res = dijkstra(graph.nodes, graph.edges, startNode, endNode);
      setResult({ path: res.path, totalDist: res.totalDist, steps: res.steps });
      setStepIdx(-1);
      setIsPlaying(true);
    }
  };

  // 自动播放
  useEffect(() => {
    if (!isPlaying || !result) return;
    if (stepIdx >= result.steps.length - 1) {
      setIsPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      setStepIdx((s) => s + 1);
    }, 400);

    return () => clearTimeout(timer);
  }, [isPlaying, stepIdx, result]);

  // 绘制
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = CANVAS_W;
    canvas.height = CANVAS_H;

    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // 网格
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let x = 0; x < CANVAS_W; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CANVAS_H);
      ctx.stroke();
    }
    for (let y = 0; y < CANVAS_H; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(CANVAS_W, y);
      ctx.stroke();
    }

    const currentStep = stepIdx >= 0 && result ? result.steps[stepIdx] : null;
    const visitedSet = new Set(currentStep?.visited || []);
    const pathSet = new Set<number>();
    const pathEdgeSet = new Set<string>();

    // 如果已完成，高亮路径
    if (stepIdx >= (result?.steps.length || 0) - 1 && result?.path.length) {
      result.path.forEach((n) => pathSet.add(n));
      for (let i = 0; i < result.path.length - 1; i++) {
        const key =
          result.path[i] < result.path[i + 1]
            ? `${result.path[i]}-${result.path[i + 1]}`
            : `${result.path[i + 1]}-${result.path[i]}`;
        pathEdgeSet.add(key);
      }
    }

    // 画边
    graph.edges.forEach((edge) => {
      const from = graph.nodes[edge.from];
      const to = graph.nodes[edge.to];
      const key = edge.from < edge.to ? `${edge.from}-${edge.to}` : `${edge.to}-${edge.from}`;

      const isPathEdge = pathEdgeSet.has(key);

      ctx.strokeStyle = isPathEdge ? '#ef4444' : '#cbd5e1';
      ctx.lineWidth = isPathEdge ? 4 : 2;
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();

      // 权重标签
      const midX = (from.x + to.x) / 2;
      const midY = (from.y + to.y) / 2;
      ctx.fillStyle = isPathEdge ? '#ef4444' : '#64748b';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(String(edge.weight), midX, midY - 3);
    });

    // 画节点
    graph.nodes.forEach((node) => {
      const isStart = node.id === startNode;
      const isEnd = node.id === endNode;
      const isCurrent = currentStep?.current === node.id;
      const isVisited = visitedSet.has(node.id);
      const isPath = pathSet.has(node.id);

      let fillColor = '#ffffff';
      let strokeColor = '#94a3b8';
      let textColor = '#334155';

      if (isPath) {
        fillColor = '#ef4444';
        strokeColor = '#b91c1c';
        textColor = '#ffffff';
      } else if (isCurrent) {
        fillColor = '#f59e0b';
        strokeColor = '#d97706';
        textColor = '#ffffff';
      } else if (isStart) {
        fillColor = '#10b981';
        strokeColor = '#059669';
        textColor = '#ffffff';
      } else if (isEnd) {
        fillColor = '#3b82f6';
        strokeColor = '#2563eb';
        textColor = '#ffffff';
      } else if (isVisited) {
        fillColor = '#ddd6fe';
        strokeColor = '#8b5cf6';
      }

      ctx.fillStyle = fillColor;
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(node.x, node.y, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // 文字
      ctx.fillStyle = textColor;
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.label, node.x, node.y);

      // 距离标签
      if (currentStep && currentStep.distances[node.id] < Infinity) {
        ctx.fillStyle = '#6366f1';
        ctx.font = 'bold 10px sans-serif';
        ctx.fillText(String(currentStep.distances[node.id]), node.x, node.y - 26);
      }
    });
  }, [graph, startNode, endNode, stepIdx, result]);

  useEffect(() => {
    draw();
  }, [draw]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // 找最近的节点
    let minDist = Infinity;
    let nearest = -1;
    graph.nodes.forEach((n) => {
      const d = Math.sqrt((n.x - x) ** 2 + (n.y - y) ** 2);
      if (d < minDist && d < 30) {
        minDist = d;
        nearest = n.id;
      }
    });

    if (nearest >= 0) {
      // Shift+点击设为终点，否则设为起点
      if (e.shiftKey) {
        setEndNode(nearest);
      } else {
        setStartNode(nearest);
      }
      setStepIdx(-1);
      setResult(null);
      setIsPlaying(false);
    }
  };

  const stepToEnd = () => {
    if (result) {
      setStepIdx(result.steps.length - 1);
      setIsPlaying(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-3 items-center">
        <Button variant="outline" onClick={regenerate}>
          <RotateCcw className="size-4 mr-2" />
          重新生成图
        </Button>
        <Button
          onClick={startAlgorithm}
          className="bg-gradient-to-r from-indigo-600 to-violet-500"
        >
          <Play className="size-4 mr-2" />
          运行 {algorithm === 'dijkstra' ? 'Dijkstra' : 'BFS'}
        </Button>
        {result && stepIdx < result.steps.length - 1 && (
          <Button variant="outline" onClick={stepToEnd}>
            <Zap className="size-4 mr-2" />
            直接到结果
          </Button>
        )}

        <div className="flex gap-1 p-1 bg-muted/50 rounded-lg ml-auto">
          <RadioGroup
            value={algorithm}
            onValueChange={(v) => setAlgorithm(v as Algorithm)}
            className="flex"
          >
            <div className="flex items-center">
              <RadioGroupItem value="dijkstra" id="dijkstra" className="sr-only peer" />
              <Label
                htmlFor="dijkstra"
                className="px-3 py-1.5 text-xs rounded-md cursor-pointer peer-data-[state=checked]:bg-white peer-data-[state=checked]:text-primary peer-data-[state=checked]:shadow-sm"
              >
                Dijkstra 算法
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="rounded-xl overflow-hidden border border-border/60 bg-card shadow-sm">
            <canvas
              ref={canvasRef}
              width={CANVAS_W}
              height={CANVAS_H}
              className="w-full cursor-pointer block"
              onClick={handleCanvasClick}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            💡 点击节点设为起点，Shift+点击设为终点。起点为绿，终点为蓝。
          </p>
        </div>

        <div className="w-full md:w-56 space-y-3">
          <div className="p-4 rounded-xl bg-card border border-border/60 space-y-2">
            <p className="text-xs text-muted-foreground mb-1">节点数量</p>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={5}
                max={12}
                value={nodeCount}
                onChange={(e) => setNodeCount(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm font-mono text-primary w-5">{nodeCount}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border/60 space-y-3">
            <div className="flex items-center gap-2">
              <div className="size-4 rounded-full bg-emerald-500" />
              <span className="text-xs">起点：{graph.nodes[startNode]?.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-4 rounded-full bg-blue-500" />
              <span className="text-xs">终点：{graph.nodes[endNode]?.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-4 rounded-full bg-violet-300" />
              <span className="text-xs">已访问节点</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-4 rounded-full bg-amber-500" />
              <span className="text-xs">当前处理</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-4 rounded-full bg-red-500" />
              <span className="text-xs">最短路径</span>
            </div>
          </div>

          {result && stepIdx >= result.steps.length - 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white"
            >
              <div className="flex items-center gap-2 mb-2">
                <Flag className="size-4" />
                <span className="text-xs font-medium">找到最短路径</span>
              </div>
              <p className="text-xs text-white/80 mb-1">路径</p>
              <p className="text-sm font-bold mb-2">
                {result.path.map((i) => graph.nodes[i]?.label).join(' → ')}
              </p>
              <p className="text-xs text-white/80">
                总距离：<span className="text-lg font-bold">{result.totalDist}</span>
              </p>
            </motion.div>
          )}
        </div>
      </div>

      <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100">
        <p className="text-sm text-indigo-900">
          <strong>💡 Dijkstra 最短路径算法：</strong>
          从起点出发，每次选一个离起点最近的未访问节点，更新它所有邻居的距离，
          不断重复直到到达终点。就像往水里扔石头，波纹一圈圈扩散，最先到达终点的那条路径就是最短的。
          这是图论中最经典的算法之一，在导航、网络路由等领域广泛应用。
        </p>
      </div>
    </div>
  );
}
