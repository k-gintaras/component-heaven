// tag-group-presets.ts
import { TagGroup } from './tag.interface';

export interface PresetInfo {
  id: string;
  name: string;
  description: string;
  icon?: string;
  useCase: string;
}

/**
 * Available preset configurations with metadata
 */
export const PRESET_INFO: Record<string, PresetInfo> = {
  colors: {
    id: 'colors',
    name: 'Colors',
    description: 'Basic color labels for visual organization',
    icon: 'palette',
    useCase: 'File organization, project categorization',
  },
  priority: {
    id: 'priority',
    name: 'Priority Levels',
    description: 'Task and item priority classification',
    icon: 'flag',
    useCase: 'Task management, issue tracking',
  },
  status: {
    id: 'status',
    name: 'Status Workflow',
    description: 'Common workflow states',
    icon: 'track_changes',
    useCase: 'Project management, content workflow',
  },
  fileTypes: {
    id: 'fileTypes',
    name: 'File Types',
    description: 'Common file format categories',
    icon: 'folder',
    useCase: 'Digital asset management, file organization',
  },
  emotions: {
    id: 'emotions',
    name: 'Emotions',
    description: 'Mood and feeling indicators',
    icon: 'mood',
    useCase: 'Journal entries, feedback classification',
  },
  departments: {
    id: 'departments',
    name: 'Departments',
    description: 'Company departments and teams',
    icon: 'groups',
    useCase: 'Corporate organization, team assignment',
  },
  severity: {
    id: 'severity',
    name: 'Issue Severity',
    description: 'Bug and issue severity levels',
    icon: 'warning',
    useCase: 'Bug tracking, incident management',
  },
  skills: {
    id: 'skills',
    name: 'Skills & Technologies',
    description: 'Technical skills and tools',
    icon: 'code',
    useCase: 'Resume building, project tagging',
  },
  content: {
    id: 'content',
    name: 'Content Types',
    description: 'Content classification for media',
    icon: 'article',
    useCase: 'Content management, blog organization',
  },
  geography: {
    id: 'geography',
    name: 'Geography',
    description: 'Regions and locations',
    icon: 'public',
    useCase: 'Travel planning, location-based organization',
  },
};

/**
 * Get all available preset information
 */
export function getAvailablePresets(): PresetInfo[] {
  return Object.values(PRESET_INFO);
}

/**
 * Create predefined tag groups for common use cases.
 * Now with more comprehensive presets!
 */
