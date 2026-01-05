"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FileText, Upload } from "lucide-react";
import Navigation from "@/components/Navigation";

const AiSearch = () => {
  const navigate = useNavigate();
  const [syllabusText, setSyllabusText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // In a real implementation, this would process the PDF
    // For now, we'll simulate with mock data
    toast.success(`Uploaded ${file.name}`);
    setSyllabusText("Sample syllabus content extracted from PDF...");
  };

  const handleAnalyze = () => {
    if (!syllabusText.trim()) {
      toast.error("Please enter syllabus content or upload a file");
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      setIsAnalyzing(false);
      setResults({
        subject: "Advanced Web Development",
        topics: [
          "React Hooks and Context API",
          "State Management with Redux",
          "Backend Integration with Node.js",
          "Database Design with MongoDB",
          "Authentication and Security",
          "Performance Optimization"
        ],
        matchingPods: [
          {
            id: "1",
            subject: "Web Development Fundamentals",
            members: 3,
            matchScore: 92
          },
          {
            id: "2",
            subject: "Frontend Frameworks",
            members: 4,
            matchScore: 87
          }
        ]
      });
      toast.success("Syllabus analyzed successfully!");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-20">
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">AI Syllabus Search</h1>
            <p className="text-gray-600">Upload your syllabus to find matching study partners</p>
          </div>
          <Button variant="outline" onClick={() => navigate("/smart-matching")}>
            Back to Pods
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Upload Syllabus</CardTitle>
              <CardDescription>
                Upload your course syllabus or paste the content below
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors">
                <Input
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  id="file-upload"
                  onChange={handleFileUpload}
                />
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center">
                    <Upload className="w-12 h-12 text-gray-400 mb-2" />
                    <p className="font-medium">Click to upload PDF</p>
                    <p className="text-sm text-gray-500">or drag and drop</p>
                    <p className="text-xs text-gray-400 mt-2">PDF up to 10MB</p>
                  </div>
                </Label>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-2 text-gray-500">OR</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="syllabus-content">Paste Syllabus Content</Label>
                <Textarea
                  id="syllabus-content"
                  placeholder="Paste your syllabus content here..."
                  value={syllabusText}
                  onChange={(e) => setSyllabusText(e.target.value)}
                  rows={10}
                />
              </div>

              <Button 
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full py-6 text-lg"
              >
                {isAnalyzing ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    Analyzing with AI...
                  </>
                ) : (
                  "Analyze with Gemini AI"
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Analysis Results</CardTitle>
              <CardDescription>
                {results 
                  ? "Here are your matching study pods" 
                  : "Upload and analyze your syllabus to see results"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {results ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Identified Subject</h3>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-blue-800 font-medium">{results.subject}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-2">Key Topics</h3>
                    <div className="flex flex-wrap gap-2">
                      {results.topics.map((topic: string, index: number) => (
                        <span 
                          key={index} 
                          className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-2">Matching Study Pods</h3>
                    <div className="space-y-4">
                      {results.matchingPods.map((pod: any) => (
                        <div 
                          key={pod.id} 
                          className="border rounded-lg p-4 hover:border-blue-300 transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{pod.subject}</h4>
                              <p className="text-sm text-gray-600">{pod.members} members</p>
                            </div>
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                              {pod.matchScore}% match
                            </span>
                          </div>
                          <Button 
                            size="sm" 
                            className="mt-3"
                            onClick={() => {
                              toast.success("Joined study pod successfully!");
                            }}
                          >
                            Join Pod
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <FileText className="w-12 h-12 mb-4" />
                  <p>Upload a syllabus to see AI analysis</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Navigation />
    </div>
  );
};

export default AiSearch;