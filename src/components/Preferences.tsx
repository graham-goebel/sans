import { useState, type ReactNode } from 'react'
import { Button, CheckboxGroup, RadioGroup, Select, Sheet, Stack, Switch, Text } from '@dovetail-ds/react'
import {
  loadPreferences,
  PreferencesContext,
  savePreferences,
  type Avoid,
  type Condition,
  type Experience,
  type Preferences,
} from '../lib/preferences'

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
          <RadioGroup
            label="Why do you eat gluten-free?"
            value={preferences.condition}
            onChange={(value) => update({ condition: value as Condition })}
            options={[
              { value: 'coeliac', label: 'Coeliac disease', hint: 'Even traces matter; we’ll flag shared kitchens.' },
              { value: 'sensitivity', label: 'Gluten intolerance or sensitivity' },
              { value: 'wheat-allergy', label: 'Wheat allergy' },
              { value: 'preference', label: 'By choice' },
            ]}
          />
          <CheckboxGroup
            label="Anything else you avoid?"
            hint="Recipes and products start filtered to match."
            value={preferences.avoid}
            onChange={(value) => update({ avoid: value as Avoid[] })}
            options={[
              { value: 'dairy', label: 'Dairy' },
              { value: 'eggs', label: 'Eggs' },
              { value: 'nuts', label: 'Nuts' },
              { value: 'animal', label: 'Animal products (vegan)' },
            ]}
          />
          <RadioGroup
            label="How long have you been gluten-free?"
            value={preferences.experience}
            onChange={(value) => update({ experience: value as Experience })}
            options={[
              { value: 'new', label: 'Just starting', hint: 'Under a year' },
              { value: 'learning', label: 'Getting the hang of it', hint: '1–3 years' },
              { value: 'seasoned', label: 'Seasoned', hint: '3 years or more' },
            ]}
          />
          <Text variant="fine">sans shares information, not medical advice.</Text>
        </Stack>
      </Sheet>
    </PreferencesContext.Provider>
  )
}