export function createPresetTagGroups(presetId: string): TagGroup[] {
  const presets: Record<string, TagGroup[]> = {
    colors: [
      {
        id: 'colors',
        name: 'Colors',
        tags: [
          { id: 'red', group: 'colors', name: 'Red' },
          { id: 'blue', group: 'colors', name: 'Blue' },
          { id: 'green', group: 'colors', name: 'Green' },
          { id: 'yellow', group: 'colors', name: 'Yellow' },
          { id: 'purple', group: 'colors', name: 'Purple' },
          { id: 'orange', group: 'colors', name: 'Orange' },
          { id: 'pink', group: 'colors', name: 'Pink' },
          { id: 'brown', group: 'colors', name: 'Brown' },
        ],
      },
    ],

    priority: [
      {
        id: 'priority',
        name: 'Priority',
        tags: [
          { id: 'low', group: 'priority', name: 'Low' },
          { id: 'medium', group: 'priority', name: 'Medium' },
          { id: 'high', group: 'priority', name: 'High' },
          { id: 'urgent', group: 'priority', name: 'Urgent' },
          { id: 'critical', group: 'priority', name: 'Critical' },
        ],
      },
    ],

    status: [
      {
        id: 'status',
        name: 'Status',
        tags: [
          { id: 'todo', group: 'status', name: 'To Do' },
          { id: 'in-progress', group: 'status', name: 'In Progress' },
          { id: 'review', group: 'status', name: 'Under Review' },
          { id: 'testing', group: 'status', name: 'Testing' },
          { id: 'done', group: 'status', name: 'Completed' },
          { id: 'blocked', group: 'status', name: 'Blocked' },
        ],
      },
    ],

    fileTypes: [
      {
        id: 'file-types',
        name: 'File Types',
        tags: [
          { id: 'document', group: 'file-types', name: 'Document' },
          { id: 'image', group: 'file-types', name: 'Image' },
          { id: 'video', group: 'file-types', name: 'Video' },
          { id: 'audio', group: 'file-types', name: 'Audio' },
          { id: 'archive', group: 'file-types', name: 'Archive' },
          { id: 'spreadsheet', group: 'file-types', name: 'Spreadsheet' },
          { id: 'presentation', group: 'file-types', name: 'Presentation' },
          { id: 'code', group: 'file-types', name: 'Code' },
        ],
      },
    ],

    emotions: [
      {
        id: 'emotions',
        name: 'Emotions',
        tags: [
          { id: 'happy', group: 'emotions', name: 'Happy' },
          { id: 'sad', group: 'emotions', name: 'Sad' },
          { id: 'excited', group: 'emotions', name: 'Excited' },
          { id: 'frustrated', group: 'emotions', name: 'Frustrated' },
          { id: 'calm', group: 'emotions', name: 'Calm' },
          { id: 'anxious', group: 'emotions', name: 'Anxious' },
          { id: 'confident', group: 'emotions', name: 'Confident' },
          { id: 'tired', group: 'emotions', name: 'Tired' },
        ],
      },
    ],

    departments: [
      {
        id: 'departments',
        name: 'Departments',
        tags: [
          { id: 'engineering', group: 'departments', name: 'Engineering' },
          { id: 'design', group: 'departments', name: 'Design' },
          { id: 'marketing', group: 'departments', name: 'Marketing' },
          { id: 'sales', group: 'departments', name: 'Sales' },
          { id: 'hr', group: 'departments', name: 'Human Resources' },
          { id: 'finance', group: 'departments', name: 'Finance' },
          { id: 'operations', group: 'departments', name: 'Operations' },
          { id: 'legal', group: 'departments', name: 'Legal' },
        ],
      },
    ],

    severity: [
      {
        id: 'severity',
        name: 'Issue Severity',
        tags: [
          { id: 'trivial', group: 'severity', name: 'Trivial' },
          { id: 'minor', group: 'severity', name: 'Minor' },
          { id: 'major', group: 'severity', name: 'Major' },
          { id: 'critical', group: 'severity', name: 'Critical' },
          { id: 'blocker', group: 'severity', name: 'Blocker' },
        ],
      },
    ],

    skills: [
      {
        id: 'frontend',
        name: 'Frontend',
        tags: [
          { id: 'angular', group: 'frontend', name: 'Angular' },
          { id: 'react', group: 'frontend', name: 'React' },
          { id: 'vue', group: 'frontend', name: 'Vue' },
          { id: 'typescript', group: 'frontend', name: 'TypeScript' },
          { id: 'css', group: 'frontend', name: 'CSS' },
        ],
      },
      {
        id: 'backend',
        name: 'Backend',
        tags: [
          { id: 'nodejs', group: 'backend', name: 'Node.js' },
          { id: 'python', group: 'backend', name: 'Python' },
          { id: 'java', group: 'backend', name: 'Java' },
          { id: 'csharp', group: 'backend', name: 'C#' },
          { id: 'golang', group: 'backend', name: 'Go' },
        ],
      },
    ],

    content: [
      {
        id: 'content-type',
        name: 'Content Type',
        tags: [
          { id: 'tutorial', group: 'content-type', name: 'Tutorial' },
          { id: 'blog-post', group: 'content-type', name: 'Blog Post' },
          { id: 'video', group: 'content-type', name: 'Video' },
          { id: 'podcast', group: 'content-type', name: 'Podcast' },
          { id: 'infographic', group: 'content-type', name: 'Infographic' },
          { id: 'case-study', group: 'content-type', name: 'Case Study' },
        ],
      },
      {
        id: 'audience',
        name: 'Target Audience',
        tags: [
          { id: 'beginner', group: 'audience', name: 'Beginner' },
          { id: 'intermediate', group: 'audience', name: 'Intermediate' },
          { id: 'advanced', group: 'audience', name: 'Advanced' },
          { id: 'expert', group: 'audience', name: 'Expert' },
        ],
      },
    ],

    geography: [
      {
        id: 'continents',
        name: 'Continents',
        tags: [
          { id: 'north-america', group: 'continents', name: 'North America' },
          { id: 'south-america', group: 'continents', name: 'South America' },
          { id: 'europe', group: 'continents', name: 'Europe' },
          { id: 'asia', group: 'continents', name: 'Asia' },
          { id: 'africa', group: 'continents', name: 'Africa' },
          { id: 'oceania', group: 'continents', name: 'Oceania' },
        ],
      },
      {
        id: 'climate',
        name: 'Climate',
        tags: [
          { id: 'tropical', group: 'climate', name: 'Tropical' },
          { id: 'temperate', group: 'climate', name: 'Temperate' },
          { id: 'arctic', group: 'climate', name: 'Arctic' },
          { id: 'desert', group: 'climate', name: 'Desert' },
          { id: 'mountain', group: 'climate', name: 'Mountain' },
        ],
      },
    ],
  };

  return presets[presetId] || [];
}

