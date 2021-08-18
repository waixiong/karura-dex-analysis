import BN from 'bn.js';
import * as fetch from "node-fetch";

export function currencyToNumber(bn: BN): number {
    return bn.toNumber() / 1000000000000;
}

export function priceToNumber(bn: BN): number {
    return bn.div(new BN(1000000000000)).toNumber() / 1000000;
}

// query with graphql format on subql-node
// node: https://api.subquery.network/sq/AcalaNetwork/karura
// node: https://api.polkawallet.io/karura-subql
export async function subquery(query, url = "https://api.subquery.network/sq/AcalaNetwork/karura") : Promise<fetch.Response> {
    return fetch.default(url, query);
}