import type {Graph} from "@antv/g6";

type Caller = {
    graph: Graph,
    getDefaultCfg?: () => object,
    [property: any]: unknown
}