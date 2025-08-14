import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DownloadPackage() {
  const handleDownload = () => {
    // Create download link for the deployment package
    const link = document.createElement('a');
    link.href = '/businessdailydeals-upload.tar.gz';
    link.download = 'businessdailydeals-upload.tar.gz';
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-100 to-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">
          Cybersmart Deployment Package
        </h1>
        
        <div className="mb-6">
          <div className="text-sm text-slate-600 mb-2">Ready for Upload</div>
          <div className="text-lg font-semibold text-orange-600">
            businessdailydeals-upload.tar.gz
          </div>
          <div className="text-sm text-slate-500">312 KB</div>
        </div>

        <Button 
          onClick={handleDownload}
          className="w-full bg-orange-600 hover:bg-orange-700"
          data-testid="button-download-package"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Deployment Package
        </Button>

        <div className="mt-6 text-xs text-slate-500 text-left">
          <p className="font-semibold mb-2">Upload Instructions:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Access Cybersmart cPanel File Manager</li>
            <li>Navigate to public_html directory</li>
            <li>Upload this tar.gz file</li>
            <li>Right-click and Extract</li>
            <li>Visit www.businessdailydeals.co.za</li>
          </ol>
        </div>
      </div>
    </div>
  );
}