# react-js-tooltips

A powerful and flexible React library for creating beautiful, customizable tooltips.

[![npm version](https://badge.fury.io/js/react-js-tooltips.svg)](https://www.npmjs.com/package/react-js-tooltips)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/egorlitsky/react-js-tooltips/blob/master/LICENSE)

## 🎯 Features

- ✨ Simple and intuitive API
- 🎨 Highly customizable (colors, positions, animations)
- 📱 Responsive design with automatic positioning
- 🎯 Smart pointer placement
- 🚀 TypeScript support
- ⚡ Lightweight and performant
- 🎭 Multiple placement options
- 🔄 Programmatic control via TooltipManager

## 📦 Installation

```bash
npm install react-js-tooltips
```

## 🚀 Quick Start

### 1. Add TooltipContainer to your app

Wrap your application with `TooltipContainer` at the root level:

```tsx
import React from 'react';
import { TooltipContainer } from 'react-js-tooltips';

function App() {
  return (
    <div>
      <TooltipContainer />
      {/* Your app content */}
    </div>
  );
}
```

### 2. Basic Usage with TooltipWrapper

```tsx
import { TooltipWrapper, Tooltip, TooltipTriggerType } from 'react-js-tooltips';

function MyComponent() {
  return (
    <TooltipWrapper
      renderOverlay={({ target }) => (
        <Tooltip target={target}>
          This is a simple tooltip!
        </Tooltip>
      )}
    >
      <button>Hover me!</button>
    </TooltipWrapper>
  );
}
```

## 📚 Usage Examples

### Customizable Tooltip

```tsx
import { 
  TooltipWrapper, 
  Tooltip, 
  TooltipPlacement 
} from 'react-js-tooltips';

function CustomTooltip() {
  return (
    <TooltipWrapper
      renderOverlay={({ target }) => (
        <Tooltip
          target={target}
          preferredPlacement={TooltipPlacement.TOP}
          backgroundColor="#333"
          containerMaxWidth={300}
          borderRadius={8}
        >
          <div style={{ padding: '16px', color: '#fff' }}>
            <h3>Custom Styled Tooltip</h3>
            <p>This tooltip has custom colors and sizing!</p>
          </div>
        </Tooltip>
      )}
      blocker={false}
      backdropColor="rgba(0,0,0,0.3)"
      onClose={() => console.log('Tooltip closed')}
      onOpen={() => console.log('Tooltip opened')}
    >
      <button>Click for tooltip</button>
    </TooltipWrapper>
  );
}
```

### Tooltip with Unique ID (Triggered by Code)

```tsx
import { 
  TooltipWrapper, 
  Tooltip, 
  TooltipTriggerType,
  TooltipPlacement 
} from 'react-js-tooltips';

function CodeTriggeredTooltip() {
  return (
    <TooltipWrapper
      uniqueId="my-tooltip-1"
      triggerType={TooltipTriggerType.CODE}
      renderOverlay={({ target }) => (
        <Tooltip
          target={target}
          preferredPlacement={TooltipPlacement.BOTTOM}
          pointer={true}
          forcePointer={true}
        >
          This tooltip will be triggered programmatically
        </Tooltip>
      )}
    >
      <span>This element will show tooltip on code trigger</span>
    </TooltipWrapper>
  );
}
```

### Multiple Tooltips

```tsx
function MultipleTooltips() {
  return (
    <div>
      <TooltipWrapper
        renderOverlay={({ target }) => (
          <Tooltip target={target} preferredPlacement={TooltipPlacement.TOP}>
            Top tooltip
          </Tooltip>
        )}
      >
        <button>Top</button>
      </TooltipWrapper>

      <TooltipWrapper
        renderOverlay={({ target }) => (
          <Tooltip target={target} preferredPlacement={TooltipPlacement.RIGHT}>
            Right tooltip
          </Tooltip>
        )}
      >
        <button>Right</button>
      </TooltipWrapper>

      <TooltipWrapper
        renderOverlay={({ target }) => (
          <Tooltip target={target} preferredPlacement={TooltipPlacement.BOTTOM}>
            Bottom tooltip
          </Tooltip>
        )}
      >
        <button>Bottom</button>
      </TooltipWrapper>

      <TooltipWrapper
        renderOverlay={({ target }) => (
          <Tooltip target={target} preferredPlacement={TooltipPlacement.LEFT}>
            Left tooltip
          </Tooltip>
        )}
      >
        <button>Left</button>
      </TooltipWrapper>
    </div>
  );
}
```

## 🎮 Programmatic Control with TooltipManager

You can control tooltips programmatically using the `TooltipManager`:

```tsx
import { useTooltipManager, TooltipTriggerType } from 'react-js-tooltips';

function ControlPanel() {
  const tooltipManager = useTooltipManager();

  const openTooltip = () => {
    // Activates a tooltip with the given uniqueId
    tooltipManager.activateAwaitingTooltip('my-tooltip-1');
  };

  const closeTooltip = () => {
    // Removes a specific tooltip by uniqueId
    tooltipManager.removeByUniqueId('my-tooltip-1');
  };

  const removeAllTooltips = () => {
    // Closes all active tooltips
    tooltipManager.removeAll();
  };

  const getActiveTooltips = () => {
    // Returns array of all active tooltip configurations
    return tooltipManager.getActiveTooltips();
  };

  return (
    <div>
      <button onClick={openTooltip}>Open Tooltip</button>
      <button onClick={closeTooltip}>Close Tooltip</button>
      <button onClick={removeAllTooltips}>Close All</button>
    </div>
  );
}
```

## 🔧 API Reference

### TooltipWrapper Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | required | The element that triggers the tooltip |
| `renderOverlay` | `TRenderOverlayFunction` | required | Function that returns the tooltip content (Tooltip component) |
| `triggerType` | `TooltipTriggerType` | `CLICK` | How the tooltip is triggered (`CLICK` \| `CODE`) |
| `uniqueId` | `string` | undefined | Unique identifier for the tooltip (required when `triggerType` is `CODE`) |
| `blocker` | `boolean` | `false` | If true, user must interact with tooltip before closing |
| `backdropColor` | `string` | `rgba(0,0,0,0.01)` | Background color of the tooltip backdrop |
| `disableAnimation` | `boolean` | `false` | Disable fade animations |
| `className` | `string` | undefined | Custom CSS class for the wrapper element |
| `onClose` | `() => void` | undefined | Callback when tooltip closes |
| `onOpen` | `() => void` | undefined | Callback when tooltip opens |
| `onTargetClick` | `() => void` | undefined | Callback when target element is clicked |

### Tooltip Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | required | Tooltip content |
| `target` | `TTooltipTarget` | required | Ref to the target element (provided by renderOverlay) |
| `preferredPlacement` | `TooltipPlacement` | undefined | Preferred position for the tooltip |
| `width` | `number` | undefined | Fixed width for the tooltip |
| `pointer` | `boolean` | `true` | Show pointer arrow |
| `forcePointer` | `boolean` | `true` | Force pointer to always be visible |
| `backgroundColor` | `string` | `#E8EEF7` | Background color of the tooltip |
| `borderRadius` | `number` | `5` | Border radius of the tooltip |
| `containerMaxWidth` | `number` | `400` | Maximum width of the tooltip container |
| `containerMaxHeight` | `number` | `600` | Maximum height of the tooltip container |

### TooltipPlacement Enum

Available placement options:

```tsx
enum TooltipPlacement {
  TOP = 'top',
  LEFT = 'left',
  BOTTOM = 'bottom',
  RIGHT = 'right',
  
  TOP_LEFT = 'top-left',
  TOP_RIGHT = 'top-right',
  BOTTOM_LEFT = 'bottom-left',
  BOTTOM_RIGHT = 'bottom-right',
  
  LEFT_TOP = 'left-top',
  LEFT_BOTTOM = 'left-bottom',
  RIGHT_TOP = 'right-top',
  RIGHT_BOTTOM = 'right-bottom',
  
  NONE = 'none'
}
```

### TooltipTriggerType Enum

```tsx
enum TooltipTriggerType {
  CLICK = 'click',  // Triggered by clicking the element
  CODE = 'code'     // Triggered programmatically
}
```

### TooltipManager Methods

| Method | Parameters | Description |
|--------|------------|-------------|
| `add(tooltip)` | `tooltip: Omit<ITooltipInner, 'id'>` | Add a new tooltip |
| `remove({id, uniqueId})` | `{id: number, uniqueId?: string}` | Remove a specific tooltip |
| `removeByUniqueId(uniqueId)` | `uniqueId: string` | Remove tooltip by unique ID |
| `removeAll()` | - | Remove all active tooltips |
| `reset()` | - | Reset the tooltip manager (alias for removeAll) |
| `getActiveTooltips()` | - | Get all active tooltip configurations |
| `getAwaitingTooltips()` | - | Get all waiting tooltip configurations |
| `addAwaitingTooltip(tooltip)` | `tooltip: Omit<ITooltipInner, 'id'>` | Add tooltip to waiting list (for CODE trigger) |
| `activateAwaitingTooltip(uniqueId)` | `uniqueId: string` | Activate a waiting tooltip |
| `removeAwaitingTooltip(uniqueId)` | `uniqueId: string` | Remove a waiting tooltip |
| `isAwaitingTooltipActive(uniqueId)` | `uniqueId: string` | Check if a waiting tooltip is active |

## 🎨 Styling

The library includes default styles and animations. You can customize tooltips using:

- **Props**: Most styling props are available directly on the `Tooltip` component
- **CSS Modules**: Import and override styles from the library's CSS modules
- **Inline styles**: Pass custom styles through props

## 🌐 Demo

Check out the live demo to see all features in action:

- **GitHub Repo**: [react-js-tooltips-demo](https://github.com/egorlitsky/react-js-tooltips-demo)
- **Live Demo**: [egorlitsky.github.io/react-js-tooltips-demo](https://egorlitsky.github.io/react-js-tooltips-demo/)

## 📖 Documentation

For more information, visit the [GitHub repository](https://github.com/egorlitsky/react-js-tooltips).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT © [Vladislav Egorlitskii](https://github.com/egorlitsky)
