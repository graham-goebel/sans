import { useState } from 'react'
import { Button, Heading, Inline, Section, Stack, Text } from '@dovetail-ds/react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Section width="narrow">
      <Stack gap="md">
        <Text variant="eyebrow">sans</Text>
        <Heading level={1}>Built with Dovetail</Heading>
        <Text variant="lead">
          Edit <code>src/App.tsx</code> and save to see changes.
        </Text>
        <Inline>
          <Button variant="primary" onClick={() => setCount((count) => count + 1)}>
            Count is {count}
          </Button>
          <Button variant="secondary" onClick={() => document.documentElement.classList.toggle('dark')}>
            Toggle dark mode
          </Button>
        </Inline>
      </Stack>
    </Section>
  )
}

export default App
