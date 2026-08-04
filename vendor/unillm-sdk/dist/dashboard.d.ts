import { IncomingMessage, ServerResponse, Server } from 'node:http';

interface DashboardOptions {
    /** 挂载路径,默认 /llm */
    path?: string;
    /** 独立启动时的端口,默认 3788 */
    port?: number;
    /** 独立启动时的 host,默认 127.0.0.1 */
    host?: string;
    /** 是否自动打开浏览器,默认 true */
    open?: boolean;
}
/**
 * Dashboard 处理器:可独立使用,也可作为 Express 中间件挂载。
 *
 * Express 挂载:
 *   import { serveDashboard } from "unillm-sdk/dashboard";
 *   app.use("/llm", serveDashboard({ path: "/llm" }));
 *
 * 独立启动:
 *   import { startDashboard } from "unillm-sdk/dashboard";
 *   startDashboard(); // http://127.0.0.1:3788/llm
 */
declare function serveDashboard(options?: DashboardOptions): (req: IncomingMessage, res: ServerResponse, next?: () => void) => Promise<void | ServerResponse<IncomingMessage>>;
/** 独立启动 Dashboard 服务 */
declare function startDashboard(options?: DashboardOptions): Server;

export { type DashboardOptions, serveDashboard, startDashboard };
