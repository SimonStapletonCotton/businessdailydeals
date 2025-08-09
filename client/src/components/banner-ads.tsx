import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface BannerAd {
  id: string;
  title: string;
  description: string;
  companyName: string;
  imageUrl: string;
  linkUrl: string;
  category: string;
  contactPhone?: string;
  contactEmail?: string;
}

interface BannerAdsProps {
  position: "header" | "sidebar" | "footer" | "content";
  className?: string;
}

// Sample banner ads data (replace with database data later)
const sampleAds: BannerAd[] = [
  {
    id: "1",
    title: "Premium IT Solutions for South African Businesses",
    description: "Transform your business with our cutting-edge technology solutions. Cloud services, cybersecurity, and 24/7 support.",
    companyName: "TechSolutions Pro",
    imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=200&fit=crop&crop=center",
    linkUrl: "https://techsolutions.co.za",
    category: "Technology",
    contactPhone: "011 234 5678",
    contactEmail: "info@techsolutions.co.za"
  },
  {
    id: "2", 
    title: "Industrial Equipment & Manufacturing Solutions",
    description: "Quality machinery, parts, and manufacturing equipment. Serving South African industry for over 20 years.",
    companyName: "SA Manufacturing Co",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=200&fit=crop&crop=center",
    linkUrl: "https://samanufacturing.co.za",
    category: "Manufacturing",
    contactPhone: "021 345 6789",
    contactEmail: "sales@samanufacturing.co.za"
  },
  {
    id: "3",
    title: "Nationwide Transport & Logistics Services",
    description: "Fast, reliable delivery across South Africa. From same-day courier to heavy freight solutions.",
    companyName: "Prime Logistics",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=200&fit=crop&crop=center",
    linkUrl: "https://primelogistics.co.za",
    category: "Logistics",
    contactPhone: "031 456 7890",
    contactEmail: "bookings@primelogistics.co.za"
  },
  {
    id: "4",
    title: "Industrial Water Storage Solutions - Water Bladders",
    description: "High-capacity flexible water bladders for industrial, agricultural, and emergency water storage. Custom sizes available.",
    companyName: "Water Bladders SA",
    imageUrl: "/src/assets/Omnia 1_1754727405700.JPG",
    linkUrl: "https://www.waterbladders.co.za",
    category: "Water Storage",
    contactPhone: "082 495 7997",
    contactEmail: "simon@waterbladders.co.za"
  },
  {
    id: "5",
    title: "Professional Business Consulting & Advisory",
    description: "Strategic business consulting, financial planning, and growth advisory services for South African enterprises.",
    companyName: "Cape Business Services",
    imageUrl: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=200&fit=crop&crop=center",
    linkUrl: "https://capebusiness.co.za",
    category: "Consulting",
    contactPhone: "021 678 9012",
    contactEmail: "consult@capebusiness.co.za"
  }
];

export function BannerAds({ position, className = "" }: BannerAdsProps) {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Filter ads by position if needed (for now showing all)
  const ads = sampleAds;

  // Auto-rotate ads every 6 seconds
  useEffect(() => {
    if (!isAutoPlaying || ads.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % ads.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [ads.length, isAutoPlaying]);

  const handleAdClick = (ad: BannerAd) => {
    // In future, record click analytics here
    window.open(ad.linkUrl, '_blank', 'noopener,noreferrer');
  };

  const nextAd = () => {
    setIsAutoPlaying(false);
    setCurrentAdIndex((prev) => (prev + 1) % ads.length);
    setTimeout(() => setIsAutoPlaying(true), 15000); // Resume auto-play after 15 seconds
  };

  const prevAd = () => {
    setIsAutoPlaying(false);
    setCurrentAdIndex((prev) => (prev - 1 + ads.length) % ads.length);
    setTimeout(() => setIsAutoPlaying(true), 15000);
  };

  if (ads.length === 0) {
    return null;
  }

  const currentAd = ads[currentAdIndex];

  return (
    <Card className={`${className} bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 border-blue-200 dark:border-slate-600 shadow-md hover:shadow-lg transition-shadow`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            Advertisement {currentAdIndex + 1} of {ads.length}
          </Badge>
          {ads.length > 1 && (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={prevAd}
                className="h-7 w-7 p-0 hover:bg-blue-100 dark:hover:bg-slate-600"
                data-testid="prev-ad-button"
                title="Previous ad"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={nextAd}
                className="h-7 w-7 p-0 hover:bg-blue-100 dark:hover:bg-slate-600"
                data-testid="next-ad-button"
                title="Next ad"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <div 
          className="cursor-pointer group"
          onClick={() => handleAdClick(currentAd)}
          data-testid={`banner-ad-${currentAd.id}`}
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <img
                src={currentAd.imageUrl}
                alt={`${currentAd.companyName} advertisement`}
                className="w-20 h-16 sm:w-24 sm:h-18 object-cover rounded-lg border border-blue-200 dark:border-slate-600 group-hover:scale-105 transition-transform duration-200"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/96x72/3b82f6/white?text=Ad';
                }}
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-sm sm:text-base">
                  {currentAd.companyName}
                </h4>
                <ExternalLink className="h-3 w-3 text-blue-500 group-hover:text-blue-600 transition-colors flex-shrink-0" />
              </div>
              
              <h5 className="font-medium text-xs sm:text-sm text-slate-800 dark:text-slate-200 mb-2 line-clamp-1">
                {currentAd.title}
              </h5>
              
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mb-2">
                {currentAd.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                {currentAd.contactPhone && (
                  <span className="flex items-center gap-1">📞 {currentAd.contactPhone}</span>
                )}
                {currentAd.contactEmail && (
                  <span className="flex items-center gap-1 truncate">✉️ {currentAd.contactEmail}</span>
                )}
                <Badge variant="outline" className="text-xs">
                  {currentAd.category}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {ads.length > 1 && (
          <div className="flex justify-center mt-4 gap-1">
            {ads.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentAdIndex(index);
                  setIsAutoPlaying(false);
                  setTimeout(() => setIsAutoPlaying(true), 15000);
                }}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentAdIndex
                    ? 'bg-blue-500'
                    : 'bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500'
                }`}
                data-testid={`ad-indicator-${index}`}
                title={`Show ad ${index + 1}`}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}