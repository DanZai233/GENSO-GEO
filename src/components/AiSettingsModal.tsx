import { useEffect, useRef, useState } from 'react';
import { RefreshCw, Save, Sparkles, Trash2, X } from 'lucide-react';

/**
 * 前端 AI 模型设置面板:
 * 选择厂商 → 调用后端 /api/models 拉取该厂商支持的模型列表 → 选模型。
 * 配置保存在浏览器 localStorage,随生成请求以 modelConfig 传给后端,
 * 优先于服务器环境变量(留空则回退环境变量)。
 */

export interface AiModelConfig {
  provider: string;
  model: string;
  apiKey: string;
  baseUrl: string;
}

interface ProviderMeta {
  id: string;
  label: string;
  needsApiKey: boolean;
  note?: string;
}

const LS_KEY = 'genso-ai-config-v1';

export function loadAiConfig(): AiModelConfig | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const cfg = JSON.parse(raw);
      if (cfg && typeof cfg.provider === 'string') return cfg as AiModelConfig;
    }
  } catch {
    // ignore corrupt storage
  }
  return null;
}

export function clearAiConfig() {
  localStorage.removeItem(LS_KEY);
}

interface AiSettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AiSettingsModal({ open, onClose }: AiSettingsModalProps) {
  const [providers, setProviders] = useState<ProviderMeta[]>([]);
  const [cfg, setCfg] = useState<AiModelConfig>({ provider: '', model: '', apiKey: '', baseUrl: '' });
  const [models, setModels] = useState<string[]>([]);
  const [modelsSource, setModelsSource] = useState('');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const loaded = useRef(false);

  useEffect(() => {
    if (!open) return;
    if (!loaded.current) {
      loaded.current = true;
      const saved = loadAiConfig();
      if (saved) setCfg(saved);
      fetch('/api/providers')
        .then((r) => r.json())
        .then((d) => {
          const list = (d.providers || []) as ProviderMeta[];
          setProviders(list);
          setCfg((c) => ({ ...c, provider: c.provider || list[0]?.id || '' }));
        })
        .catch(() => setStatus('加载厂商列表失败'));
    }
  }, [open]);

  // 切换厂商后自动拉取模型列表
  useEffect(() => {
    if (open && cfg.provider) {
      void refreshModels(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cfg.provider, open]);

  async function refreshModels(showStatus: boolean) {
    if (!cfg.provider || busy) return;
    setBusy(true);
    if (showStatus) setStatus('获取模型列表…');
    try {
      const resp = await fetch('/api/models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: cfg.provider,
          apiKey: cfg.apiKey || null,
          baseUrl: cfg.baseUrl || null,
        }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || `HTTP ${resp.status}`);
      setModels(data.models || []);
      setModelsSource(data.source === 'api' ? '来自厂商 API' : '端点不支持列表,已用内置注册表');
      setCfg((c) => ({
        ...c,
        model: c.model && (data.models || []).includes(c.model) ? c.model : (data.models?.[0] || c.model || ''),
      }));
      setStatus(showStatus ? `已获取 ${data.models?.length || 0} 个模型(${modelsSource === 'api' ? '来自厂商 API' : '内置注册表'})` : '');
    } catch (err) {
      setStatus(`✗ ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setBusy(false);
    }
  }

  function save() {
    localStorage.setItem(LS_KEY, JSON.stringify({ ...cfg, apiKey: cfg.apiKey.trim(), baseUrl: cfg.baseUrl.trim() }));
    setStatus('✓ 已保存,后续生成请求将使用该配置');
    setTimeout(onClose, 400);
  }

  function reset() {
    clearAiConfig();
    setCfg({ provider: providers[0]?.id || '', model: '', apiKey: '', baseUrl: '' });
    setModels([]);
    setModelsSource('');
    setStatus('已清除,回退到服务器环境变量配置');
  }

  if (!open) return null;

  const providerMeta = providers.find((p) => p.id === cfg.provider);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-rose-500" />
            AI 模型设置
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 cursor-pointer" aria-label="关闭">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">模型厂商</label>
            <select
              value={cfg.provider}
              onChange={(e) => setCfg((c) => ({ ...c, provider: e.target.value, model: '' }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-200"
            >
              {providers.map((p) => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>
            {providerMeta?.note && <p className="text-[11px] text-slate-400 mt-1">{providerMeta.note}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-500">模型</label>
              <button
                onClick={() => void refreshModels(true)}
                disabled={busy}
                className="flex items-center gap-1 text-xs font-medium text-rose-600 hover:text-rose-700 disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${busy ? 'animate-spin' : ''}`} />
                {busy ? '获取中…' : '获取模型列表'}
              </button>
            </div>
            {models.length > 0 ? (
              <select
                value={cfg.model}
                onChange={(e) => setCfg((c) => ({ ...c, model: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-200"
              >
                {models.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            ) : (
              <input
                value={cfg.model}
                onChange={(e) => setCfg((c) => ({ ...c, model: e.target.value }))}
                placeholder="输入模型名(或点击右上角获取列表)"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-200"
              />
            )}
            {modelsSource && <p className="text-[11px] text-slate-400 mt-1">{modelsSource}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">
              API Key <span className="font-normal text-slate-400">(留空使用服务器环境变量)</span>
            </label>
            <input
              type="password"
              value={cfg.apiKey}
              onChange={(e) => setCfg((c) => ({ ...c, apiKey: e.target.value }))}
              placeholder="sk-..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-200"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">
              Base URL <span className="font-normal text-slate-400">(留空使用该厂商默认地址)</span>
            </label>
            <input
              value={cfg.baseUrl}
              onChange={(e) => setCfg((c) => ({ ...c, baseUrl: e.target.value }))}
              placeholder="https://api.xxx.com/v1"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-200"
            />
          </div>

          {status && <p className="text-xs text-slate-500">{status}</p>}

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={save}
              className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              保存配置
            </button>
            <button
              onClick={reset}
              className="flex items-center gap-1.5 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              清除(回退环境变量)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
