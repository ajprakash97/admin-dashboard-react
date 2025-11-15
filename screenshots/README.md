# How to Add Screenshots to README

## Step 1: Take Screenshots

1. Run your app: `npm run dev`
2. Navigate to the page you want to screenshot
3. Take a screenshot (Windows: `Win + Shift + S`, Mac: `Cmd + Shift + 4`)
4. Save the image in this `screenshots/` folder

## Step 2: Name Your Files

Use descriptive names:
- `dashboard.png` - Main dashboard
- `analytics.png` - Analytics page
- `users.png` - Users page
- `settings.png` - Settings page

## Step 3: Add to README.md

Open `README.md` and uncomment/add the screenshot section:

```markdown
## 📸 Screenshots

![Dashboard](./screenshots/dashboard.png)
![Analytics](./screenshots/analytics.png)
![Users](./screenshots/users.png)
```

## Image Format Options

### Single Image
```markdown
![Dashboard](./screenshots/dashboard.png)
```

### Image with Link
```markdown
[![Dashboard](./screenshots/dashboard.png)](./screenshots/dashboard.png)
```

### Multiple Images Side by Side
```markdown
<div align="center">
  <img src="./screenshots/dashboard.png" width="45%" />
  <img src="./screenshots/analytics.png" width="45%" />
</div>
```

### Image with Caption (using HTML)
```markdown
<div align="center">
  <img src="./screenshots/dashboard.png" alt="Dashboard" width="800"/>
  <p><em>Main Dashboard View</em></p>
</div>
```

## Best Practices

- **Format**: Use PNG or JPG
- **Size**: Keep images under 1MB (optimize if needed)
- **Width**: 1200-1920px works well for GitHub
- **Naming**: Use lowercase with hyphens (e.g., `dashboard-page.png`)

## Optimizing Images

If images are too large, use tools like:
- [TinyPNG](https://tinypng.com/) - Compress PNG/JPG
- [Squoosh](https://squoosh.app/) - Image optimization

