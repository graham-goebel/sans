import { useState, type ReactNode } from 'react'
import { Button, CheckboxGroup, Select, Sheet, Slider, Stack, Switch, Text } from '@dovetail-ds/react'
import { EggOff, MilkOff, NutOff, Vegan } from '../icons'
import {
  experienceLevels,
  loadPreferences,
  PreferencesContext,
  savePreferences,
  type Avoid,
  type Condition,
  type Preferences,
} from '../lib/preferences'
import { FilterChips, type ChipOption } from './FilterChips'

const diets: ChipOption<Avoid>[] = [
  { id: 'dairy', label: 'Dairy-free', icon: MilkOff },
  { id: 'eggs', label: 'Egg-free', icon: EggOff },
  { id: 'nuts', label: 'Nut-free', icon: NutOff },
  { id: 'animal', label: 'Vegan', icon: Vegan },
]

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<Preferences>(loadPreferences)
  const [open, setOpen] = useState(false)

  const update = (change: Partial<Preferences>) =>
    setPreferences((current) => {
      const next = { ...current, ...change }
      savePreferences(next)
      return next
    })

  return (
    <PreferencesContext.Provider value={{ preferences, update, openSheet: () => setOpen(true) }}>
      {children}
      <Sheet
        className="item-sheet"
        open={open}
        onClose={() => setOpen(false)}
        eyebrow="Your preferences"
        title="Make sans yours"
        description="Saved on this device only. Change them any time."
        size="md"
        footer={
          <Button variant="primary" fullWidth onClick={() => setOpen(false)}>
            Done
          </Button>
        }
      >
        <Stack gap="xl">
          <Stack gap="sm">
            <Select
              label="Your city"
              value={preferences.city}
              onChange={() => update({ city: 'denver' })}
              options={[{ value: 'denver', label: 'Denver, CO' }]}
              hint="More cities are on the way."
            />
            <Switch
              label="Sort places by distance"
              hint="Uses your location when you open Places. It stays on this device."
              labelPosition="start"
              checked={preferences.useLocation}
              onChange={(event) => update({ useLocation: event.target.checked })}
            />
          </Stack>
          <CheckboxGroup
            className="leading-labels"
            label="Why do you eat gluten-free?"
            hint="Pick any that apply."
            value={preferences.conditions}
            onChange={(value) => update({ conditions: value as Condition[] })}
            options={[
              { value: 'coeliac', label: 'Coeliac disease', hint: 'Even traces matter; we’ll flag shared kitchens.' },
              { value: 'sensitivity', label: 'Gluten intolerance or sensitivity' },
              { value: 'wheat-allergy', label: 'Wheat allergy' },
              { value: 'preference', label: 'By choice' },
            ]}
          />
          <Stack gap="sm">
            {/* Set like a form field's label and hint, to match the fields around it. */}
            <Stack gap="2xs">
              <span className="field-label">Diet type</span>
              <span className="field-hint">Recipes and products start filtered to match.</span>
            </Stack>
            <FilterChips
              label="Diet type"
              options={diets}
              selected={preferences.avoid}
              onToggle={(id) =>
                update({
                  avoid: preferences.avoid.includes(id)
                    ? preferences.avoid.filter((a) => a !== id)
                    : [...preferences.avoid, id],
                })
              }
            />
          </Stack>
          <Slider
            label="Experience level"
            hint="How long you’ve been gluten-free."
            min={0}
            max={experienceLevels.length - 1}
            step={1}
            value={Math.max(0, experienceLevels.findIndex((l) => l.value === (preferences.experience ?? 'learning')))}
            onChange={(index) => update({ experience: experienceLevels[index].value })}
            showValue
            formatValue={(index) => experienceLevels[index]?.label ?? ''}
          />
          <Text variant="fine">sans shares information, not medical advice.</Text>
        </Stack>
      </Sheet>
    </PreferencesContext.Provider>
  )
}
