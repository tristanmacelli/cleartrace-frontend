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
  group: ServerGroup,
  index: number
): LocalGroup => {
  return {
    ...group,
    index,
    createdAt: new Date(group.createdAt),
    creator: serverToClientUser(group.creator),
  };
};

export const serverToClientMessage = (message: ServerMessage): LocalMessage => {
  return {
    id: message.id,
    channelID: message.channelID,
    body: message.body || "",
    editedAt: new Date(message.editedAt),
    createdAt: new Date(message.createdAt),
    createdAtTime: FormatDate(new Date(message.createdAt)),
    creator: serverToClientUser(message.creator),
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

export const userSearchResultToMember = (
  userResult: UserSearchResult
): Member => {
  return {
    id: userResult.id,
    name: userResult.text,
    photoURL: userResult.img,
  };
};
