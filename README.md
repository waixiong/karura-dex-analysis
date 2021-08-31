### *Notice*

Please go to [karura_info_web](https://github.com/waixiong/karura_info_web).

[karura_info_web](https://github.com/waixiong/karura_info_web) is a client info that work directly with subql without any extra api.

This repo might be abandoned.

# Karura Dex Analysis

Simple CLI daily volume analysis through query history state from karura node and event from karura subql.

Will start convert to api with database for long term used.

### Expectation from here
The minimum expected analysis is getting volume in term of native of relay chain (KSM) between two currency.

The better analysis will be contained volume of inter-pair swapping (Ex the swapping of KSM in between KUSD-KAR), volume (24h) in USD value and trading fee (24h) collected.

The data may have 1% ± mistake due to not exact history rate of pair, we define history rate from the liquidity at particular block number.

### Checklist
- [x] get ratio from liquidity pool
- [x] KSM price from oracle on specific block
- [x] today event query
- [x] 24 hours event query
- [x] 7 days event query
- [x] simple swap volume (KSM) calculation
- [x] efficient complex swap (interswap) volume (KSM) calculation (involve more than two currency, by the time writing will be KAR->KSM->KUSD and KUSD->KSM->KAR for block before 408594)
	- since block 408594, the swap event change from `Swap(T::AccountId, Vec<CurrencyId>, Balance, Balance)` to `Swap(T::AccountId, Vec<CurrencyId>, Vec<Balance>)` make interswap can be calculated without complex step
- [ ] USD valued volume
- [x] Query liquidity on specific block
- [x] History rate base on liquidity pool
- [ ] Calculate liquidity fee return on pool (% value, apr)
- [ ] price of token (calculated from liquidity pool with KSM as base)
- [ ] volume changed
- [ ] liquidity data by token

### BigInt Format
- `quantity` = 12 decimal
- `currency amount` = 18 decimal

### Current Status
Currently trade data only calculated in KSM value, as mentioned above, complex swap is skipped.

U can query with complex interswap, but that will greatly reduce speed. Due to no cache or database to store history rate, we need always query history rate from node which take a lot of time. Same as the oracle price.

There is sample scripts to see the result:
- `npm run 7days`: take around ~~40~~ 5 seconds query 7 days events and compute data
- `npm run 24hours`: take around ~~8~~ 2 seconds query 24 hours events and compute data
- `npm run 7days-complex`: take around 6 minutes query 7 days events and compute data including interswap
- `npm run 24hours-complex`: take around 2 minute query 24 hours events and compute data including interswap

Here is the sample result
```
npm run 7days
```
```
657 trade made on Thu, 19 Aug 2021 00:00:00 GMT
	230 trades in KUSD-KSM
		Volume(KSM): 2931.292389834207
		Fees(KSM): 8.79387716950262 KSM
	300 trades in KAR-KSM
		Volume(KSM): 2970.05075829458
		Fees(KSM): 8.91015227488374 KSM
```

```
npm run 7days-complex
```
```
657 trade made on Thu, 19 Aug 2021 00:00:00 GMT
	357 trades in KUSD-KSM
		Volume(KSM): 3198.8593906688156
		Fees(KSM): 9.596578172006447 KSM
	427 trades in KAR-KSM
		Volume(KSM): 3237.2458183869894
		Fees(KSM): 9.711737455160968 KSM
```

```
npm run 24hours
```
```
596 trade made on last 24 hours

skip 147 interswap

	179 trades in KUSD-KSM
		Volume(KSM): 1079.031499048456
		Fees(KSM): 3.237094497145368 KSM
	270 trades in KAR-KSM
		Volume(KSM): 1626.92652079092
		Fees(KSM): 4.88077956237276 KSM
```

```
npm run 24hours-complex
```
```
596 trade made on last 24 hours
	326 trades in KUSD-KSM
		Volume(KSM): 1185.994747433518
		Fees(KSM): 3.5579842423005537 KSM
	417 trades in KAR-KSM
		Volume(KSM): 1733.9008683792765
		Fees(KSM): 5.20170260513783 KSM
```

### Future
These are possible future of current repo:
- evolve into graphql api or nestjs api with mongodb
- expanded feature with web UI
- replace by official repo with similar function

### Other Doc/Resource
- [SubQuery](https://explorer.subquery.network/subquery/AcalaNetwork/karura)
- [polkadot{.js}](https://polkadot.js.org/docs/api/start/)
- [Subscan (Karura)](https://karura.subscan.io)
- [Acala Foundation's Github](https://github.com/AcalaNetwork)