/**
 * Create sample items for a given preset to demonstrate functionality
 */
export function createSampleItemsForPreset(
  presetId: string,
): Array<{ id: string; name: string }> {
  const sampleItems: Record<string, Array<{ id: string; name: string }>> = {
    colors: [
      { id: '1', name: 'Project Alpha Documentation' },
      { id: '2', name: 'Marketing Campaign Assets' },
      { id: '3', name: 'Q4 Budget Report' },
      { id: '4', name: 'User Research Findings' },
      { id: '5', name: 'Website Redesign Mockups' },
    ],
    priority: [
      { id: '1', name: 'Fix critical login bug' },
      { id: '2', name: 'Update user documentation' },
      { id: '3', name: 'Plan team holiday party' },
      { id: '4', name: 'Review security audit' },
      { id: '5', name: 'Optimize database queries' },
    ],
    status: [
      { id: '1', name: 'Homepage redesign' },
      { id: '2', name: 'API documentation' },
      { id: '3', name: 'Mobile app testing' },
      { id: '4', name: 'Customer feedback analysis' },
      { id: '5', name: 'Performance optimization' },
    ],
    fileTypes: [
      { id: '1', name: 'presentation.pptx' },
      { id: '2', name: 'vacation_photos.zip' },
      { id: '3', name: 'budget_2024.xlsx' },
      { id: '4', name: 'demo_video.mp4' },
      { id: '5', name: 'meeting_notes.docx' },
    ],
    emotions: [
      { id: '1', name: 'My first day at work' },
      { id: '2', name: 'Project deadline stress' },
      { id: '3', name: 'Team celebration' },
      { id: '4', name: 'Customer complaint' },
      { id: '5', name: 'Successful product launch' },
    ],
    departments: [
      { id: '1', name: 'New employee onboarding' },
      { id: '2', name: 'Product roadmap planning' },
      { id: '3', name: 'Brand guidelines update' },
      { id: '4', name: 'Sales target review' },
      { id: '5', name: 'Legal compliance check' },
    ],
    severity: [
      { id: '1', name: 'Button text typo on homepage' },
      { id: '2', name: 'Slow loading checkout page' },
      { id: '3', name: 'Payment system not working' },
      { id: '4', name: 'Database connection failures' },
      { id: '5', name: 'Site completely down' },
    ],
    skills: [
      { id: '1', name: 'E-commerce website project' },
      { id: '2', name: 'Mobile banking app' },
      { id: '3', name: 'Data visualization dashboard' },
      { id: '4', name: 'Real-time chat system' },
      { id: '5', name: 'Machine learning pipeline' },
    ],
    content: [
      { id: '1', name: 'Getting Started with React' },
      { id: '2', name: 'Advanced TypeScript Patterns' },
      { id: '3', name: 'Building Scalable APIs' },
      { id: '4', name: 'UI/UX Best Practices' },
      { id: '5', name: 'DevOps for Beginners' },
    ],
    geography: [
      { id: '1', name: 'Tokyo business trip' },
      { id: '2', name: 'European conference tour' },
      { id: '3', name: 'Remote work from Bali' },
      { id: '4', name: 'New York office opening' },
      { id: '5', name: 'Antarctica research expedition' },
    ],
  };

  return (
    sampleItems[presetId] || [
      { id: '1', name: 'Sample Item 1' },
      { id: '2', name: 'Sample Item 2' },
      { id: '3', name: 'Sample Item 3' },
    ]
  );
}
