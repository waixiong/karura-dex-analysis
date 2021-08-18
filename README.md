# Karura Dex Analysis

Planning to do a simple CLI daily volume analysis through query history state from karura node and event from karura subql.

### Expectation from here
The minimum expected analysis is getting volume in term of native of relay chain (KSM) between two currency.

The better analysis will be contained volume of inter-pair swapping (Ex the swapping of KSM in between KUSD-KAR), volume (24h) in USD value and trading fee (24h) collected.

The data may have 1% ± mistake due to not exact history rate of pair, we define history rate from the liquidity at particular block number.

### Checklist
- [x] get ratio from liquidity poll
- [x] KSM price from oracle
- [x] today event query
- [x] 24 hours event query
- [x] 7 days event query
- [x] rough simple volume (KSM) calculation
- [ ] rough complex volume (KSM) calculation (involve more than two currency, by the time writing will be KAR->KSM->KUSD and KUSD->KSM->KAR)
- [ ] USD valued volume

### Other Doc/Resource
- [SubQuery](https://explorer.subquery.network/subquery/AcalaNetwork/karura)
- [polkadot{.js}](https://polkadot.js.org/docs/api/start/)
- [Subscan (Karura)](https://karura.subscan.io)
- [Acala Foundation's Github](https://github.com/AcalaNetwork)

### Current Status
Currently trade data only calculated in KSM value, as mentioned above, complex swap is skipped.

There is two sample scripts:
- `npm run 7days`: take around 40 seconds query 7 days events and compute data
- `npm run 24hours`: take around 8 seconds query 24 hours events and compute data

Here is the sample result
```
927 trade made on Mon, 16 Aug 2021 00:00:00 GMT
	601 trades in KAR-KSM
		Volume(KSM): 4168.7530196286825
		Fees(KSM): 12.506259058886048 KSM
	412 trades in KUSD-KSM
		Volume(KSM): 3823.581465309773
		Fees(KSM): 11.47074439592932 KSM

722 trade made on last 24 hours
	541 trades in KAR-KSM
		Volume(KSM): 4985.107738396779
		Fees(KSM): 14.955323215190337 KSM
	272 trades in KUSD-KSM
		Volume(KSM): 2476.9754235352384
		Fees(KSM): 7.430926270605715 KSM
```

### Future
These are possible future of current repo:
- expanded feature with web UI
- replace by official repo with similar function