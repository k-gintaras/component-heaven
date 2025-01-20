export interface Tag {
  id: string;
  group: string; // id
  name: string;
}

export interface ExtendedTag extends Tag {
  color: string;
  backgroundColor: string;
}

export interface TagGroup {
  id: string;
  name: string; // Group name (e.g., groupName)
  tags: Tag[]; // List of tags in this group
}

export interface ExtendedTagGroup extends TagGroup {
  color: string;
  backgroundColor: string;
  tags: ExtendedTag[];
}

export interface TagItem {
  id: string;
  name: string;
  tags: Tag[];
}
