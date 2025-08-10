import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RatesTableUpload from "@/components/rates-table-upload";
import { FileText, Upload, Database, BarChart3, Flame } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { BackButton } from "@/components/back-button";

export default function RatesManagement() {
  const { data: rates, isLoading } = useQuery({
    queryKey: ["/api/rates"],
  });

  const totalRates = Array.isArray(rates) ? rates.length : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BackButton label="← Back to Home" />
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            RATES WE CHARGE
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Upload and manage your advertising rates table for different products and categories.
            Set daily, weekly, and monthly rates for your advertising products.
          </p>
          
          {totalRates > 0 && (
            <div className="flex justify-center mt-6">
              <Badge variant="secondary" className="px-4 py-2 text-lg">
                <Database className="h-4 w-4 mr-2" />
                {totalRates} rates loaded
              </Badge>
            </div>
          )}
        </div>

        {/* FREE Promotional Banner */}
        <div className="bg-green-600 py-6 rounded-lg mb-8">
          <div className="text-center text-white">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-2">
              <div className="flex items-center">
                <Flame className="h-5 w-5 mr-2 text-orange-200" />
                <p className="text-lg sm:text-xl font-bold">
                  🎉 SUPPLIERS: POST DEALS FOR FREE UNTIL 1ST JANUARY 2026!
                </p>
                <Flame className="h-5 w-5 ml-2 text-orange-200" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm sm:text-base opacity-90">
                Register as a supplier and post unlimited HOT & REGULAR deals at no cost
              </p>
              <p className="text-xs sm:text-sm opacity-80">
                Save R125 per HOT deal • R50 per REGULAR deal • No setup fees
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload Rates
            </TabsTrigger>
            <TabsTrigger value="view" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              View Current Rates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <div className="space-y-6">
              {/* Instructions Card */}
              <Card className="bg-gradient-to-r from-accent/5 to-accent/10 border-accent/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-accent">
                    <FileText className="h-5 w-5" />
                    File Format Instructions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-slate-700 mb-2">Required Columns:</h4>
                      <ul className="text-sm text-slate-600 space-y-1">
                        <li>• <strong>Product</strong> - Name of the advertising product</li>
                        <li>• <strong>Category</strong> - Product category</li>
                        <li>• <strong>Daily Rate</strong> - Daily advertising rate (ZAR)</li>
                        <li>• <strong>Weekly Rate</strong> - Weekly advertising rate (ZAR)</li>
                        <li>• <strong>Monthly Rate</strong> - Monthly advertising rate (ZAR)</li>
                        <li>• <strong>Description</strong> - Optional product description</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-700 mb-2">Supported Formats:</h4>
                      <ul className="text-sm text-slate-600 space-y-1">
                        <li>• CSV files (.csv)</li>
                        <li>• Tab-separated files (.tsv)</li>
                        <li>• Text files (.txt)</li>
                      </ul>
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs text-blue-700">
                          <strong>Tip:</strong> Currency symbols (R) will be automatically removed from rate values.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Upload Component */}
              <RatesTableUpload />
            </div>
          </TabsContent>

          <TabsContent value="view">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Current Advertising Rates</span>
                  {isLoading && (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-slate-300 border-t-slate-600"></div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-300 border-t-slate-600 mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading rates...</p>
                  </div>
                ) : totalRates === 0 ? (
                  <div className="text-center py-12">
                    <Database className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-700 mb-2">No Rates Uploaded</h3>
                    <p className="text-slate-600 mb-4">
                      Upload your advertising rates table to get started.
                    </p>
                    <Button onClick={() => {
                      const uploadTab = document.querySelector('[data-value="upload"]') as HTMLElement;
                      uploadTab?.click();
                    }}>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Rates
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <p className="text-slate-600">
                        Showing {totalRates} advertising rate{totalRates !== 1 ? 's' : ''}
                      </p>
                      <Badge variant="outline">
                        Total: {totalRates} entries
                      </Badge>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full border border-slate-200 rounded-lg">
                        <thead className="bg-slate-50">
                          <tr>
                            <th className="p-3 text-left text-sm font-medium text-slate-700 border-b">Product</th>
                            <th className="p-3 text-left text-sm font-medium text-slate-700 border-b">Category</th>
                            <th className="p-3 text-right text-sm font-medium text-slate-700 border-b">Daily Rate (ZAR)</th>
                            <th className="p-3 text-right text-sm font-medium text-slate-700 border-b">Weekly Rate (ZAR)</th>
                            <th className="p-3 text-right text-sm font-medium text-slate-700 border-b">Monthly Rate (ZAR)</th>
                            <th className="p-3 text-left text-sm font-medium text-slate-700 border-b">Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Array.isArray(rates) && rates.map((rate: any, index: number) => (
                            <tr key={rate.id || index} className="border-b border-slate-100 hover:bg-slate-50">
                              <td className="p-3 text-sm font-medium">{rate.product}</td>
                              <td className="p-3 text-sm">
                                <Badge variant="outline" className="text-xs">
                                  {rate.category}
                                </Badge>
                              </td>
                              <td className="p-3 text-sm text-right font-mono">R{parseFloat(rate.dailyRate || 0).toFixed(2)}</td>
                              <td className="p-3 text-sm text-right font-mono">R{parseFloat(rate.weeklyRate || 0).toFixed(2)}</td>
                              <td className="p-3 text-sm text-right font-mono">R{parseFloat(rate.monthlyRate || 0).toFixed(2)}</td>
                              <td className="p-3 text-sm text-slate-600 max-w-xs truncate">
                                {rate.description || '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}