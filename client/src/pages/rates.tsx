import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShoppingCart, Calculator, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Exact rates from Excel file
const ratesData = {
  regular: [
    { duration: 1, items25: 40, items610: 15, items1120: 10 },
    { duration: 3, items25: 25, items610: 10, items1120: 6 },
    { duration: 7, items25: 12, items610: 6, items1120: 4 },
    { duration: 14, items25: 8, items610: 4, items1120: 3 },
    { duration: 21, items25: 7, items610: 3.5, items1120: 2 },
    { duration: 30, items25: 6, items610: 3, items1120: 2 }
  ],
  hot: [
    { duration: 1, items25: 90, items610: 55, items1120: null },
    { duration: 3, items25: 40, items610: 25, items1120: null },
    { duration: 7, items25: 25, items610: 15, items1120: null }
  ]
};

export default function Rates() {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [selectedPackage, setSelectedPackage] = useState<{
    type: 'regular' | 'hot';
    duration: number;
    items: string;
    rate: number;
    total: number;
  } | null>(null);

  const handleSelectPackage = (type: 'regular' | 'hot', duration: number, items: string, rate: number) => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to purchase advertising rates",
        variant: "destructive",
      });
      return;
    }

    if (user?.userType !== 'supplier') {
      toast({
        title: "Suppliers Only", 
        description: "Only suppliers can purchase advertising rates",
        variant: "destructive",
      });
      return;
    }

    // Calculate total based on items and duration
    const itemCount = items === '2-5' ? 3 : items === '6-10' ? 8 : 15; // Average items in range
    const total = rate * itemCount * duration;

    setSelectedPackage({
      type,
      duration,
      items,
      rate,
      total
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-slate-600 border-slate-300">
            Advertising Rates
          </Badge>
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Business Daily Deals <span className="text-primary">Advertising Rates</span>
          </h1>
          <p className="text-slate-600 text-lg max-w-3xl mx-auto mb-6">
            Rates shown are per item per day (rands). Calculate your total cost based on number of items and duration.
          </p>
        </div>

        {/* Rates Tables */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Regular Deals Table */}
          <Card className="shadow-xl border-2 border-blue-200">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <CardTitle className="text-2xl text-center">REGULAR DEALS</CardTitle>
              <p className="text-center text-blue-100">Rate per item per day (rands)</p>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="font-semibold text-slate-700 border-r">Duration</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-center border-r">2-5 items</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-center border-r">6-10 items</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-center">11-20 items</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ratesData.regular.map((rate, index) => (
                    <TableRow key={index} className="hover:bg-blue-50">
                      <TableCell className="font-medium border-r bg-slate-50">
                        {rate.duration} day{rate.duration > 1 ? 's' : ''}
                      </TableCell>
                      <TableCell className="text-center font-bold border-r cursor-pointer hover:bg-blue-100"
                        onClick={() => handleSelectPackage('regular', rate.duration, '2-5', rate.items25)}>
                        R{rate.items25}
                      </TableCell>
                      <TableCell className="text-center font-bold border-r cursor-pointer hover:bg-blue-100"
                        onClick={() => handleSelectPackage('regular', rate.duration, '6-10', rate.items610)}>
                        R{rate.items610}
                      </TableCell>
                      <TableCell className="text-center font-bold cursor-pointer hover:bg-blue-100"
                        onClick={() => handleSelectPackage('regular', rate.duration, '11-20', rate.items1120)}>
                        R{rate.items1120}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Hot Deals Table */}
          <Card className="shadow-xl border-2 border-orange-200">
            <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
              <CardTitle className="text-2xl text-center">HOT DEALS</CardTitle>
              <p className="text-center text-orange-100">Rate per item per day (rands)</p>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="font-semibold text-slate-700 border-r">Duration</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-center border-r">2-5 items</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-center border-r">6-10 items</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-center">11-20 items</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ratesData.hot.map((rate, index) => (
                    <TableRow key={index} className="hover:bg-orange-50">
                      <TableCell className="font-medium border-r bg-slate-50">
                        {rate.duration} day{rate.duration > 1 ? 's' : ''}
                      </TableCell>
                      <TableCell className="text-center font-bold border-r cursor-pointer hover:bg-orange-100"
                        onClick={() => handleSelectPackage('hot', rate.duration, '2-5', rate.items25)}>
                        R{rate.items25}
                      </TableCell>
                      <TableCell className="text-center font-bold border-r cursor-pointer hover:bg-orange-100"
                        onClick={() => handleSelectPackage('hot', rate.duration, '6-10', rate.items610)}>
                        R{rate.items610}
                      </TableCell>
                      <TableCell className="text-center font-bold cursor-pointer hover:bg-orange-100">
                        {rate.items1120 ? `R${rate.items1120}` : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                  {/* Empty rows to match regular table */}
                  {[...Array(3)].map((_, index) => (
                    <TableRow key={`empty-${index}`}>
                      <TableCell className="border-r bg-slate-50"></TableCell>
                      <TableCell className="border-r"></TableCell>
                      <TableCell className="border-r"></TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Calculator Section */}
        {selectedPackage && (
          <Card className="bg-slate-800 text-white shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Calculator className="h-5 w-5" />
                Cost Calculator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Selected Package:</label>
                    <p className="text-lg font-bold">
                      {selectedPackage.type.toUpperCase()} DEAL - {selectedPackage.duration} day{selectedPackage.duration > 1 ? 's' : ''}
                    </p>
                    <p className="text-slate-300">
                      {selectedPackage.items} items @ R{selectedPackage.rate} per item per day
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Enter exact number of items:</label>
                    <input 
                      type="number" 
                      className="w-full p-2 rounded border bg-slate-700 text-white border-slate-600"
                      placeholder="e.g. 3"
                      onChange={(e) => {
                        const items = parseInt(e.target.value) || 0;
                        const total = selectedPackage.rate * items * selectedPackage.duration;
                        setSelectedPackage({...selectedPackage, total});
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Calculation:</label>
                    <div className="bg-slate-700 p-4 rounded">
                      <p>Rate: R{selectedPackage.rate} per item per day</p>
                      <p>Duration: {selectedPackage.duration} day{selectedPackage.duration > 1 ? 's' : ''}</p>
                      <p className="text-xl font-bold text-green-400 mt-2">
                        Total: R{selectedPackage.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3"
                    data-testid="button-add-to-cart"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <div className="mt-12 text-center">
          <h3 className="text-2xl font-semibold text-slate-800 mb-4">How it Works</h3>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h4 className="font-semibold mb-2">Choose Your Package</h4>
              <p className="text-slate-600 text-sm">Click on any rate in the tables above to select your advertising package</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-orange-600 font-bold">2</span>
              </div>
              <h4 className="font-semibold mb-2">Calculate Total Cost</h4>
              <p className="text-slate-600 text-sm">Enter your exact number of items to see the total cost calculation</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 font-bold">3</span>
              </div>
              <h4 className="font-semibold mb-2">Purchase & Advertise</h4>
              <p className="text-slate-600 text-sm">Add to cart and proceed with payment to start advertising your deals</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}