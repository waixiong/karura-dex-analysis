import { querySwap, querySwapFromBlock } from './dex_liquidity';
import { PoolData, SwapEvent } from './model';
import { currencyAmountToNumber, endOfDay, initAPI, startOfDay } from './utils';
import { liquidtyConfig, NATIVE } from './config';
import { lastBlockFromSubquery } from './block';

/// ASSUMPTION:
/// 1 block is 12000 ms
/// 1 day is 7200 blocks, may put 7300 for query excess data

async function getSwapEventOnToday() : Promise<SwapEvent[]> {
    // Start of day, set at UTC 00:00:00.000
    var date: Date = startOfDay(new Date());
    var fromBlockEstimate = (await lastBlockFromSubquery()) - 7300;

    // first query, expected only need one query
    var swapEvents = await querySwapFromBlock(fromBlockEstimate);
    
    // repeat query until reach swap of yesterday
    var reach24h: boolean = swapEvents[swapEvents.length-1].block.timestamp > date.getTime();
    while(reach24h) {
        var swapEvents2 = await querySwap(100, swapEvents.length);
        swapEvents.push(...swapEvents2);
        reach24h = swapEvents[swapEvents.length-1].block.timestamp > date.getTime();
    }

    // Cut the list to only today
    for (var i = swapEvents.length - 1; i >= 0; i--) {
        if(swapEvents[i].block.timestamp < date.getTime()) {
            swapEvents.pop();
        } else {
            break;
        }
    }

    return swapEvents;
}

export async function getSwapEventOnLast24h() : Promise<SwapEvent[]> {
    // Start of day, set at UTC 00:00:00.000
    var date: Date = new Date();
    date.setHours(date.getHours() - 24);
    var fromBlockEstimate = (await lastBlockFromSubquery()) - 7300;

    // first query, expected only need one query
    var swapEvents = await querySwapFromBlock(fromBlockEstimate);
    
    // repeat query until reach more than 24h
    var reach24h: boolean = swapEvents[swapEvents.length-1].block.timestamp > date.getTime();
    while(reach24h) {
        var swapEvents2 = await querySwap(100, swapEvents.length);
        swapEvents.push(...swapEvents2);
        reach24h = swapEvents[swapEvents.length-1].block.timestamp > date.getTime();
    }

    // Cut the list to only within 24h
    for (var i = swapEvents.length - 1; i >= 0; i--) {
        if(swapEvents[i].block.timestamp < date.getTime()) {
            swapEvents.pop();
        } else {
            break;
        }
    }

    return swapEvents;
}

export async function getSwapEventUntilDate(date?: Date) : Promise<SwapEvent[]> {
    // Start of day, set at UTC 00:00:00.000
    if (date == null) {
        // default as a week (6 days + today) 
        date = startOfDay(new Date());
        date.setUTCDate(date.getUTCDate() - 6);
    }

    // get block number from, with the milliseconds different, plus 100 as extra
    var millisecondsDifferent = ((new Date()).getTime() - date.getTime());
    var fromBlockEstimate = (await lastBlockFromSubquery()) - (millisecondsDifferent / 12000 + 100);

    // first query, expected only need one query
    var swapEvents = await querySwapFromBlock(fromBlockEstimate);
    
    // repeat query until reach more than date
    var reachDate: boolean = swapEvents[swapEvents.length-1].block.timestamp > date.getTime();
    while(reachDate) {
        var swapEvents2 = await querySwap(100, swapEvents.length);
        swapEvents.push(...swapEvents2);
        reachDate = swapEvents[swapEvents.length-1].block.timestamp > date.getTime();
    }

    // Cut the list to only within date
    for (var i = swapEvents.length - 1; i >= 0; i--) {
        if(swapEvents[i].block.timestamp < date.getTime()) {
            swapEvents.pop();
        } else {
            break;
        }
    }

    return swapEvents;
}

export function separateSwapEventByDay(swaps: SwapEvent[]) : SwapEvent[][] {
    var swapsWithDays: SwapEvent[][] = [[]];
    var endOfToday = endOfDay(new Date(swaps[swaps.length-1].block.timestamp)).getTime();
    while (swaps.length > 0) {
        var swap = swaps.pop()!;
        if (swap.block.timestamp > endOfToday) {
            swapsWithDays.push([]);
            endOfToday = endOfDay(new Date(swap.block.timestamp)).getTime();
        }
        swapsWithDays[swapsWithDays.length-1].push(swap);
    }

    return swapsWithDays;
}

export function categorizeSwapEventsToPool(swaps: SwapEvent[]): Map<string, PoolData> {
    var poolMap: Map<string, PoolData> = new Map();
    for (var swap of swaps) {
        for (var i = 0; i < swap.currency.length - 1; i++) {
            var pair = liquidtyConfig[swap.currency[i]][swap.currency[i+1]];
            if (!poolMap.has(pair)) {
                poolMap.set(pair, new PoolData(pair));
            }
            poolMap.get(pair).swapEvents.push(swap);
        }
    }
    return poolMap;
}

export function calculatePoolVolume(pool: PoolData) {
    for (var swap of pool.swapEvents) {
        if (swap.currency.length > 2) {
            // TODO: skip complex swapping first
            continue;
        }
        if (pool.token0 == NATIVE || pool.token1 == NATIVE) {
            // TODO: dynamic
            if (swap.currency[0] == NATIVE) {
                // ROUGH-CALCULATION
                var nativeTraded = currencyAmountToNumber(swap.startAmount);
                pool.volumeNative += nativeTraded;
            } else {
                // ROUGH-CALCULATION
                var nativeTraded = currencyAmountToNumber(swap.endAmount) / 0.997;
                pool.volumeNative += nativeTraded;
            }
        } else {
            // TODO: calculation on none NATIVE
        }
    }
}