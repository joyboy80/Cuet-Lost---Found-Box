# CUET Lost & Found Box - Frontend

A modern, responsive, and colorful web-based Lost and Found Management System built with HTML, CSS, and Vanilla JavaScript.

## 📋 Project Overview

This is a smart lost and found management system designed for CUET (Chittagong University of Engineering & Technology) to help students and staff report and find lost items efficiently.

## ✨ Features

### 🏠 Home Page
- Eye-catching hero section with gradient background
- Clear Call-to-Action buttons for reporting items
- Features showcase section
- Statistics display
- Recent items grid
- Fully responsive design

### 📋 Report Lost Item
- Comprehensive form with validation
- Fields: item name, category, description, date/time, location, contact info
- Optional image upload with preview
- Real-time form validation
- Success confirmation modal

### ✅ Report Found Item
- Similar form structure to lost items
- Required image upload
- Storage location field
- Form validation and submission

### 🔍 Search & Filter
- Powerful search functionality
- Multiple filters:
  - Status (All/Lost/Found)
  - Category
  - Date range
  - Location
- Grid/List view toggle
- Item detail modal
- Real-time filtering

### ⚙️ Admin Panel
- Dashboard with statistics
- Three tabs: Pending, Approved, Rejected
- Review and approve/reject items
- Item detail view
- Search and filter functionality
- Rejection reason tracking

## 🎨 Design Features

- **Colorful & Modern**: Uses vibrant gradients and soft color palettes
- **Eye-Soothing**: Carefully chosen colors for readability and comfort
- **Responsive**: Works perfectly on desktop, tablet, and mobile devices
- **Smooth Animations**: Fade-in, slide-up, and hover effects
- **Card-Based Layout**: Clean, organized information display
- **Shadow Effects**: Depth and visual hierarchy
- **Rounded Corners**: Modern, friendly appearance

## 📁 Project Structure

```
Frontend/
├── index.html              # Home page
├── report-lost.html        # Report lost item page
├── report-found.html       # Report found item page
├── search.html             # Search and filter page
├── admin.html              # Admin panel
├── css/
│   └── style.css          # Main stylesheet (all styles)
├── js/
│   ├── main.js            # Common functionality
│   ├── report.js          # Form validation and submission
│   ├── search.js          # Search and filter logic
│   └── admin.js           # Admin panel functionality
└── README.md              # This file
```

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local web server (optional but recommended)

### Installation

1. **Clone or download the project**
   ```bash
   cd "CUET LOST & FOUND BOX/Frontend"
   ```

2. **Open with a web server**
   
   **Option 1: Using Python**
   ```bash
   # Python 3
   python -m http.server 8000
   ```
   Then open `http://localhost:8000` in your browser

   **Option 2: Using Node.js (http-server)**
   ```bash
   npx http-server -p 8000
   ```
   Then open `http://localhost:8000` in your browser

   **Option 3: Using VS Code**
   - Install "Live Server" extension
   - Right-click on `index.html`
   - Select "Open with Live Server"

3. **Or simply open the HTML file**
   - Double-click `index.html` to open in your default browser
   - Note: Some features may work better with a local server

## 💡 Usage Guide

### For Users

1. **Report a Lost Item**
   - Click "Report Lost Item" on the home page
   - Fill in all required fields (marked with *)
   - Optionally upload an image
   - Submit the form
   - Wait for admin approval

2. **Report a Found Item**
   - Click "Report Found Item" on the home page
   - Fill in the form with item details
   - Upload a clear image (required)
   - Specify where the item is currently stored
   - Submit for admin review

3. **Search for Items**
   - Click "Search Items" in navigation
   - Use the search bar for keywords
   - Apply filters (category, date, location)
   - Click on any item card for details
   - Request contact information if you find a match

### For Admins

1. **Access Admin Panel**
   - Navigate to the Admin page
   - View dashboard statistics

2. **Review Pending Items**
   - Click "Pending Reviews" tab
   - View item details
   - Approve or reject items
   - Provide rejection reason if needed

3. **Manage Items**
   - Search and filter items
   - View approved/rejected items
   - Delete items if necessary

## 🎯 JavaScript Functionality

### Form Validation
- Real-time field validation
- Email format validation
- Phone number validation
- Date validation (no future dates)
- Required field checking
- Minimum length validation
- Error message display

### Search & Filter
- Keyword search across multiple fields
- Category filtering
- Date range filtering
- Location filtering
- Real-time results update
- Debounced search for performance

### Data Storage
- Uses browser localStorage for demo purposes
- Mock data for testing
- Easy to connect to backend API

### Interactive Features
- Modal dialogs for item details
- Image upload with preview
- Form reset functionality
- Success/error message toasts
- Smooth animations and transitions

## 🔧 Customization

### Colors
Edit the CSS variables in `css/style.css`:
```css
:root {
    --primary-color: #6366f1;
    --secondary-color: #10b981;
    --accent-color: #f59e0b;
    /* ... more colors */
}
```

### Mock Data
Edit the `mockItems` array in `js/main.js` to change demo items.

### Categories
Update category options in all HTML forms and JavaScript files.

## 🌐 Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📱 Responsive Breakpoints

- Desktop: 1024px and above
- Tablet: 768px - 1023px
- Mobile: Below 768px

## 🔜 Future Backend Integration

The frontend is structured to easily connect with a backend:

### API Endpoints (to be implemented)
```
POST   /api/items/lost         - Submit lost item
POST   /api/items/found        - Submit found item
GET    /api/items              - Get all items (with filters)
GET    /api/items/:id          - Get single item
PUT    /api/items/:id/approve  - Approve item (admin)
PUT    /api/items/:id/reject   - Reject item (admin)
DELETE /api/items/:id          - Delete item (admin)
```

### Data Format
Items are stored with this structure:
```javascript
{
    id: Number,
    type: 'lost' | 'found',
    name: String,
    category: String,
    description: String,
    location: String,
    date: String (ISO format),
    contactName: String,
    email: String,
    phone: String,
    studentId: String (optional),
    image: String (URL or base64),
    status: 'pending' | 'approved' | 'rejected',
    submittedAt: String (ISO format),
    rejectionReason: String (optional)
}
```

## 🎨 Design Credits

- Color palettes inspired by modern UI trends
- Gradient combinations for visual appeal
- Icon emojis for quick recognition
- Clean, minimal design principles

## 📄 License

This project is created for educational purposes.

## 👥 Authors

Developed for CUET Lost & Found Box Project

## 🙏 Acknowledgments

- Modern web design principles
- Responsive design best practices
- Vanilla JavaScript patterns
- CSS Grid and Flexbox layouts

---

**Note**: This is a frontend-only implementation. For production use, integrate with a backend API (Django, FastAPI, Node.js, etc.) for data persistence, user authentication, and email notifications.
