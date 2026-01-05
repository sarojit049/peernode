"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";

const AcademicProfile = () => {
  const navigate = useNavigate();
  const [major, setMajor] = useState("");
  const [subjects, setSubjects] = useState("");
  const [learningStyle, setLearningStyle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!major || !subjects || !learningStyle) {
      toast.error("Please fill in all fields");
      return;
    }
    
    // In a real implementation, this would save to Firebase
    console.log("Profile saved:", { major, subjects, learningStyle });
    toast.success("Profile saved successfully!");
    navigate("/smart-matching");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-20">
      <div className="max-w-2xl mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Academic Profile</CardTitle>
            <CardDescription>
              Help us find the perfect study partners for you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="major">Major</Label>
                <Input
                  id="major"
                  placeholder="e.g., Computer Science"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subjects">Current Subjects</Label>
                <Textarea
                  id="subjects"
                  placeholder="List your current subjects, one per line"
                  value={subjects}
                  onChange={(e) => setSubjects(e.target.value)}
                  rows={5}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Learning Style</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {["Visual", "Verbal", "Logical"].map((style) => (
                    <div 
                      key={style}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        learningStyle === style 
                          ? "border-blue-500 bg-blue-50" 
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setLearningStyle(style)}
                    >
                      <div className="font-medium">{style}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        {style === "Visual" && "Learn through images and diagrams"}
                        {style === "Verbal" && "Learn through speaking and listening"}
                        {style === "Logical" && "Learn through reasoning and systems"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <Button type="submit" className="w-full py-6 text-lg">
                Save Profile & Continue
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <Navigation />
    </div>
  );
};

export default AcademicProfile;