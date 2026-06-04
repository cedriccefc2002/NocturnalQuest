import { getLogger } from "./Logger.ts";
const logger = getLogger("TimerMap");

export type TimerMapCfg = {
    c: () => number;  // 光速 訊息傳遞速度上限
};
export type TimeoutDataFnReq = Record<PropertyKey, never>
export type TimeoutDataFnResp = {
    continue: boolean;
    nextReq: TimeoutDataFnReq;
}
export type TimeoutData = {
    name: string;
    id: symbol,
    fn: (req: TimeoutDataFnReq) => Promise<TimeoutDataFnResp>;
    timerSec: number;
    req: TimeoutDataFnReq;
}
export class TimerMap {
    private constructor(private cfg: TimerMapCfg) { }
    private DataMap = new Map<symbol, TimeoutData>();
    private TimerMap = new Map<symbol, NodeJS.Timeout>();
    private async TimerProcess(id: symbol) {
        const data = this.DataMap.get(id);
        if (data !== undefined) {
            const resp = await data.fn(data.req);
            if (resp.continue) {
                data.req = resp.nextReq;
                this.DataMap.set(data.id, data);
                this.TimerMap.set(data.id, setTimeout((id: symbol) => {
                    this.TimerProcess(id);
                }, data.timerSec * this.cfg.c(), data.id));
            } else {
                this.DataMap.delete(data.id);
                this.TimerMap.delete(data.id);
            }
        }
    }
    public Add(data: TimeoutData) {
        logger.trace(`Add ${data.name} timerSec = ${data.timerSec} sec`)
        this.DataMap.set(data.id, data);
        this.TimerMap.set(data.id, setTimeout((id: symbol) => {
            this.TimerProcess(id);
        }, data.timerSec * this.cfg.c(), data.id));
    }
    public stopAll() {
        for (const [_, v] of this.TimerMap.entries()) {
            clearTimeout(v);
        }
    }
    public static Create(): TimerMap {
        return new TimerMap({ c:()=> 1000 });
    }
}