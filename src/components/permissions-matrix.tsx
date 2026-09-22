'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { PERM_KEYS } from '@/lib/types'
import { offeringTitle } from '@/lib/logic'
import { permLabel } from '@/lib/i18n'
import { useStore } from '@/lib/store'

export function PermissionsMatrix ({ providerId }: { providerId: string }) {
  const { state, setPermissions, t } = useStore()
  const locale = state.locale
  const rows = state.offerings.filter((o) => o.providerId === providerId)
  const [selected, setSelected] = useState<string[]>([])
  const rowIds = rows.map((o) => o.id)
  const allSelected = rowIds.length > 0 && rowIds.every((id) => selected.includes(id))
  const someSelected = selected.length > 0 && !allSelected

  return (
    <div className="list-panel space-y-3 overflow-x-auto p-4">
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" onClick={() => setPermissions(providerId, selected, 'view')}>{t('viewOnly')}</Button>
        <Button type="button" variant="outline" onClick={() => setPermissions(providerId, selected, 'price')}>{t('priceOnly')}</Button>
        <Button type="button" variant="outline" onClick={() => setPermissions(providerId, selected, 'price-details')}>{t('priceAndDetails')}</Button>
        <Button type="button" variant="outline" onClick={() => setPermissions(providerId, selected, 'full')}>{t('full')}</Button>
        <Button type="button" onClick={() => setPermissions(providerId, selected, {})}>{t('save')}</Button>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>
              <label className="flex items-center gap-2 font-normal">
                <input
                  type="checkbox"
                  className="accent-brand-magenta"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected
                  }}
                  onChange={(e) => setSelected(e.target.checked ? rowIds : [])}
                  aria-label={t('selectAll')}
                />
                {t('package')}
              </label>
            </th>
            {PERM_KEYS.map((k) => (
              <th key={k}>{permLabel(k, locale)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((o) => (
            <tr key={o.id}>
              <td>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="accent-brand-magenta"
                    checked={selected.includes(o.id)}
                    onChange={(e) =>
                      setSelected((s) => (e.target.checked ? [...s, o.id] : s.filter((id) => id !== o.id)))
                    }
                  />
                  {offeringTitle(o, locale)}
                </label>
              </td>
              {PERM_KEYS.map((k) => (
                <td key={k}>
                  <input
                    type="checkbox"
                    className="accent-brand-magenta"
                    checked={o.permissions[k]}
                    onChange={(e) => setPermissions(providerId, [o.id], { [k]: e.target.checked })}
                    aria-label={`${permLabel(k, locale)} ${offeringTitle(o, locale)}`}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
