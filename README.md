# Karura Dex Analysis

Planning to do a simple CLI daily volume analysis through query history state from karura node and event from karura subql.

### Expectation from here
The minimum expected analysis is getting volume in term of native of relay chain (KSM) between two currency.

The better analysis will be contained volume of inter-pair swapping (Ex the swapping of KSM in between KUSD-KAR), volume (24h) in USD value and trading fee (24h) collected.

The data may have 1% ± mistake due to not exact history rate of pair, we define history rate from the liquidity at particular block number.

### Checklist
- [x] get ratio from liquidity poll
- [x] KSM price from oracle
- [ ] 24 hours event query
- [ ] simple volume calculation
- [ ] complex volume calculation (involve more than two currency, by the time writing will be KAR->KSM->KUSD and KUSD->KSM->KAR)
- [ ] USD valued volume

### Other Doc/Resource
- [SubQuery](https://explorer.subquery.network/subquery/AcalaNetwork/karura)
- [polkadot{.js}](https://polkadot.js.org/docs/api/start/)
- [Subscan (Karura)](https://karura.subscan.io)
- [Acala Foundation's Github](https://github.com/AcalaNetwork)
