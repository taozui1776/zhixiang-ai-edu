import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Crown, Lock, Check, ChevronRight, Shield, BarChart3, Users, Building2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSubscription, PLAN_LABELS } from '@/hooks/use-subscription';

interface UpgradePromptProps {
  featureName: string;
  featureDescription?: string;
}

const PRO_FEATURES = [
  { icon: BarChart3, name: '学情中心', desc: '多维度数据分析，掌握教学效果' },
  { icon: Users, name: '班级管理', desc: '班级与学生管理，批量布置任务' },
  { icon: Building2, name: '学校管理后台', desc: '教师账号、数据看板、资源管理' },
];

export default function UpgradePrompt({ featureName, featureDescription }: UpgradePromptProps) {
  const navigate = useNavigate();
  const { subscription, plan } = useSubscription();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-background to-indigo-50/50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl"
      >
        <Card className="border-0 shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-slate-900 to-indigo-900 px-8 py-10 text-white">
            <div className="flex items-start gap-4">
              <div className="size-14 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center shrink-0">
                <Lock className="size-7 text-white/80" />
              </div>
              <div className="flex-1">
                <Badge className="bg-amber-500/20 text-amber-300 border-0 mb-3">
                  <Shield className="size-3 mr-1" />
                  当前版本：{PLAN_LABELS[plan]}
                </Badge>
                <h1 className="text-2xl md:text-3xl font-bold">
                  {featureName} 需升级至专业版
                </h1>
                {featureDescription && (
                  <p className="text-white/70 mt-2 text-sm md:text-base">
                    {featureDescription}
                  </p>
                )}
              </div>
            </div>
          </div>

          <CardContent className="p-6 md:p-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Crown className="size-5 text-amber-500" />
              升级到专业版，解锁全部功能
            </h3>

            <div className="grid gap-3 mb-6">
              {PRO_FEATURES.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.name}
                    className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100"
                  >
                    <div className="size-9 rounded-lg bg-emerald-500 flex items-center justify-center text-white shrink-0">
                      <Icon className="size-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{feature.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {feature.desc}
                      </div>
                    </div>
                    <Check className="size-5 text-emerald-500 shrink-0" />
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                className="flex-1"
                onClick={() => navigate('/pricing')}
              >
                立即升级
                <ChevronRight className="size-4 ml-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="flex-1"
                onClick={() => navigate(-1)}
              >
                返回上一页
              </Button>
            </div>

            {subscription.expireAt && (
              <p className="text-xs text-muted-foreground text-center mt-4">
                当前订阅有效期至 {subscription.expireAt}
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
