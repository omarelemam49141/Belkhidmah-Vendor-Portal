# Package price (rules)

Admin and provider set how a package is priced.

## Fixed

One amount in SAR. No rules.

## Dynamic

A list of rules. Each rule has:

- One or more conditions, joined by **And** or **Or**
- One SAR amount for the whole contract
- A **priority** number

Condition types:

- **City** the client picks for the contract
- **Days after booking** until the contract starts (day 0 = the booking date)

Example on Home cleaning (Al Manzil):

| Priority | Conditions | Price |
| --- | --- | --- |
| 1 | City equals Riyadh **and** start is 0–3 days after booking | 300 SAR |
| 2 | Start is 0–3 days after booking | 320 SAR |
| 3 | Start is 4–7 days after booking | 450 SAR |
| 4 | Start is 8 days or later | 500 SAR |

If two rules match, the smaller priority number wins. The same number uses the rule higher in the list. If nothing matches, that booking has no price.

The price is fixed when the client picks the city and the start date. It does not change during the contract.

## Condition price effect

Each condition can turn on a price effect. Off means the condition only decides if the rule matches. On, and only when that condition matches, it changes the rule price. Effects run in condition order. Each one uses the price so far.

- Increase or decrease by a SAR amount
- Increase or decrease by a percent

Each condition also shows **This condition alone**: the rule price if only that condition's effect is applied. If the effect is off, that amount is the rule price.

## Editor

- **Fixed** / **Dynamic**
- **Add rule**, **Add And**, **Add Or**, priority, SAR
- Preview: contract city + days after booking until start
- Invalid rules block **Save**
- If Price is locked, the provider cannot change this block
