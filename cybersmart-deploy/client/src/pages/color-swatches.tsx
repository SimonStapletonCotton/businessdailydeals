import Navbar from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ColorSwatches() {
  const colorOptions = [
    {
      name: "Current Sage Green",
      gradient: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 30%, #6ee7b7 60%, #ecfdf5 80%, #f0fdf4 90%, #f7fee7 100%)",
      description: "Professional, trustworthy, growth-oriented"
    },
    {
      name: "Corporate Navy Blue",
      gradient: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 30%, #3b82f6 60%, #e0e7ff 80%, #f1f5f9 90%, #f8fafc 100%)",
      description: "Traditional, reliable, corporate"
    },
    {
      name: "Sophisticated Charcoal",
      gradient: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 30%, #64748b 60%, #f8fafc 80%, #ffffff 90%, #f9fafb 100%)",
      description: "Modern, minimalist, premium"
    },
    {
      name: "Deep Teal",
      gradient: "linear-gradient(135deg, #ccfbf1 0%, #99f6e4 30%, #2dd4bf 60%, #f0fdfa 80%, #f7fffe 90%, #ffffff 100%)",
      description: "Fresh, innovative, confident"
    },
    {
      name: "Warm Burgundy",
      gradient: "linear-gradient(135deg, #fecaca 0%, #fca5a5 30%, #dc2626 60%, #fef2f2 80%, #fffbfb 90%, #ffffff 100%)",
      description: "Premium, sophisticated, powerful"
    },
    {
      name: "Soft Lavender",
      gradient: "linear-gradient(135deg, #e9d5ff 0%, #ddd6fe 30%, #a78bfa 60%, #f3e8ff 80%, #faf5ff 90%, #fefbff 100%)",
      description: "Creative, calming, modern"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">
            Color Theme Options
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Choose the perfect background theme for your Business Daily Deals homepage
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {colorOptions.map((option, index) => (
            <Card key={index} className="border-0 shadow-xl overflow-hidden">
              <div 
                className="h-32 relative"
                style={{ background: option.gradient }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/80 px-4 py-2 rounded-lg">
                    <h3 className="font-bold text-slate-800">{option.name}</h3>
                  </div>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-lg text-slate-800">
                  {option.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4">
                  {option.description}
                </p>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(option.gradient);
                    alert(`${option.name} gradient copied to clipboard!`);
                  }}
                >
                  Copy CSS
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-slate-800 mb-4">
                How to Choose
              </h3>
              <div className="grid md:grid-cols-3 gap-6 text-left">
                <div>
                  <h4 className="font-semibold text-slate-700 mb-2">Conservative B2B</h4>
                  <p className="text-sm text-slate-600">Navy Blue, Charcoal for traditional business appeal</p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-700 mb-2">Modern & Fresh</h4>
                  <p className="text-sm text-slate-600">Sage Green, Teal for innovative companies</p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-700 mb-2">Premium Market</h4>
                  <p className="text-sm text-slate-600">Burgundy, Lavender for luxury positioning</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}