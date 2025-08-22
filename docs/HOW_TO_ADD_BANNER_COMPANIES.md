# How to Add More Companies to Banner Ads

## Quick Steps:

1. **Open the banner ads file:**
   - Navigate to: `client/src/components/banner-ads.tsx`
   - Look for the `sampleAds` array (around line 29)

2. **Copy the template:**
   - Use the commented template in the file
   - Remove the `/*` and `*/` comment markers
   - Add a comma after the previous company entry

3. **Fill in your company details:**
   ```javascript
   ,{
     id: "2",  // Use next number (2, 3, 4, etc.)
     title: "Your Company Main Service Title",
     description: "Description of your products/services. What makes your company special?",
     companyName: "Your Company Name",
     imageUrl: "https://images.unsplash.com/photo-XXXXXXXXX?w=400&h=200&fit=crop&crop=center",
     linkUrl: "https://www.yourcompanywebsite.co.za",
     category: "Your Industry Category",
     contactPhone: "Your Phone Number",
     contactEmail: "Your Email (optional)"
   }
   ```

## Finding Images:
- Go to [Unsplash.com](https://unsplash.com)
- Search for relevant business images
- Copy the photo URL in this format: `https://images.unsplash.com/photo-XXXXXXXXX?w=400&h=200&fit=crop&crop=center`

## Example of Adding a New Company:
```javascript
const sampleAds: BannerAd[] = [
  {
    id: "1",
    title: "Industrial Water Storage Solutions - Water Bladders",
    description: "High-capacity flexible water bladders for industrial, agricultural, and emergency water storage. www.waterbladders.co.za",
    companyName: "Water Bladders SA",
    imageUrl: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=200&fit=crop&crop=center",
    linkUrl: "https://www.waterbladders.co.za",
    category: "Water Storage",
    contactPhone: "082 495 7997"
  },
  {
    id: "2",
    title: "Professional Office Furniture & Equipment",
    description: "High-quality office furniture, ergonomic chairs, and modern workspace solutions for South African businesses.",
    companyName: "SA Office Solutions",
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=200&fit=crop&crop=center",
    linkUrl: "https://www.saoffice.co.za",
    category: "Office Equipment",
    contactPhone: "011 123 4567",
    contactEmail: "sales@saoffice.co.za"
  }
];
```

## Important Notes:
- Each company must have a unique `id` number
- The banner ads will automatically rotate between all companies
- Users can manually navigate between ads using the arrow buttons
- Don't forget the comma before each new company entry
- Save the file and the changes will appear immediately on the website

## Current Status:
- **Active Companies:** 1 (Water Bladders SA)
- **Available Slots:** 4 more companies can be easily added
- **File Location:** `client/src/components/banner-ads.tsx`