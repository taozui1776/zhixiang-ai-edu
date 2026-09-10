import { useState, useCallback } from 'react';
import {
  Cpu,
  Usb,
  ChevronDown,
  Wifi,
  WifiOff,
  CheckCircle2,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

type HardwareStatus = 'disconnected' | 'connecting' | 'connected';

interface HardwareStatusBarProps {
  status: HardwareStatus;
  deviceName?: string;
  deviceType?: string;
  onOpenConsole: () => void;
}

const STATUS_CONFIG: Record<HardwareStatus, { label: string; color: string; icon: typeof Wifi }> = {
  disconnected: { label: '未连接', color: 'text-white/40', icon: WifiOff },
  connecting: { label: '连接中', color: 'text-blue-400', icon: Wifi },
  connected: { label: '已连接', color: 'text-emerald-400', icon: CheckCircle2 },
};

export default function HardwareStatusBar({
  status,
  deviceName,
  deviceType,
  onOpenConsole,
}: HardwareStatusBarProps) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
          <div className={`relative ${status === 'connecting' ? 'animate-pulse' : ''}`}>
            <Cpu className={`size-4 ${config.color}`} />
            {status === 'connected' && (
              <span className="absolute -right-0.5 -bottom-0.5 size-2 rounded-full bg-emerald-400 border-2 border-slate-900" />
            )}
          </div>
          <span className={`text-xs ${config.color} hidden md:inline`}>
            {status === 'connected' && deviceName ? deviceName : config.label}
          </span>
          <ChevronDown className="size-3 text-white/40" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60 bg-slate-900/95 border-white/15 text-white backdrop-blur-md">
        <DropdownMenuLabel className="text-white/50 text-xs">硬件连接状态</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/10" />

        {status === 'connected' ? (
          <DropdownMenuGroup>
            <div className="px-2 py-2">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="size-4 text-emerald-400" />
                <span className="text-sm font-medium">{deviceName}</span>
              </div>
              {deviceType && (
                <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 text-[10px]">
                  {deviceType}
                </Badge>
              )}
            </div>
          </DropdownMenuGroup>
        ) : (
          <div className="px-2 py-3">
            <div className="flex items-center gap-2 mb-1">
              <WifiOff className="size-4 text-white/40" />
              <span className="text-sm text-white/60">暂无硬件连接</span>
            </div>
            <p className="text-xs text-white/30 mt-1">
              连接硬件后可在此查看设备信息与端口状态
            </p>
          </div>
        )}

        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={onOpenConsole}
            className="text-sm text-white/80 hover:bg-white/10 hover:text-white cursor-pointer focus:bg-white/10"
          >
            <Usb className="size-4 mr-2" />
            打开串口控制台
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuLabel className="text-white/30 text-[10px]">支持的硬件</DropdownMenuLabel>
        <div className="px-2 pb-2 flex flex-wrap gap-1">
          {['AI视觉传感器', '掌控板', '行空板', 'micro:bit', 'Arduino'].map((hw) => (
            <Badge
              key={hw}
              variant="outline"
              className="border-white/10 text-white/50 text-[10px] bg-white/5"
            >
              {hw}
            </Badge>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
