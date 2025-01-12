export interface Tag {
  id: number;
  group: number;
  name: string;
  color: string;
  backgroundColor: string;
}

export interface TagGroup {
  id: number;
  title: string; // Group name (e.g., groupName)
  tags: Tag[]; // List of tags in this group
  color: string;
  backgroundColor: string;
}
