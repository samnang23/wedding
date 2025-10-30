# Wedding Invitation Landing Page

Beautiful personalized invitation landing page for wedding guests.

## 📁 Files Created

1. **`/app/invitation.tsx`** - Reusable invitation component
2. **`/app/WeddingContent.tsx`** - Main wedding content component
3. **`/app/page.tsx`** - Root page that integrates invitation + wedding content
4. **`/app/invitation/page.tsx`** - Standalone invitation page (optional)

## 🎯 How It Works

### Main Flow (Default)

When visitors go to your website at `/`, they will:

1. **See the Invitation Screen first** with personalized guest name
2. **Click "ចែកចាយ" (Open)** button
3. **View the main wedding content** (gallery, events, location, etc.)

### URL Parameters

Add a guest name via URL:

```
/?name=លោក លី ម៉ុងស
```

**Examples:**
```
/?name=លោក និង លោកស្រី ចាន់ណារ៉ា
/?name=គ្រួសារ សុខ សំណាង
/?name=Mr. and Mrs. Smith
```

If no name is provided, defaults to: **"ភ្ញៀវជាទីគោរព"** (Respected Guest)

## 🌐 Standalone Invitation Page

You can also use the standalone invitation page:

```
/invitation?name=លោក វិចិត្រ
```

## 🎨 Features

- ✨ Beautiful animated entrance
- 🎭 Personalized guest name display
- 🌳 Forest wedding theme matching main site
- 📱 Fully responsive design
- 🎯 Smooth transitions and animations
- 💫 Floating light effects
- 🔘 Custom "Open" button with hover effects

## 🔧 Customization

### Change Monogram

Edit the SVG in the component:

```tsx
<text>S&R</text>  // Change to your initials
```

### Change Wedding Date

```tsx
នៅថ្ងៃទី១៦ ខែមករា ឆ្នាំ២០២៦  // Update date text
```

### Change Button Text

```tsx
<Button>ចែកចាយ</Button>  // Change button text
```

### Default Guest Name

If no name is provided, it defaults to: **"ភ្ញៀវជាទីគោរព"** (Respected Guest)

## 🌐 URL Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| `name` | Guest name to display | `?name=លោក វិចិត្រ` |

## 📝 Text Labels (Khmer)

- **សូមគោរពអញ្ជើញ** - Respectfully invite
- **សូមអញ្ជើញចូលរួមក្នុងពិធីមង្គលអាពាហ៍ពិពាហ៍របស់យើងខ្ញុំ** - Please join us in our wedding ceremony
- **នៅថ្ងៃទី១៦ ខែមករា ឆ្នាំ២០២៦** - On January 16, 2026
- **ចែកចាយ** - Open/Enter
- **សូមអរគុណសម្រាប់ការចូលរួមរបស់លោកអ្នក** - Thank you for joining us

## 🎬 Animation Timeline

1. **0.2s** - Monogram scales in
2. **0.4s** - "Respectfully invite" fades in
3. **0.6s** - Guest name fades in
4. **0.8s** - Invitation text fades in
5. **1.0s** - Open button scales in
6. **1.2s** - Bottom text fades in

## 💡 How to Share Invitations

### Generate Personalized Links

Create unique links for each guest:

```
https://yourwebsite.com/?name=លោក%20វិចិត្រ
https://yourwebsite.com/?name=គ្រួសារ%20សុខ
https://yourwebsite.com/?name=Mr.%20and%20Mrs.%20Smith
```

### Send via:
- 📱 WhatsApp / Telegram
- 📧 Email
- 💌 SMS
- 🔗 QR Code

### URL Encoding
Use `encodeURIComponent()` for Khmer names:

```javascript
const name = "លោក លី ម៉ុងស"
const link = `https://yourwebsite.com/?name=${encodeURIComponent(name)}`
// Result: https://yourwebsite.com/?name=%E1%9E%9B%E1%9F%84%E1%9E%80...
```

### Bulk Link Generation

Use the included script to generate links for all guests:

```bash
node generate-links.js
```

Edit `generate-links.js` to add your guest list and production URL.

## 🎨 Color Scheme

- Primary Green: `#2c5e1a`
- Secondary Green: `#87b577`
- Light Green: `#4a7c2e`
- Background: `#f8faf6`

## 📱 Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

