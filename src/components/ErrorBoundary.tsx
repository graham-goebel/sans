import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Button, EmptyState, Section } from '@dovetail-ds/react'
import { TriangleAlert } from '../icons'

interface State {
  failed: boolean
}

/**
 * Catches a crash in one page so the rest of the app (nav, search) keeps
 * working. The shell keys it on the path, so moving to another page resets it.
 */
export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { failed: false }

  static getDerivedStateFromError(): State {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Where error monitoring will hook in (see docs/ROADMAP.md).
    console.error('Page crashed', error, info.componentStack)
  }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <Section>
        <EmptyState
          icon={<TriangleAlert />}
          title="Something went wrong on this page"
          description="The rest of sans is still working. Try again, or head back home."
          action={<Button onClick={() => window.location.reload()}>Try again</Button>}
          secondaryAction={
            <Button variant="secondary" onClick={() => (window.location.hash = '/')}>
              Go home
            </Button>
          }
        />
      </Section>
    )
  }
}
