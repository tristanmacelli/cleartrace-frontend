import {
  LocalGroup,
  LocalMessage,
  LocalUser,
  Member,
  ServerGroup,
  ServerMessage,
  ServerUser,
  UserSearchResult,
} from "../types";
import { FormatDate } from "./datetime";

// LocalGroup members is a list of numbers that corresponds to ids of users. All of these users are present in a
// list called memberUserData (LocalUser[]) when full user data is needed
export const serverToClientGroup = (
  groupListLength: number,
  group: ServerGroup
): LocalGroup => {
  return {
    ...group,
    index: groupListLength,
    createdAt: new Date(group.createdAt),
    messageList: [],
    creator: serverToClientUser(group.creator),
  };
};

export const serverToClientMessage = (message: ServerMessage): LocalMessage => {
  return {
    id: message.id,
    channelID: message.channelID,
    body: message.body || "",
    createdAt: new Date(message.createdAt),
    createdAtTime: FormatDate(message.createdAt),
    creator: {
      id: message.creator.ID,
      email: message.creator.Email,
      firstName: message.creator.FirstName,
      lastName: message.creator.LastName,
      photoURL: message.creator.PhotoURL,
    },
  };
};

export const serverToClientUser = (user: ServerUser): LocalUser => {
  return {
    id: user.ID,
    email: user.Email,
    firstName: user.FirstName,
    lastName: user.LastName,
    photoURL: user.PhotoURL,
  };
};

export const userToUserSearchResult = (user: LocalUser): UserSearchResult => {
  return {
    id: user.id,
    text: user.firstName + " " + user.lastName,
    img: user.photoURL,
  };
};

//
export const serverUserToUserSearchResult = (
  user: ServerUser
): UserSearchResult => {
  const localUser = serverToClientUser(user);
  return userToUserSearchResult(localUser);
};

export const serverUserToMember = (user: ServerUser): Member => {
  return {
    id: user.ID,
    name: user.FirstName + " " + user.LastName,
    photoURL: user.PhotoURL,
  };
};
