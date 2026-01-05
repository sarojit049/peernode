"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";

const Onboarding = () => {
  const navigate = useNavigate();

  const handleGoogleSignIn = () => {
    // In a real implementation, this would integrate with Firebase Auth
    // For now, we'll simulate a successful login
    console.log("Signing in with Google");
    navigate("/academic-profile");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto bg-blue-100 rounded-full p-4 w-24 h-24 flex items-center justify-center mb-4">
            <div className="bg-blue-500 rounded-full w-16 h-16 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">PN</span>
            </div>
          </div>
          <CardTitle className="text-2xl">Welcome to PeerNode</CardTitle>
          <CardDescription>
            Connect with study partners who share your academic goals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleGoogleSignIn}
            className="w-full py-6 text-lg flex items-center gap-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700"
          >
            <FcGoogle className="w-6 h-6" />
            Sign in with Google
          </Button>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>By signing in, you agree to our</p>
            <p>Terms of Service and Privacy Policy</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;