// app/about/page.tsx (or wherever your route is)

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-12">
      {/* About Us Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">About Us</CardTitle>
          <p className="text-muted-foreground text-sm">
            Learn more about our mission, vision, and the team behind this
            platform.
          </p>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            We started this project with a single goal — to make tech education
            simple, accessible, and practical for everyone. From developers to
            curious learners, our platform is designed to bridge the gap between
            complexity and clarity.
          </p>
          <p>
            Built by passionate engineers and creators, we believe that
            technology should be demystified. We focus on delivering quality
            content, tools, and services that actually help you grow in your
            career or hobby.
          </p>
        </CardContent>
      </Card>

      <Separator />

      {/* Our Mission Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Our Mission</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground leading-relaxed">
          <p>
            Empower individuals around the world by making high-quality tech
            education and tools accessible without unnecessary complexity or
            gatekeeping.
          </p>
        </CardContent>
      </Card>

      <Separator />

      {/* Our Team Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Meet the Team</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* You can map through team members here later */}
          <div className="space-y-2 text-center">
            <Image
              src={"/team/man.jpg"}
              alt=""
              width={96}
              height={96}
              className="aspect-square rounded-full object-cover mx-auto"
            />
            <p className="font-medium">Peter</p>
            <p className="text-xs text-muted-foreground">Founder & Developer</p>
          </div>
          <div className="space-y-2 text-center">
             <Image
              src={"/team/author2.jpg"}
              alt=""
              width={96}
              height={96}
              className="aspect-square rounded-full object-cover mx-auto"
            />
            <p className="font-medium">Millie Rusk</p>
            <p className="text-xs text-muted-foreground">UI/UX Designer</p>
          </div>
          <div className="space-y-2 text-center">
           <Image
              src={"/team/author3.jpg"}
              alt=""
              width={96}
              height={96}
              className="aspect-square rounded-full object-cover mx-auto"
            />
            <p className="font-medium">Alice Martin</p>
            <p className="text-xs text-muted-foreground">Community Manager</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutPage;
