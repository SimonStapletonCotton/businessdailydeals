import { db } from './db';
import { deals, users } from '../shared/schema';
import { eq } from 'drizzle-orm';

// Production database sync - transfer all development data to production
export async function syncProductionDatabase() {
  console.log('🔄 Starting production database sync...');
  
  try {
    // Get all active deals from development database
    const developmentDeals = await db.select().from(deals).where(eq(deals.dealStatus, 'active'));
    const developmentUsers = await db.select().from(users);
    
    console.log(`📊 Found ${developmentDeals.length} deals and ${developmentUsers.length} users to sync`);
    
    return {
      deals: developmentDeals,
      users: developmentUsers,
      success: true
    };
  } catch (error) {
    console.error('❌ Production sync failed:', error);
    return {
      deals: [],
      users: [],
      success: false,
      error: error.message
    };
  }
}

// Complete production database population
export const PRODUCTION_SYNC_DATA = {
  users: [
    {
      id: "46102542",
      email: "simons@cybersmart.co.za",
      firstName: "Simon",
      lastName: "S-C",
      profileImageUrl: null,
      userType: "supplier",
      mobile: null,
      province: null,
      companyName: null,
      representativeName: null,
      emailNotifications: true,
      smsNotifications: false,
      whatsappNotifications: false,
      address: null,
      vatNumber: null,
      businessRegistrationNumber: null,
      isVerified: false,
      creditBalance: "0.00",
      createdAt: new Date("2025-08-07T16:06:12.672Z"),
      updatedAt: new Date()
    }
  ],
  deals: [
    // HOT DEALS (6 total)
    {
      id: "6cbd7a6a-e4ab-496b-a365-6fd2883b8e53",
      supplierId: "46102542",
      title: "DAM LINERS",
      description: "Dam liners for bulk water storage - can be made up in the factory up to generally around 250sqm, or if larger we come to site and install with our experienced team, at any destination world wide",
      price: "140.00",
      originalPrice: "180.00",
      dealType: "hot",
      category: "Mining",
      keywords: [],
      imageUrl: "/public-objects/product-images/6y9M7PQvU4JNi6f8A39ra.jpg",
      expiryDate: null,
      dealStatus: "active",
      viewCount: 18,
      inquiryCount: 0,
      creditsCost: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "6339f45d-aeb9-4bcc-a0da-c7cfe0938c4f", 
      supplierId: "46102542",
      title: "Vitamin C",
      description: "High quality vitamin C supplements for health and wellness",
      price: "50.00",
      originalPrice: "70.00",
      dealType: "hot",
      category: "Health", 
      keywords: [],
      imageUrl: "/public-objects/product-images/Tg7hPOh3CxbWQt8rzmY1N.jpg",
      expiryDate: null,
      dealStatus: "active",
      viewCount: 5,
      inquiryCount: 0,
      creditsCost: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "water-bladder-deal-2025",
      supplierId: "46102542", 
      title: "Industrial Water Bladders - Bulk Storage",
      description: "Industrial grade water bladders for bulk storage solutions",
      price: "2500.00",
      originalPrice: "3200.00",
      dealType: "hot",
      category: "Industrial",
      keywords: [],
      imageUrl: "/public-objects/product-images/NNxGFI1n-VBRJ5vpPqqKV.JPG",
      expiryDate: null,
      dealStatus: "active",
      viewCount: 20,
      inquiryCount: 0,
      creditsCost: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "hot-deal-1",
      supplierId: "46102542",
      title: "DAM LINERS - Premium Quality", 
      description: "Professional dam liners for bulk water storage with worldwide installation service",
      price: "140.00",
      originalPrice: "180.00",
      dealType: "hot",
      category: "Mining",
      keywords: [],
      imageUrl: "/public-objects/product-images/OjuD4ef-pGlmFVsGktiuC.JPG",
      expiryDate: null,
      dealStatus: "active",
      viewCount: 15,
      inquiryCount: 0,
      creditsCost: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "hot-deal-2",
      supplierId: "46102542",
      title: "Vitamin C Supplements",
      description: "High quality vitamin C supplements for health and wellness",
      price: "45.00", 
      originalPrice: "55.00",
      dealType: "hot",
      category: "Health",
      keywords: [],
      imageUrl: "/public-objects/product-images/Tg7hPOh3CxbWQt8rzmY1N.jpg",
      expiryDate: null,
      dealStatus: "active",
      viewCount: 8,
      inquiryCount: 0,
      creditsCost: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "hot-deal-3",
      supplierId: "46102542",
      title: "Industrial Water Bladders",
      description: "Industrial grade water bladders for bulk storage solutions",
      price: "85.00",
      originalPrice: "120.00", 
      dealType: "hot",
      category: "Industrial",
      keywords: [],
      imageUrl: "/public-objects/product-images/NNxGFI1n-VBRJ5vpPqqKV.JPG",
      expiryDate: null,
      dealStatus: "active",
      viewCount: 12,
      inquiryCount: 0,
      creditsCost: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    // REGULAR DEALS (7 total)
    {
      id: "3e40da35-4c45-4a62-983c-b83fd14173f6",
      supplierId: "46102542",
      title: "Bladders",
      description: "Standard water storage bladders for various applications",
      price: "850.00",
      originalPrice: "1000.00",
      dealType: "regular", 
      category: "Industrial",
      keywords: [],
      imageUrl: "/public-objects/product-images/OjuD4ef-pGlmFVsGktiuC.JPG",
      expiryDate: null,
      dealStatus: "active",
      viewCount: 9,
      inquiryCount: 0,
      creditsCost: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "88ca304b-5c45-4a07-a9c4-541efcb431b4",
      supplierId: "46102542",
      title: "Dam liners",
      description: "Made to fit in our factory with custom specifications",
      price: "200.00",
      originalPrice: "235.00",
      dealType: "regular",
      category: "Mining",
      keywords: [],
      imageUrl: "/public-objects/product-images/OjuD4ef-pGlmFVsGktiuC.JPG",
      expiryDate: null,
      dealStatus: "active",
      viewCount: 14,
      inquiryCount: 0,
      creditsCost: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "regular-deal-1",
      supplierId: "46102542",
      title: "Premium Business Cards",
      description: "Professional business cards with premium printing quality",
      price: "25.00",
      originalPrice: "35.00",
      dealType: "regular",
      category: "Printing",
      keywords: [],
      imageUrl: "/public-objects/product-images/business-cards.jpg",
      expiryDate: null,
      dealStatus: "active", 
      viewCount: 12,
      inquiryCount: 0,
      creditsCost: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "regular-deal-2",
      supplierId: "46102542",
      title: "Office Supplies Bundle",
      description: "Complete office supplies package for businesses",
      price: "120.00",
      originalPrice: "160.00",
      dealType: "regular",
      category: "Office",
      keywords: [],
      imageUrl: "/public-objects/product-images/office-supplies.jpg",
      expiryDate: null,
      dealStatus: "active",
      viewCount: 7,
      inquiryCount: 0,
      creditsCost: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]
};