'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cityLabel, formatPriceAmount } from '@/lib/i18n'
import {
  addPriceCondition,
  addPriceRule,
  applyPriceMode,
  conditionAlonePrice,
  priceForBooking,
  validatePriceRules
} from '@/lib/price'
import type { Offering, PriceCondition, PriceEffectOp, PriceMode, PriceRule } from '@/lib/types'
import { useStore } from '@/lib/store'

const inputClass = 'app-field mt-1 w-full'

export function PriceFields ({
  draft,
  locked,
  onChange
}: {
  draft: Offering
  locked: boolean
  onChange: (patch: Pick<Offering, 'price' | 'priceMode' | 'priceRules'>) => void
}) {
  const { state, t } = useStore()
  const locale = state.locale
  const [previewCity, setPreviewCity] = useState('Riyadh')
  const [previewDays, setPreviewDays] = useState(2)
  const rules = draft.priceRules ?? []
  const error = draft.priceMode === 'dynamic' ? validatePriceRules(rules) : null
  const preview = draft.priceMode === 'dynamic'
    ? priceForBooking(rules, { city: previewCity, daysAfterBooking: previewDays })
    : null

  const setMode = (mode: PriceMode) => {
    if (locked) return
    onChange(applyPriceMode(draft, mode))
  }

  const setRules = (priceRules: PriceRule[]) => {
    onChange({ priceMode: 'dynamic', priceRules, price: draft.price })
  }

  const updateRule = (index: number, patch: Partial<PriceRule>) => {
    setRules(rules.map((rule, i) => (i === index ? { ...rule, ...patch } : rule)))
  }

  const updateCondition = (ruleIndex: number, conditionIndex: number, patch: Partial<PriceCondition>) => {
    const rule = rules[ruleIndex]
    updateRule(ruleIndex, {
      conditions: rule.conditions.map((condition, i) => (i === conditionIndex ? { ...condition, ...patch } : condition))
    })
  }

  return (
    <fieldset className="space-y-3" disabled={locked}>
      <legend className="text-sm font-semibold text-neutral-700">{t('price')}</legend>
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant={draft.priceMode === 'fixed' ? 'default' : 'outline'} onClick={() => setMode('fixed')}>
          {t('fixed')}
        </Button>
        <Button type="button" variant={draft.priceMode === 'dynamic' ? 'default' : 'outline'} onClick={() => setMode('dynamic')}>
          {t('dynamic')}
        </Button>
      </div>
      {draft.priceMode === 'fixed' ? (
        <label className="app-label">
          {t('sar')}
          <input
            className={inputClass}
            value={draft.price || ''}
            inputMode="numeric"
            onChange={(e) => {
              onChange({
                priceMode: 'fixed',
                priceRules: [],
                price: Number(e.target.value) || 0
              })
            }}
          />
        </label>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-neutral-600">{t('priceRulesHint')}</p>
          {rules.map((rule, ruleIndex) => (
            <article key={rule.id} className="list-panel space-y-3 bg-neutral-50 p-4">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <label className="text-xs font-medium text-neutral-700">
                  {t('priority')}
                  <input
                    className={`${inputClass} w-24`}
                    value={rule.priority}
                    inputMode="numeric"
                    onChange={(e) => updateRule(ruleIndex, { priority: Number(e.target.value) || 0 })}
                  />
                </label>
                <label className="text-xs font-medium text-neutral-700">
                  {t('rulePrice')}
                  <span className="mt-1 flex items-center gap-2">
                    <span className="text-sm font-semibold text-brand-magenta">{t('sar')}</span>
                    <input
                      className="app-field w-36 text-lg font-extrabold"
                      value={rule.price || ''}
                      inputMode="numeric"
                      onChange={(e) => updateRule(ruleIndex, { price: Number(e.target.value) || 0 })}
                    />
                  </span>
                </label>
                <Button
                  type="button"
                  variant="outline"
                  disabled={rules.length <= 1}
                  onClick={() => setRules(rules.filter((_, i) => i !== ruleIndex))}
                >
                  {t('removeRule')}
                </Button>
              </div>
              <ol className="space-y-3">
                {rule.conditions.map((condition, conditionIndex) => (
                  <li key={condition.id} className="rounded-xl border border-neutral-200 bg-white p-3">
                    {conditionIndex > 0 ? (
                      <div className="mb-3 flex gap-2">
                        <Button
                          type="button"
                          variant={condition.join === 'and' ? 'default' : 'outline'}
                          onClick={() => updateCondition(ruleIndex, conditionIndex, { join: 'and' })}
                        >
                          {t('joinAnd')}
                        </Button>
                        <Button
                          type="button"
                          variant={condition.join === 'or' ? 'default' : 'outline'}
                          onClick={() => updateCondition(ruleIndex, conditionIndex, { join: 'or' })}
                        >
                          {t('joinOr')}
                        </Button>
                      </div>
                    ) : null}
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-[16rem] flex-1 space-y-3">
                        <label className="block text-xs font-medium text-neutral-700">
                          {t('conditionCity')} / {t('conditionDays')}
                          <select
                            className={inputClass}
                            value={condition.kind}
                            onChange={(e) => {
                              const kind = e.target.value === 'city' ? 'city' : 'daysAfterBooking'
                              updateCondition(ruleIndex, conditionIndex, {
                                kind,
                                city: kind === 'city' ? condition.city || 'Riyadh' : '',
                                fromDay: 0,
                                toDay: kind === 'daysAfterBooking' ? 3 : null
                              })
                            }}
                          >
                            <option value="city">{t('conditionCity')}</option>
                            <option value="daysAfterBooking">{t('conditionDays')}</option>
                          </select>
                        </label>
                        {condition.kind === 'city' ? (
                          <label className="block text-xs font-medium text-neutral-700">
                            {t('cityEquals')}
                            <input
                              className={inputClass}
                              value={condition.city}
                              onChange={(e) => updateCondition(ruleIndex, conditionIndex, { city: e.target.value })}
                            />
                          </label>
                        ) : (
                          <div className="grid grid-cols-2 gap-2">
                            <label className="text-xs font-medium text-neutral-700">
                              {t('fromDay')}
                              <input
                                className={inputClass}
                                value={condition.fromDay}
                                inputMode="numeric"
                                onChange={(e) => updateCondition(ruleIndex, conditionIndex, { fromDay: Number(e.target.value) || 0 })}
                              />
                            </label>
                            <label className="text-xs font-medium text-neutral-700">
                              {t('toDay')}
                              <input
                                className={inputClass}
                                value={condition.toDay ?? ''}
                                disabled={condition.toDay == null}
                                inputMode="numeric"
                                onChange={(e) => updateCondition(ruleIndex, conditionIndex, { toDay: Number(e.target.value) || 0 })}
                              />
                            </label>
                            <label className="col-span-2 flex items-center gap-2 text-xs">
                              <input
                                type="checkbox"
                                checked={condition.toDay == null}
                                onChange={(e) => updateCondition(ruleIndex, conditionIndex, {
                                  toDay: e.target.checked ? null : condition.fromDay
                                })}
                              />
                              {t('andUp')}
                            </label>
                          </div>
                        )}
                        <div className="flex flex-wrap items-end gap-2">
                          <label className="flex items-center gap-2 pb-2 text-xs font-medium">
                            <input
                              type="checkbox"
                              checked={condition.effectOn}
                              onChange={(e) => updateCondition(ruleIndex, conditionIndex, {
                                effectOn: e.target.checked,
                                effectValue: e.target.checked && condition.effectValue <= 0 ? 10 : condition.effectValue
                              })}
                            />
                            {t('priceEffect')}
                          </label>
                          {condition.effectOn ? (
                            <>
                              <label className="text-xs font-medium text-neutral-700">
                                {t('priceEffect')}
                                <select
                                  className={inputClass}
                                  value={condition.effectOp}
                                  onChange={(e) => updateCondition(ruleIndex, conditionIndex, {
                                    effectOp: e.target.value as PriceEffectOp
                                  })}
                                >
                                  <option value="addAmount">{t('effectAddAmount')}</option>
                                  <option value="addPercent">{t('effectAddPercent')}</option>
                                  <option value="subtractAmount">{t('effectSubtractAmount')}</option>
                                  <option value="subtractPercent">{t('effectSubtractPercent')}</option>
                                </select>
                              </label>
                              <label className="text-xs font-medium text-neutral-700">
                                {condition.effectOp === 'addPercent' || condition.effectOp === 'subtractPercent' ? '%' : t('sar')}
                                <input
                                  className={`${inputClass} w-28`}
                                  value={condition.effectValue || ''}
                                  inputMode="decimal"
                                  onChange={(e) => updateCondition(ruleIndex, conditionIndex, {
                                    effectValue: Number(e.target.value) || 0
                                  })}
                                />
                              </label>
                            </>
                          ) : null}
                        </div>
                      </div>
                      <div className="min-w-36 rounded-xl bg-brand-blush px-3 py-2 text-end">
                        <p className="text-xs font-medium text-neutral-700">{t('alonePrice')}</p>
                        <p className="text-lg font-extrabold text-brand-magenta">
                          {formatPriceAmount(conditionAlonePrice(rule.price, condition), locale)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        disabled={rule.conditions.length <= 1}
                        onClick={() => updateRule(ruleIndex, {
                          conditions: rule.conditions.filter((_, i) => i !== conditionIndex)
                        })}
                      >
                        {t('removeCondition')}
                      </Button>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" onClick={() => updateRule(ruleIndex, addPriceCondition(rule, 'and'))}>
                  {t('addAnd')}
                </Button>
                <Button type="button" variant="outline" onClick={() => updateRule(ruleIndex, addPriceCondition(rule, 'or'))}>
                  {t('addOr')}
                </Button>
              </div>
            </article>
          ))}
          <Button type="button" variant="outline" onClick={() => setRules(addPriceRule(rules))}>
            {t('addRule')}
          </Button>
          <section className="list-panel space-y-3 p-4">
            <h3 className="font-extrabold text-neutral-900">{t('tryBooking')}</h3>
            <div className="grid gap-2 sm:grid-cols-2">
              <label className="text-xs font-medium text-neutral-700">
                {t('previewCity')}
                <input
                  className={inputClass}
                  value={previewCity}
                  onChange={(e) => setPreviewCity(e.target.value)}
                />
              </label>
              <label className="text-xs font-medium text-neutral-700">
                {t('contractDays')}
                <input
                  className={inputClass}
                  value={previewDays}
                  inputMode="numeric"
                  onChange={(e) => setPreviewDays(Number(e.target.value) || 0)}
                />
              </label>
            </div>
            <p className="rounded-lg bg-neutral-50 px-3 py-2 text-sm font-medium">
              {preview == null
                ? t('noPriceForBooking')
                : `${t('bookingPreview', {
                    city: cityLabel(previewCity, locale),
                    days: previewDays,
                    amount: formatPriceAmount(preview.price, locale)
                  })} ${t('priorityWins', { priority: preview.priority })}`}
            </p>
          </section>
          {error ? <p className="app-error">{t(error)}</p> : null}
        </div>
      )}
    </fieldset>
  )
}
