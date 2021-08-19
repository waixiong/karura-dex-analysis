import { ApiPromise } from '@polkadot/api';
import { AnyNumber } from '@polkadot/types/types';
import BN from 'bn.js';
import { NATIVE } from './config';
import { SwapEvent } from './model';
import { subquery } from './utils';

/// default as KAR KSM
export async function historyRateFromLiquidity(
    blockNumber: AnyNumber, 
    karuraApi: ApiPromise, 
    token0: string = 'KAR',
    token1: string = 'KSM'
) : Promise<BN> {
    const blockHash = await karuraApi.rpc.chain.getBlockHash(blockNumber);
    const liquidityKAR = await karuraApi.query.dex.liquidityPool.at(blockHash, [
        { Token: token0 },
        { Token: token1 },
    ]);
    /*
        for block 200000
        ["0x000000000000000005d4a5a29ff1d21b","0x0000000000000000002b508bdb92205f"]
        [ '420.1427 kKAR', '12.1919 kKAR' ]
    */
    var token0Balance = new BN(liquidityKAR[0].toString());
    var token1Balance = new BN(liquidityKAR[1].toString());

    // rate of token0 : token1
    // how many token0 equal to a token1
    var _rate = token0Balance.mul(new BN(1000000000000)).div(token1Balance);
    // var rate = _rate.toNumber() / 1000000000000

    return _rate;
}

/// price of native relay chain
/// available only after block 276231 for karura KSM
export async function historyNativePrice(blockNumber: AnyNumber, karuraApi: ApiPromise) : Promise<BN> {
    const blockHash = await karuraApi.rpc.chain.getBlockHash(blockNumber);
    const nativeValueTimestamp = await karuraApi.query.acalaOracle.values.at(blockHash, { Token: NATIVE });
    /*{
        value: '297,940,000,000,000,000,000',
        timestamp: '1,629,213,594,519'
      }*/
    // // old method
    // var json: { value: string, timestamp: string } = JSON.parse(JSON.stringify(nativeValueTimestamp.toHuman()));
    // var priceInBN = new BN(json.value.replace(RegExp(/,/g), ''));
    // console.log(json.value.replace(RegExp(/,/g), ''));
    // console.log(priceInBN.toString());
    // console.log(priceInBN.toString(16));
    
    var json: { value, timestamp } = JSON.parse(nativeValueTimestamp.toString());
    var priceInBN = new BN(json.value.replace('0x', ''), 16);
    return priceInBN;
}

// TODO: use gentype from acala
// this will be limited on 100 events, if u know the event u wan from block, can use querySwapFromBlock
export async function querySwap(count: number, offset: number = 0, url = 'https://api.polkawallet.io/karura-subql') : Promise<SwapEvent[]> {
    var query = {
        "headers": {
            "Content-Type": "application/json",
        },
        "body": `{
            "query":"query {\
                events (\
                    first: ${count}\
                    offset: ${offset}\
                    orderBy: BLOCK_NUMBER_DESC\
                    filter: {\
                        method: { equalTo: \\\"Swap\\\" }\
                    }\
                ) {\
                    nodes {\
                        id\
                        method\
                        data\
                        blockNumber\
                        block {\
                            id\
                            timestamp\
                        }\
                    }\
                }\
            }",
            "variables":null
        }`,
        "method": "POST",
    };
    var rawEvents = await subquery(query, url);
    var buf = await rawEvents.buffer();
    var objs: Object[] = JSON.parse(buf.toString('utf8'))['data']['events']['nodes'];

    var swapEvents: SwapEvent[] = [];
    for (var obj of objs) {
        swapEvents.push(SwapEvent.fromJson(obj));
    }
    
    return swapEvents;
}

export async function querySwapFromBlock(fromBlock: number) : Promise<SwapEvent[]> {
    var query = {
        "headers": {
            "Content-Type": "application/json",
        },
        "body": `{
            "query":"query {\
                events (\
                    orderBy: BLOCK_NUMBER_DESC\
                    filter: {\
                        method: { equalTo: \\\"Swap\\\" }\
                        blockNumber: { greaterThan: \\\"${fromBlock}\\\" }\
                    }\
                ) {\
                    nodes {\
                        id\
                        method\
                        data\
                        blockNumber\
                        block {\
                            id\
                            timestamp\
                        }\
                    }\
                }\
            }",
            "variables":null
        }`,
        "method": "POST",
    };
    var rawEvents = await subquery(query);
    var buf = await rawEvents.buffer();
    var objs: Object[] = JSON.parse(buf.toString('utf8'))['data']['events']['nodes'];

    var swapEvents: SwapEvent[] = [];
    for (var obj of objs) {
        swapEvents.push(SwapEvent.fromJson(obj));
    }
    
    return swapEvents;
}