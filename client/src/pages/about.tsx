import Navbar from "@/components/navbar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Target, Users, Zap, Search, TrendingUp } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-slate-600 border-slate-300">
            About Business Daily Deals
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
            We're driven by{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
              DEALS DEALS DEALS
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Big deals, small deals, size doesn't matter. We're here to help you save money and grow your business.
          </p>
        </div>

        {/* Mission Section */}
        <Card className="p-8 mb-8 bg-white/60 backdrop-blur-sm border-slate-200 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full">
              <Target className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Our Mission</h2>
              <p className="text-slate-600 mb-4 leading-relaxed">
                Like all other deal offerings, we continuously scan the horizon for companies wanting to generate sales by offering deals on their products.
              </p>
              <p className="text-slate-600 leading-relaxed">
                We in turn take these offerings and display them on our website. The bottom line is you will end up paying discounted rates on anything you buy from our site.
              </p>
            </div>
          </div>
        </Card>

        {/* Values Section */}
        <Card className="p-8 mb-8 bg-white/60 backdrop-blur-sm border-slate-200 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Our Values</h2>
              <p className="text-slate-600 mb-4 leading-relaxed">
                We have an obsession with client satisfaction. We look at starting with the customer (you) and work backwards, to how we can best look after you. We will work vigorously to earn and keep customer trust.
              </p>
              <p className="text-slate-600 leading-relaxed">
                We think long term, meaning that we will not sacrifice short term gain for long term trust. We will strive for continuous innovation and ways of adding value to our customers, and to this end we will always welcome your input.
              </p>
            </div>
          </div>
        </Card>

        {/* Impact Section */}
        <Card className="p-8 mb-8 bg-white/60 backdrop-blur-sm border-slate-200 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">How We Help</h2>
              <p className="text-slate-600 leading-relaxed">
                We are essentially helping in more ways than one. Yes we are sourcing deals for you, but we are also offering many suppliers a platform to increase their sales, and therefore opportunities to maintain their livelihood.
              </p>
            </div>
          </div>
        </Card>

        {/* Deal Types Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-r from-orange-50 to-red-50 border-orange-200 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">HOT Deals</h3>
            </div>
            <p className="text-slate-600">
              Our main focus is on HOT deals, featured prominently on the front page for maximum visibility and immediate savings.
            </p>
          </Card>

          <Card className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">REGULAR Deals</h3>
            </div>
            <p className="text-slate-600">
              You will notice "REGULAR DEALS". Here you will find tons of other items on sale, for much longer periods.
            </p>
          </Card>
        </div>

        {/* Find Me a Deal Section */}
        <Card className="p-8 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full">
              <Search className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Can't Find Your Deal?</h2>
              <p className="text-slate-600 mb-4 leading-relaxed">
                If at any time you land on our site and can't find the deal you are looking for, send us a request on what you're looking for and we will actively track down a supplier that is prepared to offer your item at a discount.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Remember to choose TWO KEYWORDS that best describe your item, and include your mobile number. Once we have the necessary info we will load the deal for you to snap up, by sending you an SMS or E-MAIL notifying you that your deal has been loaded.
              </p>
            </div>
          </div>
        </Card>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <p className="text-slate-600 text-lg">
            Ready to start saving? Browse our deals or submit a custom request today!
          </p>
        </div>
      </div>
    </div>
  );
}