# Frequently Asked Questions (FAQ)

Common questions and answers about CUET Lost & Found Box.

## 📋 Table of Contents

- [General Questions](#general-questions)
- [User Questions](#user-questions)
- [Technical Questions](#technical-questions)
- [Admin Questions](#admin-questions)
- [Security & Privacy](#security--privacy)
- [Troubleshooting](#troubleshooting)

---

## 🌟 General Questions

### What is CUET Lost & Found Box?

CUET Lost & Found Box is a web-based platform designed to help students and staff at Chittagong University of Engineering & Technology (CUET) report, search, and recover lost items. It centralizes all lost and found reports in one easy-to-use system.

### Is it free to use?

Yes, CUET Lost & Found Box is completely free for all students and staff.

### Do I need to register to use the platform?

- **Browsing**: No registration needed to view the home page
- **Searching**: Registration required
- **Reporting Items**: Registration required
- **Admin Functions**: Special admin account needed

### Which browsers are supported?

We support all modern browsers:
- ✅ Chrome (90+)
- ✅ Firefox (88+)
- ✅ Safari (14+)
- ✅ Edge (90+)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

### Is there a mobile app?

Currently, there's no dedicated mobile app, but the website is fully responsive and works great on mobile browsers. A mobile app is planned for future releases.

---

## 👥 User Questions

### How do I report a lost item?

1. Register and login to your account
2. Click "Report Lost" in the navigation menu
3. Fill in the form with item details:
   - Item name and category
   - Description
   - Date and location where lost
   - Your contact information
4. Optionally upload an image
5. Submit the form
6. Wait for admin approval

### How do I report a found item?

1. Login to your account
2. Click "Report Found"
3. Fill in the form with:
   - Item details
   - Where you found it
   - Current storage location
   - Upload a clear image (required)
4. Submit for admin review
5. Wait for approval

### What happens after I submit a report?

1. Your report goes to "Pending" status
2. An admin reviews your submission
3. If approved, it appears in the public feed
4. If rejected, you'll see the rejection reason in your dashboard
5. You'll be able to edit and resubmit

### How long does admin approval take?

Typically within 24-48 hours during weekdays. During holidays or weekends, it might take longer.

### Can I edit my report after submission?

Yes! Go to your dashboard and click "Edit" on any of your reports. However, if it's already approved, major changes might require re-approval.

### Can I delete my report?

Yes, you can delete your reports from your dashboard at any time.

### How do I search for my lost item?

1. Go to "Search Items" page
2. Use the search bar to enter keywords
3. Apply filters:
   - Category (e.g., Electronics, Books)
   - Date range
   - Location
   - Status (Lost/Found)
4. Browse through results
5. Click on items for more details

### I found a match! How do I contact the person?

Click on the item card to view full details. Contact information (email/phone) will be displayed for approved items. Reach out to the person directly to arrange item return.

### What if someone claims my found item?

When someone contacts you about a found item:
1. Ask them to describe the item in detail
2. Verify their identity (student/staff ID)
3. Check for any unique characteristics
4. Arrange a safe meeting place (campus security office recommended)
5. Update the item status in your dashboard

### Can I report multiple items?

Yes! You can report as many lost or found items as needed. Each item should be reported separately.

---

## 💻 Technical Questions

### Why isn't the site loading?

**Try these solutions:**
1. Check your internet connection
2. Clear browser cache (Ctrl+Shift+Delete)
3. Try a different browser
4. Disable browser extensions
5. Check if JavaScript is enabled

### Where is my data stored?

Currently (v1.0), data is stored in your browser's LocalStorage. This is temporary for the demo version. Future versions will use a secure backend database.

### Will my data be lost if I clear my browser?

Yes, currently data is stored locally in your browser. Clearing browser data or using a different browser/device will not show your previous data. Backend implementation in v2.0 will solve this.

### Can I access my account from different devices?

In the current version (v1.0), accounts are browser-specific. Version 2.0 will introduce proper backend authentication allowing access from any device.

### How do I export my data?

Currently, you can manually copy your reports. Future versions will have an export feature.

### Is the platform open source?

Yes! The code is available on GitHub. Contributions are welcome! See [CONTRIBUTING.md](../CONTRIBUTING.md) for details.

---

## 🔧 Admin Questions

### How do I become an admin?

Contact the super admin or project maintainers. Admin accounts are assigned to trusted individuals (campus security, student affairs, etc.).

### What can admins do?

Admins can:
- ✅ Review pending item reports
- ✅ Approve or reject submissions
- ✅ Provide rejection reasons
- ✅ View all items in the system
- ✅ Delete inappropriate content
- ✅ Search and filter all reports

### What can super admins do?

Super admins have additional powers:
- ✅ All admin capabilities
- ✅ Manage user accounts
- ✅ Promote/demote admins
- ✅ Suspend or delete accounts
- ✅ View system statistics
- ✅ Access system settings

### How do I review pending items?

1. Login with admin credentials
2. Go to Admin Panel
3. Click "Pending Reviews" tab
4. Click on each item to view details
5. Click "Approve" or "Reject"
6. If rejecting, provide a clear reason

### What should I look for when reviewing items?

Check for:
- ✅ Complete and accurate information
- ✅ Appropriate images (no offensive content)
- ✅ Realistic descriptions
- ✅ Proper category selection
- ❌ Spam or duplicate entries
- ❌ Inappropriate or offensive content
- ❌ Obviously false information

### Can I edit user-submitted items?

Not directly in v1.0. You can reject with feedback asking the user to make changes. Future versions may allow admin editing.

---

## 🔒 Security & Privacy

### Is my personal information safe?

We take privacy seriously:
- ✅ Personal info only shown to verified users
- ✅ Email and phone optional for reports
- ✅ Passwords are secured (in future backend)
- ✅ No data sharing with third parties
- ✅ Follow data protection best practices

### Who can see my contact information?

- Your email/phone is only visible to logged-in users viewing your approved reports
- Admins can see all information during review
- Non-registered visitors cannot see contact details

### Can I report items anonymously?

No, you must be registered and logged in. This helps prevent spam and ensures accountability.

### What information is required to register?

- Full name
- Valid email address
- Password
- Student/Staff ID (optional but recommended)
- Department (optional)

### How is my password stored?

In v1.0, it's stored in browser LocalStorage (demo only). In v2.0 with backend:
- Passwords will be hashed using bcrypt
- Never stored in plain text
- Secure authentication via JWT tokens

### What if I forget my password?

In the current version, you'll need to create a new account. Version 2.0 will have password recovery via email.

### Can I delete my account?

Yes, contact an admin or use the account deletion option (coming in v2.0).

---

## 🔍 Troubleshooting

### Forms not submitting

**Possible causes:**
1. Required fields not filled
2. Invalid email format
3. Invalid phone number format
4. Date in the future
5. JavaScript error

**Solutions:**
- Check all required fields (marked with *)
- Use proper email format (example@domain.com)
- Use proper phone format
- Select a past date for lost items
- Check browser console for errors (F12)

### Images not uploading

**Solutions:**
1. Check file size (max 5MB recommended)
2. Use supported formats (JPEG, PNG, GIF)
3. Clear browser cache
4. Try a different browser
5. Compress large images

### Search not working

**Solutions:**
1. Clear all filters and try again
2. Try different keywords
3. Clear browser cache
4. Refresh the page
5. Check for JavaScript errors

### Can't login

**Solutions:**
1. Verify email and password
2. Check if Caps Lock is on
3. Clear browser cache
4. Try different browser
5. Re-register if needed (v1.0)

### Page looks broken

**Solutions:**
1. Clear browser cache
2. Hard refresh (Ctrl+Shift+R)
3. Check internet connection
4. Try different browser
5. Disable browser extensions

### Items not appearing in search

**Possible reasons:**
1. Item still pending approval
2. Item was rejected
3. Filters too restrictive
4. Item was deleted
5. LocalStorage cleared

**Solutions:**
- Check your dashboard for item status
- Remove all filters
- Try broader search terms

---

## 📱 Mobile Issues

### Site not responsive on mobile

**Solutions:**
1. Update your mobile browser
2. Clear browser cache on mobile
3. Try different mobile browser
4. Rotate device to landscape mode
5. Report the issue on GitHub

### Images too large on mobile

This is a known issue in v1.0. Workarounds:
- Compress images before upload
- Use landscape orientation
- Will be fixed in future updates

---

## 🚀 Feature Requests

### How do I request a new feature?

1. Check [GitHub Issues](https://github.com/yourusername/cuet-lost-found-box/issues)
2. Search if feature already requested
3. If not, open a new issue with "Feature Request" label
4. Describe the feature and why it's useful

### When will feature X be available?

Check the [CHANGELOG.md](../CHANGELOG.md) and project roadmap for upcoming features. Common requests:

- **Backend Integration**: v2.0 (Q2 2026)
- **Real-time Chat**: v2.1 (Q3 2026)
- **Mobile App**: v3.0 (Q4 2026)
- **Email Notifications**: v2.0 (Q2 2026)

---

## 💡 Best Practices

### Tips for reporting lost items

1. ✅ Be as detailed as possible
2. ✅ Include unique identifiers (serial numbers, marks)
3. ✅ Upload clear photos
4. ✅ Specify exact location and time
5. ✅ Check regularly for matches
6. ✅ Respond quickly to potential matches

### Tips for reporting found items

1. ✅ Take clear, well-lit photos
2. ✅ Describe exactly where you found it
3. ✅ Specify current storage location
4. ✅ Don't include sensitive information from the item
5. ✅ Respond to inquiries promptly
6. ✅ Verify claimant's identity

### Tips for successful recovery

1. ✅ Report lost items immediately
2. ✅ Search regularly
3. ✅ Use multiple search terms
4. ✅ Be patient with admin approval
5. ✅ Provide accurate contact information
6. ✅ Meet in safe, public locations

---

## 📞 Still Need Help?

If your question isn't answered here:

1. **Check Documentation**
   - [README.md](../README.md)
   - [Installation Guide](INSTALLATION.md)
   - [Contributing Guide](../CONTRIBUTING.md)

2. **Search GitHub Issues**
   - [Existing Issues](https://github.com/yourusername/cuet-lost-found-box/issues)

3. **Contact Us**
   - Email: support@cuet-lost-found.com
   - GitHub: Open a new issue
   - Campus: Visit the IT Help Desk

4. **Community**
   - Join our Discord (coming soon)
   - Forum discussions (coming soon)

---

<div align="center">
  <p><strong>Have a question not listed here?</strong></p>
  <p>Open an issue on GitHub or email us!</p>
</div>

---

*Last Updated: February 8, 2026*
