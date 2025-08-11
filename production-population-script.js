// Direct production population script
const productionUrl = "https://deal-stream-simons27.replit.app";

const productionData = {
  user: {
    id: "46102542",
    email: "simons@cybersmart.co.za",
    firstName: "Simon", 
    lastName: "S-C",
    userType: "supplier",
    creditBalance: "0.00"
  },
  deals: [
    // HOT DEALS
    {
      id: "6cbd7a6a-e4ab-496b-a365-6fd2883b8e53",
      supplierId: "46102542",
      title: "DAM LINERS",
      description: "Dam liners for bulk water storage - can be made up in the factory up to generally around 250sqm, or if larger we come to site and install with our experienced team, at any destination world wide",
      price: "140.00",
      originalPrice: "180.00",
      dealType: "hot",
      category: "Mining",
      imageUrl: "/public-objects/product-images/6y9M7PQvU4JNi6f8A39ra.jpg",
      dealStatus: "active",
      viewCount: 18,
      inquiryCount: 0,
      creditsCost: 5
    },
    {
      id: "6339f45d-aeb9-4bcc-a0da-c7cfe0938c4f",
      supplierId: "46102542", 
      title: "Vitamin C",
      description: "Gut friendly, potent and PH neutral",
      price: "222.00",
      originalPrice: "285.00",
      dealType: "hot",
      category: "Healthcare & Medical",
      imageUrl: "/public-objects/product-images/Tg7hPOh3CxbWQt8rzmY1N.jpg",
      dealStatus: "active",
      viewCount: 5,
      inquiryCount: 0,
      creditsCost: 3
    },
    {
      id: "water-bladder-deal-2025",
      supplierId: "46102542",
      title: "Industrial Water Bladders - Bulk Storage", 
      description: "High-quality industrial water storage bladders. Perfect for construction sites, farming operations, and emergency water storage. Various sizes available from 2000L to 500000L capacity. Durable PVC construction with UV protection.",
      price: "850.00",
      originalPrice: "1200.00",
      dealType: "hot",
      category: "Industrial Equipment",
      imageUrl: "/public-objects/product-images/NNxGFI1n-VBRJ5vpPqqKV.JPG",
      dealStatus: "active",
      viewCount: 20,
      inquiryCount: 0,
      creditsCost: 4
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
      dealStatus: "active",
      viewCount: 15,
      inquiryCount: 0,
      creditsCost: 5
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
      dealStatus: "active",
      viewCount: 8,
      inquiryCount: 0,
      creditsCost: 3
    },
    // REGULAR DEALS
    {
      id: "3e40da35-4c45-4a62-983c-b83fd14173f6",
      supplierId: "46102542",
      title: "Bladders",
      description: "500 000L capacity for all of those farm and irrigation back up requirements",
      price: "136000.00",
      originalPrice: "145000.00",
      dealType: "regular",
      category: "Agriculture & Farming", 
      imageUrl: "/public-objects/product-images/OjuD4ef-pGlmFVsGktiuC.JPG",
      dealStatus: "active",
      viewCount: 9,
      inquiryCount: 0,
      creditsCost: 3
    },
    {
      id: "88ca304b-5c45-4a07-a9c4-541efcb431b4",
      supplierId: "46102542",
      title: "Dam liners", 
      description: "Made to fit in our factory",
      price: "200.00",
      originalPrice: "235.00",
      dealType: "regular",
      category: "Other",
      imageUrl: "/public-objects/product-images/OjuD4ef-pGlmFVsGktiuC.JPG",
      dealStatus: "active",
      viewCount: 14,
      inquiryCount: 0,
      creditsCost: 4
    }
  ]
};

console.log("Starting production population...");
console.log(`Deals to create: ${productionData.deals.length}`);
console.log(`HOT deals: ${productionData.deals.filter(d => d.dealType === 'hot').length}`);
console.log(`REGULAR deals: ${productionData.deals.filter(d => d.dealType === 'regular').length}`);