# Installation Guide

Complete installation and setup guide for CUET Lost & Found Box.

## 📋 Table of Contents

- [System Requirements](#system-requirements)
- [Quick Start](#quick-start)
- [Detailed Installation](#detailed-installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Troubleshooting](#troubleshooting)
- [Development Setup](#development-setup)

---

## 🖥️ System Requirements

### Minimum Requirements

- **Operating System**: Windows 10/11, macOS 10.15+, or Linux (Ubuntu 20.04+)
- **Web Browser**: 
  - Chrome 90+
  - Firefox 88+
  - Safari 14+
  - Edge 90+
- **Disk Space**: 50 MB for frontend files
- **Internet Connection**: Required for initial setup

### Recommended

- **Browser**: Latest version of Chrome or Firefox
- **Screen Resolution**: 1920x1080 or higher
- **RAM**: 4GB+ for smooth development experience
- **Code Editor**: VS Code (with recommended extensions)

---

## ⚡ Quick Start

### For End Users (Just Want to Use It)

1. **Download or Clone**
   ```bash
   git clone https://github.com/yourusername/cuet-lost-found-box.git
   cd cuet-lost-found-box/Frontend
   ```

2. **Open in Browser**
   - Simply double-click `index.html`
   - Or use a local server (recommended):
     ```bash
     python -m http.server 8000
     ```
   - Navigate to `http://localhost:8000`

3. **Start Using**
   - Register for an account
   - Report lost or found items
   - Search for items

That's it! 🎉

---

## 📦 Detailed Installation

### Method 1: Direct Download

1. **Download ZIP**
   - Go to GitHub repository
   - Click "Code" → "Download ZIP"
   - Extract to your desired location

2. **Open Project**
   ```bash
   cd path/to/extracted/folder/Frontend
   ```

3. **Run**
   - Open `index.html` in your browser

### Method 2: Git Clone

1. **Install Git** (if not installed)
   - Windows: Download from [git-scm.com](https://git-scm.com)
   - Mac: `brew install git`
   - Linux: `sudo apt-get install git`

2. **Clone Repository**
   ```bash
   git clone https://github.com/yourusername/cuet-lost-found-box.git
   cd cuet-lost-found-box
   ```

3. **Navigate to Frontend**
   ```bash
   cd Frontend
   ```

### Method 3: With Local Server (Recommended)

#### Using Python

**Check Python version:**
```bash
python --version
# or
python3 --version
```

**Start server:**
```bash
# Python 3.x
python -m http.server 8000

# Python 2.x (if applicable)
python -m SimpleHTTPServer 8000
```

**Access application:**
- Open browser to `http://localhost:8000`

#### Using Node.js

**Install http-server:**
```bash
npm install -g http-server
```

**Start server:**
```bash
http-server -p 8000
```

**Access application:**
- Open browser to `http://localhost:8000`

#### Using VS Code Live Server

1. **Install VS Code**
   - Download from [code.visualstudio.com](https://code.visualstudio.com)

2. **Install Live Server Extension**
   - Open VS Code
   - Go to Extensions (Ctrl+Shift+X)
   - Search "Live Server"
   - Click Install

3. **Run**
   - Right-click `index.html`
   - Select "Open with Live Server"

---

## ⚙️ Configuration

### Browser Settings

#### Enable JavaScript
1. Open browser settings
2. Search for "JavaScript"
3. Ensure it's enabled

#### Clear Cache (if having issues)
```
Chrome: Ctrl+Shift+Delete
Firefox: Ctrl+Shift+Delete
Safari: Cmd+Option+E
```

### LocalStorage

The application uses browser LocalStorage for data persistence (demo version).

**Check LocalStorage:**
1. Open browser DevTools (F12)
2. Go to Application/Storage tab
3. Expand LocalStorage
4. You should see stored items

**Clear LocalStorage:**
```javascript
// In browser console
localStorage.clear();
```

### Optional: Environment Setup

For future backend integration, create a `.env` file:

```env
# API Configuration
API_BASE_URL=http://localhost:8000
API_VERSION=v1

# App Configuration
APP_NAME=CUET Lost & Found Box
APP_ENV=development

# Feature Flags
ENABLE_NOTIFICATIONS=false
ENABLE_CHAT=false
```

---

## 🚀 Running the Application

### First Time Setup

1. **Open Application**
   - Navigate to `http://localhost:8000` (or open `index.html`)

2. **Register Account**
   - Click "Register"
   - Fill in registration form
   - Use a valid email format
   - Create a strong password

3. **Login**
   - Use your credentials
   - You'll be redirected to the feed page

4. **Explore Features**
   - Report lost/found items
   - Search for items
   - View your dashboard

### Admin Access (Demo)

For demonstration purposes, use these credentials:

**Admin Account:**
```
Email: admin@cuet.ac.bd
Password: admin123
```

**Super Admin Account:**
```
Email: superadmin@cuet.ac.bd
Password: superadmin123
```

> ⚠️ **Note**: These are demo accounts. In production, proper authentication will be required.

---

## 🔧 Troubleshooting

### Common Issues

#### Issue: Blank Page

**Symptom**: Page loads but nothing appears

**Solutions**:
1. Check browser console for errors (F12)
2. Ensure JavaScript is enabled
3. Clear browser cache
4. Try a different browser

#### Issue: Images Not Loading

**Symptom**: Logo or other images don't display

**Solutions**:
1. Check file paths in HTML
2. Ensure images exist in `Frontend/resources/`
3. Use local server instead of opening file directly

#### Issue: Forms Not Submitting

**Symptom**: Submit button doesn't work

**Solutions**:
1. Check browser console for errors
2. Ensure all required fields are filled
3. Check email/phone validation
4. Clear LocalStorage and try again

#### Issue: LocalStorage Full

**Symptom**: Can't add new items

**Solutions**:
```javascript
// Clear old data
localStorage.clear();

// Or selectively remove items
localStorage.removeItem('lostFoundItems');
```

#### Issue: Styles Not Applying

**Symptom**: Page looks broken or unstyled

**Solutions**:
1. Clear browser cache
2. Check CSS file paths
3. Verify CSS files exist
4. Hard refresh (Ctrl+Shift+R)

### Browser-Specific Issues

#### Chrome
- Try incognito mode
- Disable extensions
- Clear site data

#### Firefox
- Check tracking protection settings
- Try private window
- Clear cookies and cache

#### Safari
- Check privacy settings
- Allow LocalStorage
- Clear website data

### Getting Help

If you encounter issues:

1. **Check Documentation**
   - Read [README.md](README.md)
   - Review [Frontend README](Frontend/README.md)
   - Check [QUICKSTART.html](Frontend/QUICKSTART.html)

2. **Search Issues**
   - Look through [GitHub Issues](https://github.com/yourusername/cuet-lost-found-box/issues)

3. **Ask for Help**
   - Open a new issue on GitHub
   - Include:
     - Browser and version
     - Operating system
     - Steps to reproduce
     - Screenshots
     - Console errors

---

## 👨‍💻 Development Setup

### For Contributors

1. **Fork Repository**
   - Click "Fork" on GitHub

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/YOUR-USERNAME/cuet-lost-found-box.git
   cd cuet-lost-found-box
   ```

3. **Create Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Install Development Tools**

   **VS Code Extensions** (recommended):
   - Live Server
   - Prettier - Code formatter
   - ESLint
   - HTML CSS Support
   - Auto Rename Tag
   - Path Intellisense

5. **Setup Linting** (optional)
   ```bash
   npm init -y
   npm install --save-dev eslint prettier
   ```

6. **Make Changes**
   - Edit files
   - Test thoroughly
   - Follow [coding standards](CONTRIBUTING.md)

7. **Commit and Push**
   ```bash
   git add .
   git commit -m "Add: Description of changes"
   git push origin feature/your-feature-name
   ```

8. **Create Pull Request**
   - Go to GitHub
   - Click "New Pull Request"
   - Fill in PR template

---

## 📱 Mobile Testing

### Using Browser DevTools

1. Open DevTools (F12)
2. Click device toggle (Ctrl+Shift+M)
3. Select device or custom dimensions
4. Test responsiveness

### Using Real Devices

1. Find your local IP:
   ```bash
   # Windows
   ipconfig
   
   # Mac/Linux
   ifconfig
   ```

2. Start server on your computer

3. On mobile device:
   - Connect to same WiFi
   - Open browser
   - Navigate to `http://YOUR-IP:8000`

---

## 🔄 Updating

### Update to Latest Version

```bash
# If using git
cd cuet-lost-found-box
git pull origin main

# If downloaded ZIP
# Download latest version and replace files
```

### Backup Your Data

Before updating:

```javascript
// Export LocalStorage data
const data = JSON.stringify(localStorage);
console.log(data);
// Copy and save this data
```

After updating:

```javascript
// Import data back
localStorage.clear();
// Paste your data
const savedData = {...}; // your copied data
for (let key in savedData) {
    localStorage.setItem(key, savedData[key]);
}
```

---

## ✅ Verification

### Check Installation

1. ✅ Can open index.html
2. ✅ All pages load correctly
3. ✅ No console errors
4. ✅ Can register account
5. ✅ Can login
6. ✅ Can report items
7. ✅ Can search items
8. ✅ Responsive on mobile

### Performance Check

- Page load time < 2 seconds
- No JavaScript errors
- Images load properly
- Forms submit correctly
- Smooth animations

---

## 📚 Next Steps

After installation:

1. Read [User Guide](docs/USER_GUIDE.md) (if available)
2. Watch tutorial videos (if available)
3. Join community discussions
4. Report bugs or suggest features
5. Consider contributing

---

## 🆘 Support

Need help?

- **Documentation**: Check all README files
- **Issues**: [GitHub Issues](https://github.com/yourusername/cuet-lost-found-box/issues)
- **Email**: support@cuet-lost-found.com
- **Community**: Join our Discord (coming soon)

---

<div align="center">
  <p><strong>Happy coding! 🚀</strong></p>
  <p>If you found this guide helpful, please star the repository! ⭐</p>
</div>
