# 🎨 Tailwind Design System - Rastio Style

## Verzija 3.5 - Moderan UI sa Tailwind CSS!

Parentivo Admin panel sada ima **ISTI DIZAJN** kao Rastio Admin! 🚀

---

## 📦 Šta je dodato:

### 1. Tailwind CSS Framework
- **tailwindcss** - Utility-first CSS framework
- **@heroicons/react** - Modern icon library (kao Rastio)
- **autoprefixer** + **postcss** - CSS processing

### 2. Custom Utility Classes

Kreirao sam **ISTE** klase kao u Rastio Admin-u:

#### 🎴 Card Component
```jsx
<div className="card">
  <!-- Sadržaj -->
</div>
```
- Rounded corners (12px)
- Soft shadow
- Hover effect
- Border

#### 🔘 Buttons
```jsx
// Primary (gradient blue)
<button className="btn-primary">Kreiraj</button>

// Secondary (gray)
<button className="btn-secondary">Otkaži</button>

// Danger (gradient red)
<button className="btn-danger">Obriši</button>
```

#### 📝 Input Fields
```jsx
<input className="input-field" placeholder="..." />
```
- Focus ring (blue)
- Hover effect
- Rounded corners

#### 🏷️ Badges
```jsx
<span className="badge badge-superadmin">SUPERADMIN</span>
<span className="badge badge-admin">ADMIN</span>
<span className="badge badge-expert">EXPERT</span>
<span className="badge badge-user">USER</span>
```

#### 📊 Table Styles
```jsx
<div className="table-wrapper">
  <table>
    <thead className="table-header">
      <tr>
        <th className="table-header-cell">Header</th>
      </tr>
    </thead>
    <tbody>
      <tr className="table-row">
        <td className="table-cell">Data</td>
      </tr>
    </tbody>
  </table>
</div>
```

---

## 🎨 Color Palette (Primary Blue - Rastio Style):

```
primary-50:  #eff6ff (lightest)
primary-100: #dbeafe
primary-200: #bfdbfe
primary-300: #93c5fd
primary-400: #60a5fa
primary-500: #3b82f6 (base)
primary-600: #2563eb (buttons)
primary-700: #1d4ed8 (hover)
primary-800: #1e40af
primary-900: #1e3a8a (darkest)
```

### Role Badge Colors:
- **SUPERADMIN**: Purple (`bg-purple-100 text-purple-800`)
- **ADMIN**: Blue (`bg-blue-100 text-blue-800`)
- **EXPERT**: Green (`bg-green-100 text-green-800`)
- **USER**: Gray (`bg-gray-100 text-gray-800`)

---

## 🚀 Kako koristiti:

### Existing Components (Auto-Styled):

Sve tvoje postojeće stranice će **automatski** dobiti nove stilove jer koristiš:
- `card` klasu
- `btn-primary`, `btn-secondary`, `btn-danger`
- `input-field`
- `badge` + varijante

### Nove Komponente:

```jsx
import { 
  MagnifyingGlassIcon, 
  PlusIcon, 
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

function MyComponent() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Naslov
      </h1>
      <p className="text-gray-600 mb-6">
        Opis
      </p>
      
      <div className="card">
        <button className="btn-primary flex items-center gap-2">
          <PlusIcon className="h-5 w-5" />
          Dodaj novi
        </button>
      </div>
    </div>
  );
}
```

---

## 📐 Layout System:

### Grid Layouts:
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <div className="card">Card 1</div>
  <div className="card">Card 2</div>
  <div className="card">Card 3</div>
  <div className="card">Card 4</div>
</div>
```

### Flexbox:
```jsx
<div className="flex items-center justify-between mb-4">
  <h3 className="text-lg font-semibold">Naslov</h3>
  <button className="btn-primary">Akcija</button>
