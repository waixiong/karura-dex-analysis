import BN from 'bn.js';

export function currencyToNumber(bn: BN): number {
    return bn.toNumber() / 1000000000000;
}

export function priceToNumber(bn: BN): number {
    return bn.div(new BN(1000000000000)).toNumber() / 1000000;
}