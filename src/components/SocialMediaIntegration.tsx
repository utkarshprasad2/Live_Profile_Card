import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Share2, Twitter, Linkedin, Github, Instagram } from 'lucide-react';

interface SocialLink {
  platform: string;
  url: string;
  icon: React.ReactNode;
}

const socialPlatforms: SocialLink[] = [
  {
    platform: 'Twitter',
    url: '',
    icon: <Twitter className="h-5 w-5" />
  },
  {
    platform: 'LinkedIn',
    url: '',
    icon: <Linkedin className="h-5 w-5" />
  },
  {
    platform: 'GitHub',
    url: '',
    icon: <Github className="h-5 w-5" />
  },
  {
    platform: 'Instagram',
    url: '',
    icon: <Instagram className="h-5 w-5" />
  }
];

export function SocialMediaIntegration() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(socialPlatforms);
  const [isEditing, setIsEditing] = useState(false);

  const handleUrlChange = (platform: string, url: string) => {
    setSocialLinks(prev =>
      prev.map(link =>
        link.platform === platform ? { ...link, url } : link
      )
    );
  };

  const handleSave = () => {
    // TODO: Save social links to backend
    console.log('Saving social links:', socialLinks);
    setIsEditing(false);
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: 'My Profile',
        text: 'Check out my profile!',
        url: window.location.href
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Social Media Links</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {socialLinks.map(link => (
            <div key={link.platform} className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {link.icon}
                <Label>{link.platform}</Label>
              </div>
              {isEditing ? (
                <Input
                  type="url"
                  placeholder={`Enter your ${link.platform} URL`}
                  value={link.url}
                  onChange={(e) => handleUrlChange(link.platform, e.target.value)}
                  className="flex-1"
                />
              ) : (
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-500 hover:underline"
                >
                  {link.url || 'Not set'}
                </a>
              )}
            </div>
          ))}
          {isEditing && (
            <Button onClick={handleSave} className="w-full">
              Save Changes
            </Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Share Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Button
              onClick={handleShare}
              className="w-full"
              variant="outline"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share Profile
            </Button>
            <div className="text-sm text-muted-foreground">
              Share your profile with others using the native share dialog or copy the link below.
            </div>
            <div className="flex gap-2">
              <Input
                readOnly
                value={window.location.href}
                className="flex-1"
              />
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                }}
              >
                Copy
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 