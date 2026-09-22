import type { PriceCondition, PriceEffectOp, PriceJoin, PriceMode, PriceRule } from './types'

export type PriceRuleError =
  | 'priceNeedRule'
  | 'priceNeedCondition'
  | 'priceNeedCity'
  | 'priceNeedPriority'
  | 'priceInvalidRange'
  | 'priceNeedAmount'
  | 'priceNeedEffect'

export type Priced = {
  price: number
  priceMode: PriceMode
  priceRules: PriceRule[]
}

export type BookingPriceContext = {
  city: string
  daysAfterBooking: number
}

type LegacyTier = {
  fromDay: number
  toDay: number | null
  price: number
}

let part = 0

export function pricePartId (prefix: string): string {
  part += 1
  return `${prefix}-${part}-${Math.random().toString(36).slice(2, 7)}`
}

const EFFECT_OPS: PriceEffectOp[] = ['addAmount', 'addPercent', 'subtractAmount', 'subtractPercent']

function blankEffect (): Pick<PriceCondition, 'effectOn' | 'effectOp' | 'effectValue'> {
  return { effectOn: false, effectOp: 'addAmount', effectValue: 0 }
}

function daysCondition (fromDay: number, toDay: number | null, join: PriceJoin = 'and'): PriceCondition {
  return {
    id: pricePartId('cond'),
    join,
    kind: 'daysAfterBooking',
    city: '',
    fromDay,
    toDay,
    ...blankEffect()
  }
}

function cityCondition (city: string, join: PriceJoin = 'and'): PriceCondition {
  return {
    id: pricePartId('cond'),
    join,
    kind: 'city',
    city,
    fromDay: 0,
    toDay: null,
    ...blankEffect()
  }
}

function roundMoney (amount: number): number {
  return Math.round(amount * 100) / 100
}

export function cloneRules (rules: PriceRule[] | undefined | null): PriceRule[] {
  if (!Array.isArray(rules)) return []
  return rules.map((rule) => ({
    id: rule.id || pricePartId('rule'),
    priority: Number(rule.priority) || 0,
    price: Number(rule.price) || 0,
    conditions: (rule.conditions ?? []).map((c) => ({
      id: c.id || pricePartId('cond'),
      join: c.join === 'or' ? 'or' : 'and',
      kind: c.kind === 'city' ? 'city' : 'daysAfterBooking',
      city: c.city ?? '',
      fromDay: Number(c.fromDay) || 0,
      toDay: c.toDay == null || Number.isNaN(Number(c.toDay)) ? null : Number(c.toDay),
      effectOn: !!c.effectOn,
      effectOp: EFFECT_OPS.includes(c.effectOp) ? c.effectOp : 'addAmount',
      effectValue: Number(c.effectValue) || 0
    }))
  }))
}

export function rulesFromLegacyTiers (tiers: LegacyTier[]): PriceRule[] {
  return tiers.map((tier, index) => ({
    id: pricePartId('rule'),
    priority: index + 1,
    price: Number(tier.price) || 0,
    conditions: [daysCondition(Number(tier.fromDay) || 0, tier.toDay == null ? null : Number(tier.toDay))]
  }))
}

export function defaultDynamicRules (price: number): PriceRule[] {
  return [{
    id: pricePartId('rule'),
    priority: 1,
    price: price > 0 ? price : 0,
    conditions: [daysCondition(0, null)]
  }]
}

export function hydrateRules (
  mode: PriceMode,
  price: number,
  rules: PriceRule[] | undefined | null,
  legacyTiers?: LegacyTier[] | null
): PriceRule[] {
  const cloned = cloneRules(rules)
  if (cloned.length > 0) return cloned
  if (mode === 'dynamic' && Array.isArray(legacyTiers) && legacyTiers.length > 0) {
    return rulesFromLegacyTiers(legacyTiers)
  }
  if (mode === 'dynamic') return defaultDynamicRules(price)
  return []
}

export function hydratePriced<T extends {
  price: number
  priceMode: PriceMode
  priceRules?: PriceRule[]
  priceTiers?: LegacyTier[]
}> (item: T): Omit<T, 'priceTiers'> & { priceRules: PriceRule[] } {
  const { priceTiers, ...rest } = item
  return {
    ...rest,
    priceRules: hydrateRules(item.priceMode, item.price, item.priceRules, priceTiers)
  }
}

export function summaryPrice (mode: PriceMode, price: number, rules: PriceRule[]): number {
  if (mode !== 'dynamic' || rules.length === 0) return price
  return Math.min(...rules.map((rule) => rule.price))
}

export function priceRange (mode: PriceMode, price: number, rules: PriceRule[]): { min: number; max: number } {
  if (mode !== 'dynamic' || rules.length === 0) return { min: price, max: price }
  const amounts = rules.map((rule) => rule.price)
  return { min: Math.min(...amounts), max: Math.max(...amounts) }
}

function conditionToken (c: PriceCondition): string {
  const base = c.kind === 'city'
    ? `city=${c.city.trim().toLowerCase()}`
    : `days=${c.fromDay}-${c.toDay ?? '+'}`
  if (!c.effectOn) return base
  return `${base}@${c.effectOp}:${c.effectValue}`
}

