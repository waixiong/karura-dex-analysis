import { 
    getSwapEventUntilDate, 
    handlingSwapEventInterswap, 
    separateSwapEventByDay,
    transformRawSwapAction,
    categorizeSwapEventsToPool, 
    calculatePoolVolume,
    PoolData, 
    SwapEvent,
    quantityToNumber, endOfDay, initAPI, startOfDay,
    liquidtyConfig, NATIVE,
} from '../src';

async function main() {
    var time1 = new Date();
    console.log(`START`);
    var api = await initAPI();

    var swaps = await getSwapEventUntilDate();
    console.log('DONE QUERY\n');

    await handlingSwapEventInterswap(swaps, api);
    
    var swapsByDay = separateSwapEventByDay(swaps);

    for (var swapsOfDay of swapsByDay) {
        console.log(`${swapsOfDay.length} trade made on ${
            startOfDay(new Date(swapsOfDay[0].block.timestamp)).toUTCString()
        }`);

        // computing
        var [rawSwaps, skip] = transformRawSwapAction(swapsOfDay);
        // console.log(`\nskip ${skip} interswap\n`);
        var pools: Map<string, PoolData> = categorizeSwapEventsToPool(rawSwaps);
        pools.forEach((pool, pair) => {
            console.log(`\t${pool.rawSwaps.length} trades in ${pair}`);
            calculatePoolVolume(pool);
            console.log(`\t\tVolume(KSM): ${pool.volumeNative}`);
            console.log(`\t\tFees(KSM): ${pool.volumeNative * 0.003} KSM`);
        });
        console.log('');
    }

    var time2 = new Date();
    console.log(`\nTime taken: ${time2.getTime() - time1.getTime()} ms`);
    api.disconnect();
}

main();