</div>
```

### Spacing:
- **Margin**: `m-4`, `mt-4`, `mb-6`, `mx-auto`
- **Padding**: `p-4`, `px-6`, `py-3`
- **Gap**: `gap-2`, `gap-4`, `gap-6`

---

## 🎯 Responsive Design:

```jsx
// Mobile First Approach
<div className="
  w-full                    /* Mobile: full width */
  md:w-1/2                  /* Tablet: 50% width */
  lg:w-1/3                  /* Desktop: 33% width */
  p-4                       /* All: padding 16px */
  md:p-6                    /* Tablet+: padding 24px */
">
  Content
</div>
```

### Breakpoints:
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

---

## ✨ Special Effects:

### Gradients:
```jsx
// Buttons already use gradients
className="bg-gradient-to-r from-blue-600 to-blue-700"

// Gradient text
className="gradient-text"
```

### Shadows:
```jsx
className="shadow-sm"      // Subtle
className="shadow"         // Default
className="shadow-md"      // Medium
className="shadow-lg"      // Large
className="shadow-xl"      // Extra large
className="shadow-2xl"     // Huge
```

### Hover Effects:
```jsx
className="hover:bg-gray-100 hover:shadow-md transition-all duration-200"
```

### Transitions:
```jsx
className="transition-all duration-200 ease-in-out"
```

---

## 🧩 Common Patterns:

### Filter Section:
```jsx
<div className="card mb-6">
  <h3 className="text-lg font-semibold text-gray-900 mb-4">Filteri</h3>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Naziv
      </label>
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input 
          className="input-field pl-10" 
          placeholder="Pretraži..."
        />
      </div>
    </div>
    <div className="flex items-end">
      <button className="btn-secondary w-full">
        Resetuj
      </button>
    </div>
  </div>
</div>
```

### Data Card with Icon:
```jsx
<div className="card hover:shadow-lg transition-shadow">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-gray-600 mb-1">
        Ukupno korisnika
      </p>
      <p className="text-3xl font-bold text-gray-900">
        {count}
      </p>
    </div>
    <div className="bg-blue-500 p-3 rounded-lg">
      <UsersIcon className="h-8 w-8 text-white" />
    </div>
  </div>
</div>
```

### Action Buttons in Table:
```jsx
<div className="flex gap-2">
  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
    <PencilIcon className="h-5 w-5" />
  </button>
  <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
    <TrashIcon className="h-5 w-5" />
  </button>
</div>
```

---

## 📚 Heroicons Usage:

```jsx
// Outline icons (thin lines)
import { 
  HomeIcon,
  UsersIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

// Solid icons (filled)
import { 
  HomeIcon,
  UsersIcon  
} from '@heroicons/react/24/solid';

// Usage
<HomeIcon className="h-6 w-6 text-gray-600" />
```

---

## 🎨 Typography:

```jsx
// Headings
<h1 className="text-4xl font-bold text-gray-900">H1</h1>
<h2 className="text-3xl font-bold text-gray-900">H2</h2>
<h3 className="text-2xl font-semibold text-gray-900">H3</h3>
<h4 className="text-xl font-semibold text-gray-900">H4</h4>

// Body text
<p className="text-base text-gray-700">Normal text</p>
<p className="text-sm text-gray-600">Small text</p>
<p className="text-xs text-gray-500">Extra small</p>

// Font weights
className="font-light"      // 300
className="font-normal"     // 400
className="font-medium"     // 500
className="font-semibold"   // 600
className="font-bold"       // 700
```

---

## 📦 Instalacija:

```powershell
cd parentivo-admin

# Clean install
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue

# Install all dependencies (including Tailwind)
npm install

# Start development server
npm start
```

---

## ✅ Final Result:

- ✅ **ISTI dizajn kao Rastio Admin**
- ✅ Tailwind utility classes
- ✅ Heroicons ikone
- ✅ Responsive design
- ✅ Smooth animations
- ✅ Modern gradients
- ✅ Custom components
- ✅ Consistent color palette

**LEPŠI, MODERNIJI, PROFESIONALNIJI! 🎨✨**

Sad imaš **IDENTIČAN** look kao Rastio Admin panel! 🚀
