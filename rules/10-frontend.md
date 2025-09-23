# Frontend Development Rules

## 🎨 UI/UX Standards
- **Design System**: Use consistent colors, typography, and spacing
- **Dark Mode**: Support both light and dark themes
- **Accessibility**: WCAG 2.1 AA compliance
- **Responsive**: Mobile-first design approach

## ⚛️ React Rules
- **Functional Components**: Use hooks, not class components
- **Custom Hooks**: Extract reusable logic into custom hooks
- **State Management**: Use React state and context appropriately
- **Performance**: Use React.memo, useMemo, useCallback when needed

## 🎯 Component Structure
```
src/components/
├── ui/           # Basic UI components (Button, Input, etc.)
├── forms/        # Form components
├── charts/       # Chart and visualization components
└── features/     # Feature-specific components
```

## 📱 Navigation Rules
- **React Router**: Use for client-side routing
- **Protected Routes**: Authenticate before accessing
- **Deep Linking**: Support URL-based navigation
- **Back Button**: Handle browser back/forward properly

## 🎨 Styling Rules
- **Tailwind CSS**: Use utility classes for styling
- **Custom Components**: Create reusable styled components
- **Responsive**: Use responsive prefixes (sm:, md:, lg:)
- **Dark Mode**: Use dark: prefix for dark mode styles

## 📊 State Management
- **Local State**: Use useState for component state
- **Global State**: Use Context API for app-wide state
- **Server State**: Use React Query for server data
- **Form State**: Use controlled components with useState

## 🔄 Data Flow
- **Props Down**: Pass data from parent to child
- **Events Up**: Use callbacks for child-to-parent communication
- **Context**: Use for deeply nested data sharing
- **Custom Hooks**: Extract complex state logic

## 📱 Mobile Considerations
- **Touch Events**: Handle touch gestures properly
- **Viewport**: Set proper viewport meta tag
- **Performance**: Optimize for mobile devices
- **Offline**: Handle network connectivity issues
