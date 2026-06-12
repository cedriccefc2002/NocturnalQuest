import { getLogger } from "./Logger.ts";
const logger = getLogger("Resources");
/**
 * 管理系統中所有數值資源，如金幣
 */
export enum ResourcesType {
    gold
}