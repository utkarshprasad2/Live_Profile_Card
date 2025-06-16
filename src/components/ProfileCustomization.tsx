import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface ThemeOption {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  pattern: string;
}

const defaultThemes: ThemeOption[] = [
  {
    id: 'default',
    name: 'Default',
    primaryColor: '#000000',
    secondaryColor: '#ffffff',
    pattern: 'none'
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    primaryColor: '#1a1a1a',
    secondaryColor: '#ffffff',
    pattern: 'dots'
  },
  {
    id: 'gradient',
    name: 'Gradient',
    primaryColor: '#4f46e5',
    secondaryColor: '#7c3aed',
    pattern: 'gradient'
  }
];

export function ProfileCustomization() {
  const [selectedTheme, setSelectedTheme] = useState<ThemeOption>(defaultThemes[0]);
  const [customColors, setCustomColors] = useState({
    primary: selectedTheme.primaryColor,
    secondary: selectedTheme.secondaryColor
  });

  const handleThemeChange = (themeId: string) => {
    const theme = defaultThemes.find(t => t.id === themeId) || defaultThemes[0];
    setSelectedTheme(theme);
    setCustomColors({
      primary: theme.primaryColor,
      secondary: theme.secondaryColor
    });
  };

  const handleColorChange = (type: 'primary' | 'secondary', value: string) => {
    setCustomColors(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleSave = () => {
    // TODO: Save theme preferences to backend
    console.log('Saving theme:', {
      ...selectedTheme,
      primaryColor: customColors.primary,
      secondaryColor: customColors.secondary
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Customization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Theme</Label>
            <Select
              value={selectedTheme.id}
              onValueChange={handleThemeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a theme" />
              </SelectTrigger>
              <SelectContent>
                {defaultThemes.map(theme => (
                  <SelectItem key={theme.id} value={theme.id}>
                    {theme.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>Primary Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={customColors.primary}
                  onChange={(e) => handleColorChange('primary', e.target.value)}
                  className="w-12 h-12 p-1"
                />
                <Input
                  type="text"
                  value={customColors.primary}
                  onChange={(e) => handleColorChange('primary', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Secondary Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={customColors.secondary}
                  onChange={(e) => handleColorChange('secondary', e.target.value)}
                  className="w-12 h-12 p-1"
                />
                <Input
                  type="text"
                  value={customColors.secondary}
                  onChange={(e) => handleColorChange('secondary', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <Button onClick={handleSave} className="w-full">
            Save Changes
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="w-full h-48 rounded-lg transition-colors"
            style={{
              backgroundColor: customColors.primary,
              color: customColors.secondary,
              backgroundImage: selectedTheme.pattern === 'dots'
                ? 'radial-gradient(circle, currentColor 1px, transparent 1px)'
                : selectedTheme.pattern === 'gradient'
                ? `linear-gradient(45deg, ${customColors.primary}, ${customColors.secondary})`
                : 'none',
              backgroundSize: selectedTheme.pattern === 'dots' ? '20px 20px' : 'auto'
            }}
          >
            <div className="p-4">
              <h3 className="text-lg font-semibold">Preview Card</h3>
              <p className="text-sm opacity-80">This is how your profile will look</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 