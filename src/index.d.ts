interface LocalGroup {
  createdAt?: Date;
  creator?: {
    id: number;
  };
  description?: string;
  editedAt?: Date;
  index?: number;
  id?: string;
  // Was previously User[]
  members?: string[];
  name: string;
  private?: boolean;
}

interface Group {
  createdAt?: Date;
  creator?: {
    id: number;
  };
  description?: string;
  editedAt?: Date;
  id: string;
  // Was previously User[]
  members?: string[];
  name: string;
  private?: boolean;
}

interface ReducedUser {
  id: string;
  name: string;
}

interface Member {
  id: string;
  name: string;
}

interface LocalMessage {
  channelID: string;
  body: string;
  createdAt: string;
  creator: LocalUser;
}

interface ServerMessage {
  channelID: string;
  body: string;
  createdAt: Date;
  creator: LocalUser;
}

interface UserSearchResult {
  id: number;
  text: string;
  img: string;
}

interface LocalUser {
  id: number;
  email: string;
  FirstName: string;
  LastName: string;
  password: string;
}

interface ServerUser {
  ID: number;
  email: string;
  FirstName: string;
  LastName: string;
  password: string;
  PhotoURL: string;
}
