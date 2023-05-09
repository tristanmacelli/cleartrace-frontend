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
  id: string;
  name: string;
}

export interface LocalMessage {
  channelID: string;
  body: string;
  createdAt: string;
  creator: LocalUser;
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
