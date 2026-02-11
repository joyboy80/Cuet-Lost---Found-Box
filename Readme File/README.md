# 🎯 CUET Lost & Found Box

<div align="center">
  <img src="Frontend/resources/cuetlogo.png" alt="CUET Logo" width="120" height="120">
  <h3>A Smart Web-Based Lost and Found Management System</h3>
  <p>Designed for Chittagong University of Engineering & Technology (CUET)</p>
  
  ![Status](https://img.shields.io/badge/status-active-success.svg)
  ![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
  ![License](https://img.shields.io/badge/license-MIT-green.svg)
</div>

---

## 📖 Table of Contents

- [About](#about)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## 🎓 About

**CUET Lost & Found Box** is a comprehensive web-based platform that streamlines the process of reporting, searching, and recovering lost items within the campus community. Built with modern web technologies, it provides an intuitive interface for students, staff, and administrators to efficiently manage lost and found items.

### Problem Statement
- Students and staff frequently lose personal belongings on campus
- No centralized system to report or search for lost items
- Manual processes are time-consuming and inefficient
- Low recovery rates due to poor communication channels

### Solution
A digital platform that:
- ✅ Centralizes all lost and found reports
- ✅ Enables easy searching and filtering
- ✅ Facilitates quick communication between finders and owners
- ✅ Provides admin oversight and verification
- ✅ Tracks statistics and patterns

---

## ✨ Features

### 👥 For Users

#### 📢 Report Lost Items
- Submit detailed reports of lost items
- Include categories, descriptions, and locations
- Optional image uploads
- Set date and time of loss
- Receive status updates

#### ✅ Report Found Items
- Report items you've found
- Upload clear images (required)
- Specify current storage location
- Provide contact information

#### 🔍 Advanced Search
- Search by keywords, categories, and locations
- Filter by date ranges
- Toggle between grid and list views
- View detailed item information
- Contact item reporters

#### 📊 User Dashboard
- View your reported items
- Track item status (pending/approved/rejected)
- Edit or delete your reports
- View match suggestions

### 🔧 For Administrators

#### 📋 Item Management
- Review pending submissions
- Approve or reject reports
- Provide rejection reasons
- Moderate content
- Search and filter all items

#### 👤 User Management (Super Admin)
- Manage user accounts
- Promote/demote administrators
- View user activity
- Suspend or delete accounts
- Monitor system usage

#### 📈 Analytics Dashboard
- View system statistics
- Track lost/found item trends
- Monitor resolution rates
- Generate reports

---

## 🛠️ Technology Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS Grid & Flexbox
- **Vanilla JavaScript** - No framework dependencies
- **LocalStorage** - Client-side data persistence (demo)

### Design Features
- 🎨 Gradient-based color schemes
- 📱 Fully responsive design
- ⚡ Smooth animations and transitions
- 🌓 Eye-soothing color palettes
- 🎯 Intuitive user interface

### Future Backend (Planned)
- **Django** / **FastAPI** - Backend framework
- **PostgreSQL** / **MySQL** - Database
- **JWT** - Authentication
- **AWS S3** / **Cloudinary** - Image storage
- **SendGrid** / **Mailgun** - Email notifications

---

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (optional but recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/cuet-lost-found-box.git
   cd cuet-lost-found-box
   ```

2. **Navigate to Frontend directory**
   ```bash
   cd Frontend
   ```

3. **Run with a local server**

   **Option 1: Using Python**
   ```bash
   # Python 3
   python -m http.server 8000
   ```
   Open `http://localhost:8000` in your browser

   **Option 2: Using Node.js**
   ```bash
   npx http-server -p 8000
   ```
   Open `http://localhost:8000` in your browser

   **Option 3: Using VS Code Live Server**
   - Install "Live Server" extension
   - Right-click `index.html`
   - Select "Open with Live Server"

4. **Or open directly**
   - Double-click `index.html`
   - Note: Some features work better with a local server

### Quick Start Guide

📄 See [QUICKSTART.html](Frontend/QUICKSTART.html) for a comprehensive guide with screenshots and step-by-step instructions.

---

## 📁 Project Structure

```
CUET-Lost-&-Found-Box/
│
├── Frontend/
│   ├── index.html                 # Home/Landing page
│   ├── login.html                 # User login
│   ├── register.html              # User registration
│   ├── feed.html                  # Community feed
│   ├── search.html                # Search & filter items
│   ├── report-lost.html           # Report lost item form
│   ├── report-found.html          # Report found item form
│   ├── user-dashboard.html        # User dashboard
│   ├── super-admin.html           # Super admin panel
│   ├── QUICKSTART.html            # Quick start guide
│   │
│   ├── css/
│   │   ├── style.css              # Main stylesheet (1500+ lines)
│   │   └── auth.css               # Authentication styles
│   │
│   ├── js/
│   │   ├── main.js                # Core functionality
│   │   ├── auth.js                # Authentication logic
│   │   ├── report.js              # Report form handling
│   │   ├── search.js              # Search & filter logic
│   │   ├── feed.js                # Feed functionality
│   │   ├── user-dashboard.js      # Dashboard logic
│   │   ├── super-admin.js         # Admin panel logic
│   │   └── admin.js               # Item management
│   │
│   ├── resources/
│   │   ├── cuetlogo.png           # CUET logo
│   │   ├── tamim.jpg              # Background image
│   │   └── Proposal_of_IP (1).pdf # Project proposal
│   │
│   └── README.md                  # Frontend documentation
│
├── README.md                      # This file
├── CONTRIBUTING.md                # Contribution guidelines
├── LICENSE                        # MIT License
└── CHANGELOG.md                   # Version history
```

---

## 💻 Usage

### For Students/Staff

1. **First Time**
   - Visit the website
   - Register for an account
   - Verify your email (when backend is integrated)

2. **Report a Lost Item**
   - Login to your account
   - Navigate to "Report Lost"
   - Fill in item details (name, category, location, date)
   - Upload an image (optional)
   - Submit for review

3. **Report a Found Item**
   - Login to your account
   - Navigate to "Report Found"
   - Fill in item details with storage location
   - Upload a clear image (required)
   - Submit for admin approval

4. **Search for Items**
   - Go to "Search Items"
   - Use filters (category, date, location)
   - Browse through results
   - Click items for more details
   - Contact the reporter if you find a match

### For Administrators

1. **Access Admin Panel**
   - Login with admin credentials
   - Navigate to admin section

2. **Review Submissions**
   - View pending reports
   - Verify item details and images
   - Approve valid submissions
   - Reject spam or invalid items with reasons

3. **Manage Content**
   - Search and filter all items
   - Edit item details if needed
   - Delete inappropriate content
   - Monitor system activity

### For Super Admins

1. **User Management**
   - View all registered users
   - Promote users to admin role
   - Suspend problematic accounts
   - Delete spam accounts

2. **System Overview**
   - Monitor platform statistics
   - Track user engagement
   - Generate reports

---

## 📸 Screenshots

### Home Page
![Home Page](docs/screenshots/home.png)
*Modern landing page with hero section and features*

### Search Interface
![Search Page](docs/screenshots/search.png)
*Powerful search with multiple filters*

### Report Form
![Report Form](docs/screenshots/report.png)
*Intuitive form with validation*

### Admin Dashboard
![Admin Panel](docs/screenshots/admin.png)
*Comprehensive admin interface*

> **Note:** Add actual screenshots in the `docs/screenshots/` directory

---

## 🚧 Future Enhancements

### Phase 1: Backend Integration
- [ ] REST API development (Django/FastAPI)
- [ ] Database setup (PostgreSQL)
- [ ] User authentication & authorization
- [ ] Image upload to cloud storage
- [ ] Email notifications

### Phase 2: Advanced Features
- [ ] Real-time chat between users
- [ ] Mobile app (React Native/Flutter)
- [ ] SMS notifications
- [ ] AI-powered image matching
- [ ] Multi-language support
- [ ] QR code generation for items

### Phase 3: Analytics
- [ ] Advanced analytics dashboard
- [ ] Machine learning for fraud detection
- [ ] Predictive analytics for lost item recovery
- [ ] Heatmap of lost item locations

### Phase 4: Integration
- [ ] Integration with campus security
- [ ] CCTV footage linking
- [ ] Campus map integration
- [ ] Student ID verification

---

## 🤝 Contributing

We welcome contributions from the community! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on:

- Code of Conduct
- Development process
- Pull request procedure
- Coding standards
- Testing requirements

### Quick Contribution Guide

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Authors & Contributors

- **Project Team** - *Initial work* - CUET Lost & Found Box Team
- See [CONTRIBUTORS.md](CONTRIBUTORS.md) for the list of contributors

---

## 🙏 Acknowledgments

- CUET Community for inspiration and feedback
- Modern web design principles and best practices
- Open-source community for tools and resources
- All contributors and testers

---

## 📞 Contact

**Project Lead:** [Your Name]
- Email: project@cuet.ac.bd
- GitHub: [@yourusername](https://github.com/yourusername)

**Institution:** Chittagong University of Engineering & Technology (CUET)
- Website: [https://www.cuet.ac.bd](https://www.cuet.ac.bd)

---

## 📈 Project Status

- **Current Version:** 1.0.0 (Frontend)
- **Status:** Active Development
- **Last Updated:** February 8, 2026

### Roadmap
- ✅ Frontend Design & Development
- ✅ UI/UX Implementation
- ✅ Form Validation
- ✅ Search & Filter Logic
- ⏳ Backend Development (In Progress)
- ⏳ Database Design
- ⏳ API Integration
- ⏳ Authentication System
- ⏳ Testing & Deployment

---

<div align="center">
  <p>Made with ❤️ for CUET Community</p>
  <p>© 2026 CUET Lost & Found Box. All rights reserved.</p>
</div>
