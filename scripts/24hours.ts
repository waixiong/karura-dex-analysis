import { 
    getSwapEventOnLast24h, 
    separateSwapEventByDay, 
    categorizeSwapEventsToPool, 
    calculatePoolVolume,
    PoolData, 
    SwapEvent,
    currencyAmountToNumber, endOfDay, initAPI, startOfDay,
    liquidtyConfig, NATIVE,
} from '../src';

async function main() {
    var time1 = new Date();
    console.log(`START`);

    var swaps = await getSwapEventOnLast24h();
    console.log(`${swaps.length} trade made on last 24 hours`);

    var pools: Map<string, PoolData> = categorizeSwapEventsToPool(swaps);
    pools.forEach((pool, pair) => {
        console.log(`\t${pool.swapEvents.length} trades in ${pair}`);
        calculatePoolVolume(pool);
        console.log(`\t\tVolume(KSM): ${pool.volumeNative}`);
        console.log(`\t\tFees(KSM): ${pool.volumeNative * 0.003} KSM`);
    });

    var time2 = new Date();
    console.log(`\nTime taken: ${time2.getTime() - time1.getTime()} ms`);
}

main();