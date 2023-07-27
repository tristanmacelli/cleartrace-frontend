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
// This is a Server Side defined interface. Do not change key names
interface TransactionResult {
  type: string;
  userIDs: string[];
}

export interface MessageTransaction extends TransactionResult {
  message?: ServerMessage;
  messageID?: string;
  channelID?: string;
}

export interface ChannelTransaction extends TransactionResult {
  channel?: ServerGroup;
  channelID?: string;
}

export type MessagingTransaction = MessageTransaction | ChannelTransaction;

export interface Member {
  id: number;
  name: string;
  photoURL: string;
}

export interface UserSearchResult {
  id: number;
  text: string;
  img: string;
}

export interface LocalMessage {
  id?: string;
  channelID: string;
  body: string;
  createdAt: Date;
  createdAtTime: string;
  creator: LocalUser;
  editedAt?: Date;
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
