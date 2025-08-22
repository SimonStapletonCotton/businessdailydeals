import { Shield, Copyright, Lock } from "lucide-react";

export function CopyrightNotice() {
  return (
    <div className="border-t border-slate-800 pt-8 mt-8 text-center text-slate-400">
      <div className="flex items-center justify-center gap-2 mb-3">
        <Copyright className="h-4 w-4" />
        <p>&copy; 2025 Business Daily Deals. All rights reserved. | www.businessdailydeals.co.za</p>
      </div>
      <div className="flex items-center justify-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <Shield className="h-3 w-3" />
          <span>Protected by copyright law</span>
        </div>
        <div className="flex items-center gap-1">
          <Lock className="h-3 w-3" />
          <span>Secured against unauthorized access</span>
        </div>
      </div>
      <p className="text-xs mt-2 max-w-2xl mx-auto">
        This website and its content, including but not limited to text, graphics, logos, images, deals, supplier information, 
        and software, are protected by copyright and intellectual property laws. Unauthorized reproduction, distribution, 
        or commercial use is strictly prohibited and may result in civil and criminal penalties.
      </p>
      <p className="text-xs mt-2 text-slate-500">
        Built with advanced security measures to protect against malicious attacks, unauthorized access, and data breaches.
      </p>
    </div>
  );
}