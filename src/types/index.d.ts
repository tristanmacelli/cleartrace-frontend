export interface ListItem {
  id: number;
  text: string;
}

export interface LocalGroup {
  id: string;
  name: string;
  description: string;
  private: boolean;
  members: number[];
  creator: LocalUser;
  createdAt: Date;
  editedAt?: Date;
  index: number;
}

export interface ServerGroup {
  id: string;
  name: string;
  description: string;
  private: boolean;
  members: number[]; // The type was previously User[]
  creator: ServerUser;
  createdAt: Date;
  editedAt: Date;
}

export interface Member {
  id: number;
  name: string;
  photoURL: string;
}

export interface GroupModal {
  group?: LocalGroup;
  type: string;
}

export interface LocalMessage {
  id?: string;
  channelID: string;
  body: string;
  createdAt: Date;
  createdAtTime: string;
  creator: LocalUser;
}

export interface MessageList {
  channelID: string;
  messages: LocalMessage[];
  unreadMessages?: LocalMessage[];
}

export interface ServerMessage {
  id: string;
  channelID: string;
  body: string;
  createdAt: Date;
  creator: ServerUser;
  editedAt: Date;
}

export interface UserSearchResult {
  id: number;
  text: string;
  img: string;
}

export interface LocalUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  photoURL: string;
}

export interface ServerUser {
  ID: number;
  Email: string;
  UserName: string;
  FirstName: string;
  LastName: string;
  PhotoURL: string;
}
