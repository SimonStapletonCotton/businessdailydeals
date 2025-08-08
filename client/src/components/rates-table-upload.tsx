import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Check, X, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface RateRow {
  id?: string;
  product: string;
  category: string;
  dailyRate: number;
  weeklyRate: number;
  monthlyRate: number;
  description?: string;
}

interface ParsedData {
  rates: RateRow[];
  errors: string[];
}

export function RatesTableUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query to fetch existing rates
  const { data: existingRates, isLoading } = useQuery({
    queryKey: ["/api/rates"],
  });

  // Mutation to save rates
  const saveRatesMutation = useMutation({
    mutationFn: async (rates: RateRow[]) => {
      await apiRequest("POST", "/api/rates/bulk-upload", { rates });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Rates table uploaded successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/rates"] });
      setParsedData(null);
      setFile(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save rates table",
        variant: "destructive",
      });
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      parseFile(selectedFile);
    }
  };

  const parseFile = async (file: File) => {
    setIsUploading(true);
    
    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length === 0) {
        throw new Error("File is empty");
      }

      // Parse CSV or TSV
      const separator = text.includes('\t') ? '\t' : ',';
      const headers = lines[0].split(separator).map(h => h.trim().toLowerCase());
      
      // Validate required headers
      const requiredHeaders = ['product', 'category', 'daily', 'weekly', 'monthly'];
      const missingHeaders = requiredHeaders.filter(header => 
        !headers.some(h => h.includes(header))
      );
      
      if (missingHeaders.length > 0) {
        throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
      }

      // Find column indices
      const productIndex = headers.findIndex(h => h.includes('product'));
      const categoryIndex = headers.findIndex(h => h.includes('category'));
      const dailyIndex = headers.findIndex(h => h.includes('daily'));
      const weeklyIndex = headers.findIndex(h => h.includes('weekly'));
      const monthlyIndex = headers.findIndex(h => h.includes('monthly'));
      const descriptionIndex = headers.findIndex(h => h.includes('description'));

      const rates: RateRow[] = [];
      const errors: string[] = [];

      // Parse data rows
      for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(separator);
        
        try {
          const dailyRate = parseFloat(row[dailyIndex]?.replace(/[^\d.-]/g, '') || '0');
          const weeklyRate = parseFloat(row[weeklyIndex]?.replace(/[^\d.-]/g, '') || '0');
          const monthlyRate = parseFloat(row[monthlyIndex]?.replace(/[^\d.-]/g, '') || '0');

          if (isNaN(dailyRate) || isNaN(weeklyRate) || isNaN(monthlyRate)) {
            errors.push(`Row ${i + 1}: Invalid rate values`);
            continue;
          }

          rates.push({
            product: row[productIndex]?.trim() || '',
            category: row[categoryIndex]?.trim() || '',
            dailyRate,
            weeklyRate,
            monthlyRate,
            description: descriptionIndex >= 0 ? row[descriptionIndex]?.trim() : undefined,
          });
        } catch (error) {
          errors.push(`Row ${i + 1}: Failed to parse - ${error}`);
        }
      }

      setParsedData({ rates, errors });
      
      if (rates.length > 0) {
        toast({
          title: "File Parsed Successfully",
          description: `Found ${rates.length} rate entries${errors.length > 0 ? ` with ${errors.length} errors` : ''}`,
        });
      } else {
        toast({
          title: "No Valid Data",
          description: "No valid rate entries found in the file",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Parse Error",
        description: error instanceof Error ? error.message : "Failed to parse file",
        variant: "destructive",
      });
      setParsedData(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveRates = () => {
    if (parsedData?.rates) {
      saveRatesMutation.mutate(parsedData.rates);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Rates Table
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="rates-file">Upload CSV or TSV file with rates data</Label>
            <Input
              id="rates-file"
              type="file"
              accept=".csv,.tsv,.txt"
              onChange={handleFileChange}
              className="mt-2"
            />
            <p className="text-sm text-slate-600 mt-1">
              Expected columns: Product, Category, Daily Rate, Weekly Rate, Monthly Rate, Description (optional)
            </p>
          </div>

          {file && (
            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
              <FileText className="h-4 w-4 text-slate-600" />
              <span className="text-sm font-medium">{file.name}</span>
              <Badge variant="secondary" className="ml-auto">
                {(file.size / 1024).toFixed(1)} KB
              </Badge>
            </div>
          )}

          {isUploading && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-300 border-t-slate-600"></div>
              Parsing file...
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Section */}
      {parsedData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Preview Parsed Data</span>
              <div className="flex gap-2">
                <Badge variant="secondary">
                  {parsedData.rates.length} entries
                </Badge>
                {parsedData.errors.length > 0 && (
                  <Badge variant="destructive">
                    {parsedData.errors.length} errors
                  </Badge>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Errors */}
            {parsedData.errors.length > 0 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="font-medium text-red-800">Parsing Errors</span>
                </div>
                <ul className="text-sm text-red-700 space-y-1">
                  {parsedData.errors.slice(0, 5).map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                  {parsedData.errors.length > 5 && (
                    <li>• ... and {parsedData.errors.length - 5} more errors</li>
                  )}
                </ul>
              </div>
            )}

            {/* Data Preview */}
            {parsedData.rates.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full border border-slate-200 rounded-lg">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="p-3 text-left text-sm font-medium text-slate-700 border-b">Product</th>
                      <th className="p-3 text-left text-sm font-medium text-slate-700 border-b">Category</th>
                      <th className="p-3 text-right text-sm font-medium text-slate-700 border-b">Daily Rate (ZAR)</th>
                      <th className="p-3 text-right text-sm font-medium text-slate-700 border-b">Weekly Rate (ZAR)</th>
                      <th className="p-3 text-right text-sm font-medium text-slate-700 border-b">Monthly Rate (ZAR)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedData.rates.slice(0, 10).map((rate, index) => (
                      <tr key={index} className="border-b border-slate-100">
                        <td className="p-3 text-sm">{rate.product}</td>
                        <td className="p-3 text-sm">{rate.category}</td>
                        <td className="p-3 text-sm text-right">R{rate.dailyRate.toFixed(2)}</td>
                        <td className="p-3 text-sm text-right">R{rate.weeklyRate.toFixed(2)}</td>
                        <td className="p-3 text-sm text-right">R{rate.monthlyRate.toFixed(2)}</td>
                      </tr>
                    ))}
                    {parsedData.rates.length > 10 && (
                      <tr>
                        <td colSpan={5} className="p-3 text-center text-sm text-slate-600 italic">
                          ... and {parsedData.rates.length - 10} more entries
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSaveRates}
                disabled={parsedData.rates.length === 0 || saveRatesMutation.isPending}
                className="bg-accent hover:bg-accent/90"
              >
                {saveRatesMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Save {parsedData.rates.length} Rates
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setParsedData(null);
                  setFile(null);
                }}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Rates Section */}
      {!isLoading && existingRates && Array.isArray(existingRates) && existingRates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Current Rates ({existingRates.length} entries)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border border-slate-200 rounded-lg">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="p-3 text-left text-sm font-medium text-slate-700 border-b">Product</th>
                    <th className="p-3 text-left text-sm font-medium text-slate-700 border-b">Category</th>
                    <th className="p-3 text-right text-sm font-medium text-slate-700 border-b">Daily Rate (ZAR)</th>
                    <th className="p-3 text-right text-sm font-medium text-slate-700 border-b">Weekly Rate (ZAR)</th>
                    <th className="p-3 text-right text-sm font-medium text-slate-700 border-b">Monthly Rate (ZAR)</th>
                  </tr>
                </thead>
                <tbody>
                  {existingRates.slice(0, 10).map((rate: any, index: number) => (
                    <tr key={index} className="border-b border-slate-100">
                      <td className="p-3 text-sm">{rate.product}</td>
                      <td className="p-3 text-sm">{rate.category}</td>
                      <td className="p-3 text-sm text-right">R{rate.dailyRate?.toFixed(2)}</td>
                      <td className="p-3 text-sm text-right">R{rate.weeklyRate?.toFixed(2)}</td>
                      <td className="p-3 text-sm text-right">R{rate.monthlyRate?.toFixed(2)}</td>
                    </tr>
                  ))}
                  {existingRates.length > 10 && (
                    <tr>
                      <td colSpan={5} className="p-3 text-center text-sm text-slate-600 italic">
                        ... and {existingRates.length - 10} more entries
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default RatesTableUpload;