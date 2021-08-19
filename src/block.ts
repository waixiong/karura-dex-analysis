import { ApiPromise } from '@polkadot/api';
import { AnyNumber } from '@polkadot/types/types';
import BN from 'bn.js';
import { NATIVE } from './config';
import { SwapEvent } from './model';
import { subquery } from './utils';

export async function lastBlockFromSubquery(
    url = 'https://api.subquery.network/sq/AcalaNetwork/karura'
) : Promise<number> {
    var query = {
        "headers": {
            "Content-Type": "application/json",
        },
        "body": `{
            "query":"query {\
                blocks (\
                    orderBy: NUMBER_DESC\
                    first: 1\
                ) {\
                    nodes {\
                        id\
                        number\
                    }\
                }\
            }"
        }`,
        "method": "POST",
    };
    var rawEvents = await subquery(query, url);
    var buf = await rawEvents.buffer();
    var objs: Object = JSON.parse(buf.toString('utf8'))['data']['blocks']['nodes'][0];
    
    return Number.parseFloat(objs['number']);
}