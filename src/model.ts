import {  } from '@polkadot/typegen';
import BN from 'bn.js';

export interface RawEvent { 
    id: string; 
    method: string; 
    data: any[];
    blockNumber: number; 
    block: any;
}

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
    amount: BN[];
    startAmount: BN;
    endAmount: BN;

    public static fromJson(obj: RawEvent) {
        let result: SwapEvent = new SwapEvent();
        // if (obj.hasOwnProperty('id')) {
        //     result.id = obj['id'];
        // }
        result.id = obj.id;
        // if (obj.hasOwnProperty('blockNumber')) {
        //     result.blockNumber = obj['blockNumber'];
        // }
        result.blockNumber = obj.blockNumber;
        // if (obj.hasOwnProperty('block')) {
        //     result.block = Block.fromJson(obj['block'] as { id: string, timestamp: string });
        // }
        result.block = Block.fromJson(obj.block as { id: string, timestamp: string });
        // if (obj.hasOwnProperty('data')) {
        //     var swappingToken: any[] = JSON.parse(obj['data'][1]['value']);
        //     result.currency = [];
        //     for (var c of swappingToken) {
        //         result.currency.push(c['token']);
        //     }
        //     result.startAmount = new BN(obj['data'][2]['value']);
        //     result.endAmount = new BN(obj['data'][3]['value']);
        // }
        if (obj.data.length == 4) {
            // old structure: Swap(T::AccountId, Vec<CurrencyId>, Balance, Balance)
            var swappingToken: any[] = JSON.parse(obj['data'][1]['value']);
            result.currency = [];
            for (var c of swappingToken) {
                result.currency.push(c['token']);
            }
            result.startAmount = new BN(obj['data'][2]['value']);
            result.endAmount = new BN(obj['data'][3]['value']);
            result.amount = [ result.startAmount, result.endAmount ];
        } else {
            // new structure: Swap(T::AccountId, Vec<CurrencyId>, Vec<Balance>)
            // from commit 5afdb835eede2e0f417dff561167c26e81ddb571 @ AcalaNetwork/Acala 
            var swappingToken: any[] = JSON.parse(obj['data'][1]['value']);
            result.currency = [];
            for (var c of swappingToken) {
                result.currency.push(c['token']);
            }
            result.amount = [];
            var swappingAmount: any[] = JSON.parse(obj['data'][2]['value']);
            for (var a of swappingAmount) {
                result.amount.push(a);
            }
            // TODO: validate whether this is needed
            result.startAmount = result.amount[0];
            result.endAmount = result.amount[result.amount.length - 1];
        }
        return result;
    }
}

export class PoolData {
    pair: string; // in format of `{token0}-{token1}`
    rawSwaps: RawSwapAction[];
    volumeNative: number = 0;
    volumeUSD: number = 0;

    constructor(
        pair: string,
        rawSwaps: RawSwapAction[] = [],
    ) {
        this.pair = pair;
        this.rawSwaps = rawSwaps;
    }

    get token0(): string {
        return this.pair.split('-')[0];
    }

    get token1(): string {
        return this.pair.split('-')[1];
    }
}

// Raw data from SwapEvent with clear from which currency to which currency
export class RawSwapAction {
    id: string; // SwapEvent id
    blockNumber: number; // SwapEvent blockNumber
    block: Block; // SwapEvent Block
    // data
    fromCurrency: string;
    fromAmount: BN;
    toCurrency: string;
    toAmount: BN;

    constructor(raw: {
        id: string,
        blockNumber: number,
        block: Block,
        fromCurrency: string,
        fromAmount: BN,
        toCurrency: string,
        toAmount: BN,
    }) {
        this.id = raw.id;
        this.blockNumber = raw.blockNumber;
        this.block = raw.block;
        this.fromAmount = raw.fromAmount;
        this.fromCurrency = raw.fromCurrency;
        this.toAmount = raw.toAmount;
        this.toCurrency = raw.toCurrency;
    }
}