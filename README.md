# react-js-tooltips

A powerful and flexible React library for adding customizable tooltips to your application.

![npm version](https://img.shields.io/npm/v/react-js-tooltips)
![typescript](https://badgen.net/badge/icon/typescript?icon=typescript&label)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/egorlitsky/react-js-tooltips/blob/master/LICENSE)
![downloads](https://badgen.net/npm/dt/react-js-tooltips?icon=npm&color=green)
![minified](https://badgen.net/bundlephobia/min/react-js-tooltips)
![minified gzip](https://badgen.net/bundlephobia/minzip/react-js-tooltips&color=cyan)


## Features

- Simple and intuitive API
- Customizeable - colors, positions, animations
- Responsive design with automatic positioning
- Smart pointer placement
- TypeScript support
- Lightweight and performant
- Programmatic control via TooltipManager

## Installation

```bash
npm install react-js-tooltips
```

## Quick Start

### 1. Add TooltipContainer to your app

Place `TooltipContainer` at the root level of your React app's tree:

```tsx
import React from 'react';
import { TooltipContainer } from 'react-js-tooltips';

function App() {
  return (
    <div className='App'>
      {/* Your app content */}
      <header className='App-header'>
        <TooltipDemo />
      </header>
      <TooltipContainer />
    </div>
  );
}
```

### 2. Basic Usage with TooltipWrapper

![DemoBasic](https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExOXFxdjljcjIyN3o5dXhjaHhqMzB3c3d3OGxxZnNva2s2NjB1ajN2byZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/7PslFkhiBpxgkyazxS/giphy.gif)

```tsx
import React from "react";
import { TooltipWrapper, Tooltip } from "react-js-tooltips";

export const TooltipDemo: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div>
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
          <button
            style={{
              margin: 10,
              backgroundColor: "#1675e0",
              color: "white",
              padding: 10,
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            CLICK ME!
          </button>
        </TooltipWrapper>
      </div>
    </div>
  );
};
```

### 3. Programmatic Control with TooltipManager

![DemoClick](https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExbDIzYXBlc2Z2a3B1cTRsdjU1YWVybHJxOGM3dncwOWM0dzMwYnJ4aCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/zNUYFBkMZvljVu20P6/giphy.gif)

You can control tooltips programmatically using the `TooltipManager`:

```tsx
import React from "react";

import {
  TooltipWrapper,
  Tooltip,
  useTooltipManager,
  TooltipTriggerType,
} from "react-js-tooltips";

export const TooltipDemo: React.FC = () => {
  const tooltipManager = useTooltipManager();
  const TOOLTIP_ID = "my-tooltip";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TooltipWrapper
        uniqueId={TOOLTIP_ID}
        triggerType={TooltipTriggerType.CODE}
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
        <div
          style={{
            color: "white",
            fontSize: 18,
            fontWeight: 500,
            padding: 5,
          }}
        >
          Tooltip is being displayed here
        </div>
      </TooltipWrapper>
      <button
        style={{
          marginTop: 50,
          backgroundColor: "#1675e0",
          color: "white",
          padding: "10px 18px",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "16px",
        }}
        onClick={() => {
          // Activates a tooltip with the given uniqueId
          tooltipManager.activateAwaitingTooltip(TOOLTIP_ID);
        }}
      >
        CLICK TO SHOW A TOOLTIP
      </button>
    </div>
  );
};
```

## API Reference

### TooltipWrapper Props

| Prop | Type | Description |
|------|------|-------------|
| `children` | `React.ReactNode` | The element that triggers the tooltip to be visible by click. Required. |
| `renderOverlay` | `TRenderOverlayFunction` | Renders tooltip content (Tooltip component and its content). Required. |
| `triggerType` | `TooltipTriggerType` | How the tooltip is triggered - programmatically or by click (`CODE` \| `CLICK`). Default: `CLICK` |
| `uniqueId` | `string` | Unique identifier for the tooltip (required when `triggerType` is `CODE`). |
| `blocker` | `boolean` | If true, a tooltip won't be closed by clicking backdrop. Default: `false` |
| `backdropColor` | `string` | Background color of the tooltip backdrop. Default: `rgba(0,0,0,0.01)` |
| `disableAnimation` | `boolean` | Disable fade animations. Default: `false` |
| `className` | `string` | Custom CSS class for the wrapper element. |
| `onClose` | `() => void` | Callback when tooltip closes. |
| `onOpen` | `() => void` | Callback when tooltip opens. |
| `onTargetClick` | `() => void` | Callback when target element is clicked. |

### Tooltip Props

| Prop | Type | Description |
|------|------|-------------|
| `children` | `React.ReactNode` | Tooltip content. Required. |
| `target` | `TTooltipTarget` | Ref to the target element (provided by renderOverlay). Required. |
| `preferredPlacement` | `TooltipPlacement` | Preferred position for a tooltip. |
| `width` | `number` | Fixed width for the tooltip. |
| `pointer` | `boolean` | Show pointer arrow. Default: `true` |
| `forcePointer` | `boolean` | Set to `false` to hide a tooltip's pointer / anchor. Default: `true` |
| `backgroundColor` | `string` | Background color of the tooltip. Default: `#E8EEF7` |
| `borderRadius` | `number` | Border radius of the tooltip. Default: `5` |
| `containerMaxWidth` | `number` | Maximum width of the tooltip container. Default: `400` |
| `containerMaxHeight` | `number` | Maximum height of the tooltip container. Default: `600` |

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
| `add` | `tooltip: Omit<ITooltipInner, 'id'>` | Adds / displays a new tooltip |
| `remove` | `{id: number, uniqueId?: string}` | Removes / closes a specific tooltip |
| `removeByUniqueId` | `uniqueId: string` | Removes / closes tooltip by its unique ID |
| `removeAll` | - | Removes / closes all active tooltips |
| `reset` | - | Resets the tooltip manager (alias for `removeAll`) |
| `getActiveTooltips` | - | Returns all active tooltips |
| `getAwaitingTooltips` | - | Returns all awaiting tooltips |
| `addAwaitingTooltip` | `tooltip: Omit<ITooltipInner, 'id'>` | Adds tooltip to waiting list (for `CODE` `triggerType`) |
| `activateAwaitingTooltip` | `uniqueId: string` | Activates an awaiting tooltip (for `CODE` `triggerType`) |
| `removeAwaitingTooltip` | `uniqueId: string` | Removes an awaiting tooltip so it can't be triggered anymore |
| `isAwaitingTooltipActive` | `uniqueId: string` | Returns true if a waiting tooltip is active |

## Styling

The library includes default styles and animations. You can customize tooltips using `Tooltip` component props. Refer "Tooltip Props" section above.

## Demo

Check out the live demo to see all features in action:

- **Live Demo**: [egorlitsky.github.io/react-js-tooltips-demo](https://egorlitsky.github.io/react-js-tooltips-demo/)
- **GitHub Repo**: [react-js-tooltips-demo](https://github.com/egorlitsky/react-js-tooltips-demo)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT © [Vladislav Egorlitskii](https://github.com/egorlitsky)
