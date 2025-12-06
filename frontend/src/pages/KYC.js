import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Shield, Upload, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function KYC() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('KYC verification submitted!');
    navigate('/');
  };

  return (
    <div data-testid="kyc-page" className="min-h-screen bg-[#020617]">
      {/* Header */}
      <div className="glass border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            data-testid="back-button"
            className="text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-heading font-light text-2xl text-white">KYC Verification</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="glass-card">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Shield className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h2 className="font-heading text-3xl text-white">Verify Your Identity</h2>
              <p className="text-slate-400">Required for helper accounts and large transactions</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="id-number" className="text-slate-300">ID Number</Label>
              <Input
                id="id-number"
                name="id_number"
                placeholder="Enter your government ID number"
                required
                data-testid="id-number-input"
                className="bg-slate-950/50 border-white/10 text-white h-12"
              />
            </div>

            <div>
              <Label htmlFor="id-upload" className="text-slate-300">Upload ID</Label>
              <div className="mt-2 border-2 border-dashed border-white/10 rounded-2xl p-8 text-center cursor-pointer hover:border-blue-500/30 transition-all">
                <Upload className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                <p className="text-slate-300 mb-1">Click to upload or drag and drop</p>
                <p className="text-slate-500 text-sm">PNG, JPG up to 10MB</p>
                <input
                  id="id-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  data-testid="id-upload-input"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="selfie-upload" className="text-slate-300">Upload Selfie</Label>
              <div className="mt-2 border-2 border-dashed border-white/10 rounded-2xl p-8 text-center cursor-pointer hover:border-blue-500/30 transition-all">
                <Upload className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                <p className="text-slate-300 mb-1">Hold your ID next to your face</p>
                <p className="text-slate-500 text-sm">PNG, JPG up to 10MB</p>
                <input
                  id="selfie-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  data-testid="selfie-upload-input"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full btn-primary"
              data-testid="submit-kyc-button"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Submit Verification
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
