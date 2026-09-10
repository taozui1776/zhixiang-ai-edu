// EXPORTS: streamChat, getAiConfig, saveAiConfig, testAiConnection
// 统一AI调用客户端 - OpenAI 兼容 API（默认 DeepSeek）

const STORAGE_KEY_API_KEY = 'zhixiang_ai_api_key';
const STORAGE_KEY_BASE_URL = 'zhixiang_ai_base_url';
const STORAGE_KEY_MODEL = 'zhixiang_ai_model';

export interface AiConfig {
  apiKey: string;
  baseURL: string;
  model: string;
}

const DEFAULT_BASE_URL = 'https://api.deepseek.com';
const DEFAULT_MODEL = 'deepseek-chat';

export function getAiConfig(): AiConfig {
  let envKey = '';
  try {
    const metaEnv = (import.meta as unknown as { env?: Record<string, string> }).env;
    if (metaEnv?.VITE_AI_API_KEY) envKey = metaEnv.VITE_AI_API_KEY;
  } catch {
    // ignore
  }
  const storedKey = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY_API_KEY) || '' : '';
  const apiKey = storedKey || envKey;

  const baseURL =
    typeof localStorage !== 'undefined'
      ? localStorage.getItem(STORAGE_KEY_BASE_URL) || DEFAULT_BASE_URL
      : DEFAULT_BASE_URL;
  const model =
    typeof localStorage !== 'undefined'
      ? localStorage.getItem(STORAGE_KEY_MODEL) || DEFAULT_MODEL
      : DEFAULT_MODEL;

  return { apiKey, baseURL, model };
}

export function saveAiConfig(config: Partial<AiConfig>) {
  if (typeof localStorage === 'undefined') return;
  if (config.apiKey !== undefined) {
    if (config.apiKey) localStorage.setItem(STORAGE_KEY_API_KEY, config.apiKey);
    else localStorage.removeItem(STORAGE_KEY_API_KEY);
  }
  if (config.baseURL !== undefined) {
    if (config.baseURL && config.baseURL !== DEFAULT_BASE_URL) {
      localStorage.setItem(STORAGE_KEY_BASE_URL, config.baseURL);
    } else {
      localStorage.removeItem(STORAGE_KEY_BASE_URL);
    }
  }
  if (config.model !== undefined) {
    if (config.model && config.model !== DEFAULT_MODEL) {
      localStorage.setItem(STORAGE_KEY_MODEL, config.model);
    } else {
      localStorage.removeItem(STORAGE_KEY_MODEL);
    }
  }
}

export function hasAiApiKey(): boolean {
  const { apiKey } = getAiConfig();
  return !!apiKey?.trim();
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface StreamChatOptions {
  messages: ChatMessage[];
  onChunk: (text: string) => void;
  signal?: AbortSignal;
  config?: Partial<AiConfig>;
}

/**
 * 流式聊天，逐字回调 onChunk。
 */
export async function streamChat({ messages, onChunk, signal, config: customConfig }: StreamChatOptions): Promise<string> {
  const cfg = { ...getAiConfig(), ...customConfig };
  if (!cfg.apiKey) {
    throw new Error('AI_API_KEY_MISSING');
  }

  const url = `${cfg.baseURL.replace(/\/$/, '')}/chat/completions`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cfg.apiKey}`,
    },
    body: JSON.stringify({
      model: cfg.model,
      messages,
      stream: true,
      temperature: 0.7,
    }),
    signal,
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(`API 请求失败 (${response.status})：${errText.slice(0, 200)}`);
  }

  if (!response.body) {
    throw new Error('响应体为空');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let full = '';
  let buffer = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    // SSE 按行解析，data: {...}  /  data: [DONE]
    const lines = buffer.split('\n');
    buffer = lines.pop() || ''; // 最后一行可能不完整，留到下次

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith('data:')) continue;
      const dataStr = trimmed.slice(5).trim();
      if (!dataStr) continue;
      if (dataStr === '[DONE]') continue;
      try {
        const data = JSON.parse(dataStr);
        const delta = data.choices?.[0]?.delta?.content;
        if (delta) {
          full += delta;
          onChunk(delta);
        }
      } catch {
        // 忽略解析失败的行
      }
    }
  }

  return full;
}

/**
 * 测试API连接是否可用
 */
export async function testAiConnection(customConfig?: Partial<AiConfig>): Promise<boolean> {
  const cfg = { ...getAiConfig(), ...customConfig };
  if (!cfg.apiKey) return false;

  try {
    const url = `${cfg.baseURL.replace(/\/$/, '')}/chat/completions`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cfg.apiKey}`,
      },
      body: JSON.stringify({
        model: cfg.model,
        messages: [{ role: 'user', content: 'hi' }],
        stream: false,
        max_tokens: 5,
      }),
    });
    return response.ok;
  } catch {
    return false;
  }
}