export function conditionAlonePrice (base: number, condition: PriceCondition): number {
  return applyConditionEffect(base, condition)
}

export function applyConditionEffect (amount: number, condition: PriceCondition): number {
  if (!condition.effectOn) return amount
  const value = condition.effectValue
  if (condition.effectOp === 'addAmount') return roundMoney(amount + value)
  if (condition.effectOp === 'subtractAmount') return roundMoney(amount - value)
  if (condition.effectOp === 'addPercent') return roundMoney(amount * (1 + value / 100))
  return roundMoney(amount * (1 - value / 100))
}

export function pricedRuleAmount (rule: PriceRule, ctx: BookingPriceContext): number {
  let amount = rule.price
  for (const condition of rule.conditions) {
    if (!conditionMatches(condition, ctx)) continue
    amount = applyConditionEffect(amount, condition)
  }
  return amount
}

export function serializePriceField (mode: PriceMode, price: number, rules: PriceRule[]): string {
  if (mode !== 'dynamic') return String(summaryPrice(mode, price, rules))
  return cloneRules(rules)
    .map((rule, index) => {
      const body = rule.conditions
        .map((c, i) => `${i === 0 ? '' : c.join + ':'}${conditionToken(c)}`)
        .join(',')
      return `${index}:${rule.priority}:${body}=${rule.price}`
    })
    .join('|')
}

function conditionMatches (c: PriceCondition, ctx: BookingPriceContext): boolean {
  if (c.kind === 'city') {
    return ctx.city.trim().toLowerCase() === c.city.trim().toLowerCase()
  }
  if (!Number.isInteger(ctx.daysAfterBooking) || ctx.daysAfterBooking < 0) return false
  const end = c.toDay ?? Number.POSITIVE_INFINITY
  return ctx.daysAfterBooking >= c.fromDay && ctx.daysAfterBooking <= end
}

export function ruleMatches (rule: PriceRule, ctx: BookingPriceContext): boolean {
  if (rule.conditions.length === 0) return false
  let acc = conditionMatches(rule.conditions[0], ctx)
  for (let i = 1; i < rule.conditions.length; i++) {
    const condition = rule.conditions[i]
    const matched = conditionMatches(condition, ctx)
    acc = condition.join === 'or' ? acc || matched : acc && matched
  }
  return acc
}

export function priceForBooking (
  rules: PriceRule[],
  ctx: BookingPriceContext
): { price: number; priority: number } | null {
  const hits = rules
    .map((rule, index) => ({ rule, index }))
    .filter(({ rule }) => ruleMatches(rule, ctx))
  if (hits.length === 0) return null
  hits.sort((a, b) => a.rule.priority - b.rule.priority || a.index - b.index)
  const winner = hits[0].rule
  return { price: pricedRuleAmount(winner, ctx), priority: winner.priority }
}

export function validatePriceRules (rules: PriceRule[]): PriceRuleError | null {
  if (rules.length === 0) return 'priceNeedRule'
  for (const rule of rules) {
    if (!Number.isInteger(rule.priority) || rule.priority < 1) return 'priceNeedPriority'
    if (rule.price <= 0) return 'priceNeedAmount'
    if (rule.conditions.length === 0) return 'priceNeedCondition'
    for (const condition of rule.conditions) {
      if (condition.kind === 'city') {
        if (!condition.city.trim()) return 'priceNeedCity'
      } else {
        if (!Number.isInteger(condition.fromDay) || condition.fromDay < 0) return 'priceInvalidRange'
        if (condition.toDay != null && (!Number.isInteger(condition.toDay) || condition.toDay < condition.fromDay)) {
          return 'priceInvalidRange'
        }
      }
      if (condition.effectOn && !(condition.effectValue > 0)) return 'priceNeedEffect'
    }
  }
  return null
}

export function addPriceRule (rules: PriceRule[]): PriceRule[] {
  const last = rules[rules.length - 1]
  const priority = rules.reduce((max, rule) => Math.max(max, rule.priority), 0) + 1
  return [
    ...rules,
    {
      id: pricePartId('rule'),
      priority,
      price: last?.price ?? 0,
      conditions: [daysCondition(0, null)]
    }
  ]
}

export function addPriceCondition (rule: PriceRule, join: PriceJoin): PriceRule {
  return {
    ...rule,
    conditions: [...rule.conditions, cityCondition('', join)]
  }
}

export function applyPriceMode (current: Priced, mode: PriceMode): Priced {
  if (mode === 'fixed') {
    return {
      price: summaryPrice(current.priceMode, current.price, current.priceRules),
      priceMode: 'fixed',
      priceRules: []
    }
  }
  const rules =
    current.priceMode === 'dynamic' && current.priceRules.length > 0
      ? cloneRules(current.priceRules)
      : defaultDynamicRules(current.price)
  return {
    price: summaryPrice('dynamic', current.price, rules),
    priceMode: 'dynamic',
    priceRules: rules
  }
}
