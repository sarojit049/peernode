"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";

// Mock data for active pods
const mockPods = [
  {
    id: "1",
    subject: "Data Structures & Algorithms",
    members: [
      { id: "1", name: "Alex Johnson", avatar: "" },
      { id: "2", name: "Sam Wilson", avatar: "" },
      { id: "3", name: "Taylor Kim", avatar: "" },
    ],
    learningStyles: ["Visual", "Logical", "Verbal"],
  },
  {
    id: "2",
    subject: "Database Management Systems",
    members: [
      { id: "4", name: "Jordan Smith", avatar: "" },
      { id: "5", name: "Casey Brown", avatar: "" },
    ],
    learningStyles: ["Logical", "Verbal"],
  },
  {
    id: "3",
    subject: "Operating Systems",
    members: [
      { id: "6", name: "Morgan Lee", avatar: "" },
      { id: "7", name: "Riley Davis", avatar: "" },
      { id: "8", name: "Quinn Miller", avatar: "" },
      { id: "9", name: "Parker Wilson", avatar: "" },
    ],
    learningStyles: ["Visual", "Logical", "Logical", "Verbal"],
  },
];

const SmartMatching = () => {
  const navigate = useNavigate();
  const [pods] = useState(mockPods);

  const handleJoinPod = (podId: string) => {
    toast.success("Joined study pod successfully!");
    console.log("Joined pod:", podId);
    // In a real implementation, this would update Firebase
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-20">
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Smart Matching</h1>
            <p className="text-gray-600">Find your perfect study partners</p>
          </div>
          <Button onClick={() => navigate("/ai-search")}>
            AI Syllabus Search
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pods.map((pod) => (
            <Card key={pod.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <span>{pod.subject}</span>
                  <Badge variant="secondary">{pod.members.length}/5 members</Badge>
                </CardTitle>
                <CardDescription>
                  Learning styles: {pod.learningStyles.join(", ")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex -space-x-2">
                    {pod.members.map((member) => (
                      <Avatar key={member.id} className="border-2 border-white">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </div>
                <Button 
                  onClick={() => handleJoinPod(pod.id)}
                  className="w-full"
                >
                  Join Pod
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="py-8">
              <h3 className="text-xl font-semibold mb-2">How Smart Matching Works</h3>
              <p className="text-gray-600 mb-4">
                Our AI algorithm matches you with students based on:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="font-medium">Shared Subjects</div>
                  <div className="text-sm text-gray-600">Study the same courses</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="font-medium">Learning Styles</div>
                  <div className="text-sm text-gray-600">Complementary approaches</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="font-medium">Availability</div>
                  <div className="text-sm text-gray-600">Matching schedules</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Navigation />
    </div>
  );
};

export default SmartMatching;