import axios from "axios";

export async function GetMessages(serverURL, group) {
  var url = serverURL + "v1/channels/" + group.ID;
  let sessionToken = localStorage.getItem("auth");

  // send a get request with the above data
  axios
    .get(url, {
      headers: {
        Authorization: sessionToken
      }
    })
    .catch(error => {
      alert(error);
    })
    .then(response => {
      let messages = response.data;
      messages
        .slice()
        .reverse()
        .forEach(message => {
          message = this.PreprocessMessage(message);
          this.messageList.push(message);
        });
      this.updateScroll();
    });
}
export async function SendMessage(serverURL, group, body, user) {
  var url = serverURL + "v1/channels/" + group.ID;
  let sessionToken = localStorage.getItem("auth");

  // Get user first name from store & add it to this object
  let date = new Date();
  let formattedDate = this.formatDate(date);
  let messageObject = {
    channelID: group.ID,
    body: body,
    createdAt: formattedDate,
    creator: user
  };
  // Setting the msg id locally to -1 (will self-correct on page refresh)
  let temporary = messageObject;
  temporary.id = "-1";
  this.messageList.push(temporary);
  // send a get request with the above data
  axios
    .post(url, messageObject, {
      headers: {
        Authorization: sessionToken
      }
    })
    .catch(error => {
      alert(error);
    })
    .then(() => {
      this.newBody = "";
      this.updateScroll();
    });
}

export async function CreateGroup(serverURL, names, members) {
  if (members.length == 0) {
    alert("Error: Invalid New Group Input");
    return;
  }
  let url = serverURL + "v1/channels";
  let sessionToken = localStorage.getItem("auth");
  let title = names.toString();
  let date = new Date();
  // title = title.substring(1, title.length - 2);
  // Create Group object
  let groupObject = {
    name: title,
    description: "*~Enter a description~*",
    private: true,
    members: members,
    createdAt: date,
    editedAt: null
  };
  axios
    .post(url, groupObject, {
      headers: {
        Authorization: sessionToken
      }
    })
    .catch(error => {
      alert(error);
    })
    .then(response => {
      // The type field allows groupList to properly consume the changes to the group
      let newBuffer = {
        group: response.data,
        type: "create",
        showModal: false
      };
      // Done in then to ensure backend generated id is correct
      this.$store.commit("setGroupBuffer", {
        groupBuffer: newBuffer
      });
      this.HideModal();
    });
}

export async function GetGroups(serverURL) {
  var url = serverURL + "v1/channels";
  let sessionToken = localStorage.getItem("auth");

  // send a get request with the above data
  axios
    .get(url, {
      headers: {
        Authorization: sessionToken
      }
    })
    .catch(error => {
      alert(error);
    })
    .then(response => {
      if (response == null) {
        return;
      }
      this.groups = [];
      groups = [];
      let groups = response.data;
      groups
        .slice()
        .reverse()
        .forEach(group => {
          this.groups.push(group);
        });
    });
}

export async function UpdateGroupDetails(serverURL, group) {
  // Update name & description
  let url = serverURL + "v1/channels/" + group.ID;
  let sessionToken = localStorage.getItem("auth");
  let body = {
    name: group.name,
    description: group.description
  };

  axios
    .patch(url, body, {
      headers: {
        Authorization: sessionToken
      }
    })
    .catch(error => {
      alert(error);
    })
    .then(response => {
      // The type field allows groupList to properly consume the changes to the group
      let newBuffer = {
        group: response.data,
        type: "update",
        showModal: false
      };
      this.$store.commit("setGroupBuffer", {
        groupBuffer: newBuffer
      });
    });
}

export async function DeleteGroup(serverURL, group, general) {
  if (confirm("Are you sure you want to delete this group?")) {
    let url = serverURL + "v1/channels/" + group.ID;
    let sessionToken = localStorage.getItem("auth");
    axios
      .delete(url, {
        headers: {
          Authorization: sessionToken
        }
      })
      .catch(error => {
        alert(error);
      })
      .then(() => {
        // Go back to the general group when deleting the channel
        this.$store.commit("setGroup", {
          group: general
        });
        let newBuffer = {
          group: general,
          type: "update",
          showModal: false
        };
        this.$store.commit("setGroupBuffer", {
          groupBuffer: newBuffer
        });
        this.HideModal();
      });
  }
}

export async function AddGroupMember(index, serverURL, group, member) {
  // this.HideResults();
  // let newMember = this.searchResults[index];

  // if (this.type === "create") {
  //   this.members.push(newMember.id);
  //   this.names.push(newMember.text);
  //   return;
  // }
  let url = serverURL + "v1/channels/" + group.ID + "/members";
  let sessionToken = localStorage.getItem("auth");
  let body = {
    id: member.id
  };

  axios
    .post(url, body, {
      headers: {
        Authorization: sessionToken
      }
    })
    .catch(error => {
      alert(error);
    })
    .then(response => {
      this.members.push(member.id);
      this.names.push(member.text);
      // The type field allows groupList to properly consume the changes to the group
      let newBuffer = {
        group: response.data,
        type: "update",
        showModal: false
      };
      this.$store.commit("setGroupBuffer", {
        groupBuffer: newBuffer
      });
    });
}

export async function RemoveGroupMember(index, serverURL, group, id) {
  // if (this.type === "create") {
  //   this.names.splice(index, 1);
  //   this.members.splice(index, 1);
  //   return;
  // }
  // let id = this.members[index];
  // Parse members & add them to new group obj before sending request
  let url = serverURL + "v1/channels/" + group.ID + "/members";
  let sessionToken = localStorage.getItem("auth");
  let data = {
    id: id
  };
  let headers = {
    Authorization: sessionToken
  };
  axios
    .delete(url, {
      headers,
      data
    })
    .catch(error => {
      alert(error);
    })
    .then(response => {
      // The type field allows groupList to properly consume the changes to the group
      this.names.splice(index, 1);
      this.members.splice(index, 1);
      let newBuffer = {
        message: response.data,
        type: "update",
        showModal: false
      };
      this.$store.commit("setGroupBuffer", {
        groupBuffer: newBuffer
      });
    });
}
