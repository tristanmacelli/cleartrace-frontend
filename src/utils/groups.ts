import { LocalGroup, LocalUser } from "@/types";

const spaceAfterCommas = (str: string): string => {
  return str.replace(/,/g, ", ");
};

export const createServerGroupName = (
  memberNames: string[],
  currentUserFullName: string
) => {
  return spaceAfterCommas(memberNames.toString() + `,${currentUserFullName}`);
};

// TODO: Remove spacesAfterCommas from return values once group names have been replaced.
export const createLocalGroupName = (
  name: string,
  currentUserFullName: string
): string => {
  const startIndex = name.indexOf(currentUserFullName);
  // Likely indicates a custom name
  // TODO: create stronger safeguard when supplying user-based group name
  if (startIndex === -1) return name;
  const endIndex = startIndex + currentUserFullName.length;

  // Start case (add one to remove leading comma)
  if (startIndex === 0) {
    return spaceAfterCommas(name.substring(endIndex + 1));
  }

  // Middle case
  if (startIndex + currentUserFullName.length !== name.length) {
    return spaceAfterCommas(
      name.substring(0, startIndex) + name.substring(endIndex + 1)
    );
  }

  // End case
  return spaceAfterCommas(name.substring(0, startIndex - 2));
};

export const getStoredActiveGroup = (user: LocalUser): LocalGroup | null => {
  const activeGroupJSON = localStorage.getItem("activeGroup");

  if (!activeGroupJSON || activeGroupJSON == "undefined") {
    return null;
  }
  const activeGroup: LocalGroup = JSON.parse(activeGroupJSON);

  if (activeGroup.members.findIndex((m) => m === user.id) === -1) {
    return null;
  }
  return activeGroup;
};
