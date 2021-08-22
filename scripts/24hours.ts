import { 
    getSwapEventOnLast24h, 
    handlingSwapEventInterswap,
    transformRawSwapAction,
    categorizeSwapEventsToPool, 
    calculatePoolVolume,
    PoolData, 
    SwapEvent,
    quantityToNumber, endOfDay, initAPI, startOfDay,
    liquidtyConfig, NATIVE,
    historyRateFromLiquidity,
} from '../src';
import { ApiPromise } from '@polkadot/api';
import { AnyNumber } from '@polkadot/types/types';
import BN from 'bn.js';

async function main() {
    var time1 = new Date();
    console.log(`START`);

    var api = await initAPI();
    var swaps = await getSwapEventOnLast24h();
    console.log(`${swaps.length} trade made on last 24 hours`);

    await handlingSwapEventInterswap(swaps, api);

    var [rawSwaps, skip] = transformRawSwapAction(swaps);
    console.log(`\nskip ${skip} interswap\n`);
    var pools: Map<string, PoolData> = categorizeSwapEventsToPool(rawSwaps);
    pools.forEach((pool, pair) => {
        console.log(`\t${pool.rawSwaps.length} trades in ${pair}`);
        calculatePoolVolume(pool);
        console.log(`\t\tVolume(KSM): ${pool.volumeNative}`);
        console.log(`\t\tFees(KSM): ${pool.volumeNative * 0.003} KSM`);
    });

    var time2 = new Date();
    console.log(`\nTime taken: ${time2.getTime() - time1.getTime()} ms`);
    await api.disconnect();
}

main();