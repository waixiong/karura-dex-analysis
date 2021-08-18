import {  } from '@polkadot/typegen';
import BN from 'bn.js';

// TODO: use gentype from acala
export class Block {
    id: string;
    timestamp: number;

    constructor(
        id?: string,
        timestamp?: number,
    ) {
        this.id = id;
        this.timestamp = timestamp;
    }

    public static fromJson(args: { id: string, timestamp: string }) {
        let result: Block = new Block(
            args.id,
            Date.parse(args.timestamp+'Z'),
        );
        return result;
    }
}

// TODO: use gentype from acala
export class SwapEvent {
    id: string;
    blockNumber: number;
    block: Block;
    // data
    currency: string[];
    startAmount: BN;
    endAmount: BN;

    public static fromJson(obj: Object) {
        let result: SwapEvent = new SwapEvent();
        if (obj.hasOwnProperty('id')) {
            result.id = obj['id'];
        }
        if (obj.hasOwnProperty('blockNumber')) {
            result.blockNumber = obj['blockNumber'];
        }
        if (obj.hasOwnProperty('block')) {
            result.block = Block.fromJson(obj['block'] as { id: string, timestamp: string });
        }
        if (obj.hasOwnProperty('data')) {
            var swappingToken: any[] = JSON.parse(obj['data'][1]['value']);
            result.currency = [];
            for (var c of swappingToken) {
                result.currency.push(c['token']);
            }
            result.startAmount = new BN(obj['data'][2]['value']);
            result.endAmount = new BN(obj['data'][3]['value']);
        }
        return result;
    }
}

export class PoolData {
    pair: string; // in format of `{token0}-{token1}`
    swapEvents: SwapEvent[];
    volumeNative: number = 0;
    volumeUSD: number = 0;

    constructor(
        pair: string,
        swapEvents: SwapEvent[] = [],
    ) {
        this.pair = pair;
        this.swapEvents = swapEvents;
    }

    get token0(): string {
        return this.pair.split('-')[0];
    }

    get token1(): string {
        return this.pair.split('-')[1];
    }
}