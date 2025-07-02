'use client'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Github, 
  ExternalLink, 
  Shield, 
  AlertTriangle, 
  CheckCircle2,
  ArrowRight,
  Settings,
  Key,
  Clock,
  Lock,
  Eye,
  Plus,
  Copy
} from 'lucide-react'

const Instructions: React.FC = () => {
  const steps = [
    {
      number: 1,
      title: "Go to GitHub Settings",
      description: "Navigate to your GitHub account settings page",
      action: "Click the button below to open GitHub Settings",
      buttonText: "Open GitHub Settings",
      buttonLink: "https://github.com/settings",
      icon: Settings
    },
    {
      number: 2,
      title: "Access Developer Settings",
      description: "Scroll down to find the 'Developer settings' section in the left sidebar",
      action: "Click on 'Developer settings' to proceed",
      icon: Key
    },
    {
      number: 3,
      title: "Create Personal Access Token",
      description: "Click on 'Personal access tokens' and then 'Tokens (classic)'",
      action: "Click 'Generate new token' and select 'Generate new token (classic)'",
      icon: Plus
    },
    {
      number: 4,
      title: "Configure Token Settings",
      description: "Set up your token with appropriate permissions and expiration",
      details: [
        "Give your token a descriptive name (e.g., 'FileSaver App Access')",
        "Set an expiration date (recommended: 90 days or less)",
        "Select ALL the required permissions listed below for complete read, write, and delete access"
      ],
      icon: Shield
    },
    {
      number: 5,
      title: "Generate and Copy Token",
      description: "Click 'Generate token' and immediately copy the token",
      action: "Important: Copy the token immediately as you won't see it again!",
      icon: Copy
    },
    {
      number: 6,
      title: "Add Token to FileSaver",
      description: "Return to this page and add your token using the form above",
      action: "Paste your token and configure the settings as needed",
      icon: CheckCircle2
    }
  ]

  const permissions = [
    {
      name: "Repository Access (Full)",
      code: "repo",
      description: "Full control of private and public repositories including read, write, and delete access",
      required: true,
      scope: "Complete access to repositories - read, write, delete, and manage all repository content"
    },
    {
      name: "Repository Contents",
      code: "repo:status",
      description: "Read and write access to repository contents",
      required: true,
      scope: "Access to commit statuses and repository contents"
    },
    {
      name: "Repository Administration",
      code: "admin:repo_hook",
      description: "Full repository administration including webhooks",
      required: true,
      scope: "Manage repository settings, webhooks, and administrative functions"
    },
    {
      name: "Delete Repository",
      code: "delete_repo",
      description: "Delete repositories permanently",
      required: true,
      scope: "Permanently delete repositories and all associated data"
    },
    {
      name: "User Profile (Full)",
      code: "user",
      description: "Read and update user profile information",
      required: true,
      scope: "Full access to user profile data and settings"
    },
    {
      name: "User Email",
      code: "user:email",
      description: "Access to user email addresses",
      required: true,
      scope: "Read user email addresses and email preferences"
    },
    {
      name: "GitHub Actions (Full)",
      code: "workflow",
      description: "Manage GitHub Actions workflows and runs",
      required: true,
      scope: "Create, update, delete, and manage workflow files and runs"
    },
    {
      name: "Organization Access",
      code: "admin:org",
      description: "Full organization administration",
      required: true,
      scope: "Manage organization settings, members, and administrative functions"
    },
    {
      name: "Gist Access (Full)",
      code: "gist",
      description: "Create, read, update, and delete gists",
      required: true,
      scope: "Complete gist management - create, read, write, and delete"
    },
    {
      name: "Package Access",
      code: "write:packages",
      description: "Upload packages to GitHub Package Registry",
      required: true,
      scope: "Upload, download, and manage packages in GitHub Package Registry"
    },
    {
      name: "Security Events",
      code: "security_events",
      description: "Access to security events and alerts",
      required: true,
      scope: "Read and manage security events, alerts, and vulnerability reports"
    },
    {
      name: "Deployments",
      code: "deployment_status",
      description: "Access to deployment statuses",
      required: true,
      scope: "Read and update deployment statuses and environments"
    }
  ]

  const securityTips = [
    "Never share your access token publicly or commit it to version control",
    "Use the minimum required permissions for your use case",
    "Set an expiration date for your tokens and rotate them regularly",
    "Monitor your token usage in GitHub's security log",
    "Revoke tokens immediately if you suspect they've been compromised",
    "Use different tokens for different applications or services"
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Github className="h-5 w-5 text-primary" />
            </div>
            How to Generate a GitHub Access Token
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <strong>Security First:</strong> GitHub access tokens provide access to your repositories and account. 
                Follow these steps carefully and keep your tokens secure.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={step.number} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                      {step.number}
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <step.icon className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-lg">{step.title}</h3>
                    </div>
                    <p className="text-muted-foreground">{step.description}</p>
                    {step.action && (
                      <div className="flex items-center gap-2">
                        <ArrowRight className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">{step.action}</span>
                      </div>
                    )}
                    {step.details && (
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                        {step.details.map((detail, idx) => (
                          <li key={idx}>{detail}</li>
                        ))}
                      </ul>
                    )}
                    {step.buttonText && step.buttonLink && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(step.buttonLink, '_blank')}
                        className="flex items-center gap-2"
                      >
                        {step.buttonText}
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Required Permissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {permissions.map((permission) => (
                <div key={permission.code} className="flex items-start gap-3 p-3 rounded-lg border">
                  <div className="flex-shrink-0">
                    {permission.required ? (
                      <Badge variant="destructive" className="text-xs">Required</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">Optional</Badge>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{permission.name}</h4>
                      <code className="text-xs bg-muted px-1 py-0.5 rounded">{permission.code}</code>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{permission.description}</p>
                    <p className="text-xs text-muted-foreground">{permission.scope}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Security Best Practices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {securityTips.map((tip, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">{tip}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}

export default Instructions 