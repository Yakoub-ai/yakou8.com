import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Github, Loader2, Plus, Trash2, Save, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface Project {
  title: string;
  description: string;
  link: string;
  tag: string;
}

const Admin = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const init = async () => {
      try {
        const authRes = await fetch('/api/auth/me');
        const authData = await authRes.json();
        
        if (authData.authenticated) {
          setUser(authData.user);
          const projectsRes = await fetch('/projects.json');
          const projectsData = await projectsRes.json();
          setProjects(projectsData);
        }
      } catch (err) {
        console.error("Initialization failed", err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const handleLogin = () => {
    window.location.href = '/api/auth/login';
  };

  const addProject = () => {
    setProjects([...projects, { title: "", description: "", link: "", tag: "Tool" }]);
  };

  const removeProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  const updateProject = (index: number, field: keyof Project, value: string) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], [field]: value };
    setProjects(updated);
  };

  const saveChanges = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/projects/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projects }),
      });

      if (response.ok) {
        toast.success("Changes saved successfully! Deployment started.");
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to save changes.");
      }
    } catch (err) {
      toast.error("An error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <Card className="w-full max-w-md border-border bg-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Admin Portal</CardTitle>
            <CardDescription>
              Login with your GitHub account associated with the Yakoub-ai organization.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <Button onClick={handleLogin} size="lg" className="gap-3 rounded-xl">
              <Github className="h-5 w-5" />
              Login with GitHub
            </Button>
          </CardContent>
          <CardFooter className="justify-center border-t border-border pt-6">
            <p className="text-xs text-muted-foreground">
              Only organization owners and members have access to this area.
            </p>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 lg:p-12">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <img src={user.avatar_url} alt={user.login} className="h-12 w-12 rounded-full border border-border" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Admin: {user.name || user.login}</h1>
              <p className="text-sm text-muted-foreground">Managing Yakoub-ai Projects</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              View Site
            </Button>
            <Button onClick={saveChanges} disabled={saving} className="gap-2 rounded-xl">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Changes
            </Button>
          </div>
        </header>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Projects</CardTitle>
              <CardDescription>Add, remove, or edit the projects displayed on your landing page.</CardDescription>
            </div>
            <Button onClick={addProject} variant="outline" size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Project
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {projects.map((project, index) => (
              <div key={index} className="relative space-y-4 rounded-xl border border-border p-6 shadow-sm">
                <Button 
                  onClick={() => removeProject(index)} 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-2 top-2 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Title</label>
                    <Input 
                      value={project.title} 
                      onChange={(e) => updateProject(index, 'title', e.target.value)}
                      placeholder="Project Title"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Tag</label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={project.tag}
                      onChange={(e) => updateProject(index, 'tag', e.target.value)}
                    >
                      <option value="AI Agent">AI Agent</option>
                      <option value="Tool">Tool</option>
                      <option value="Game">Game</option>
                      <option value="Best Practice">Best Practice</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Description</label>
                  <Textarea 
                    value={project.description} 
                    onChange={(e) => updateProject(index, 'description', e.target.value)}
                    placeholder="Short description of the project"
                    className="resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">GitHub/Project Link</label>
                  <div className="relative">
                    <Input 
                      value={project.link} 
                      onChange={(e) => updateProject(index, 'link', e.target.value)}
                      placeholder="https://github.com/Yakoub-ai/..."
                      className="pr-10"
                    />
                    <ExternalLink className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
            ))}

            {projects.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground">No projects found. Click "Add Project" to start.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
