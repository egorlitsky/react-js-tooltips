# react-js-tooltips

A powerful and flexible React library for adding customizable tooltips to your application.

[![npm version](https://badge.fury.io/js/react-js-tooltips.svg)](https://www.npmjs.com/package/react-js-tooltips)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/egorlitsky/react-js-tooltips/blob/master/LICENSE)

## 🎯 Features

- Simple and intuitive API
- Highly customizable (colors, positions, animations)
- Responsive design with automatic positioning
- Smart pointer placement
- TypeScript support
- Lightweight and performant
- Multiple placement options
- Programmatic control via TooltipManager

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
        renderOverlay={(tooltipProps: any) => {
          return (
            <Tooltip {...tooltipProps} width={240}>
              <div>
                <h3>Tooltip Title</h3>
                <p>This is a tooltip with some content.</p>
              </div>
            </Tooltip>
          );
        }}
      >
        <button>
          Click me!
        </button>
      </TooltipWrapper>
  );
}
```

### 3. Programmatic Control with TooltipManager

You can control tooltips programmatically using the `TooltipManager`:

```tsx
import { useTooltipManager, TooltipTriggerType } from 'react-js-tooltips';

function Example() {
  const tooltipManager = useTooltipManager();

  const openTooltip = () => {
    // Activates a tooltip with the given uniqueId
    tooltipManager.activateAwaitingTooltip('my-tooltip');
  };

  return (
    <div>
      <button onClick={openTooltip}>Open Tooltip</button>
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
