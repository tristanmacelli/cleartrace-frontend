import axios from "axios";

import { computed, ref } from "vue";
import { useStore } from "vuex";

export const Messages = () => {
  const store = useStore();
  const serverURL = computed(() => store.state.serverURL);
  const group = computed(() => store.state.group);
  const user = computed(() => store.state.user);
  const body = ref("");
  const messageList = ref([]);

  async function GetMessages() {
    var url = serverURL.value + "v1/channels/" + group.value.ID;
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
            messageList.value.push(message);
          });
        // TODO: Local function call
        this.updateScroll();
      });
  }
  async function SendMessage() {
    var url = serverURL.value + "v1/channels/" + group.value.ID;
    let sessionToken = localStorage.getItem("auth");

    // Get user first name from store & add it to this object
    let date = new Date();
    // TODO: Local function call
    let formattedDate = this.formatDate(date);
    let messageObject = {
      channelID: group.value.ID,
      body: body,
      createdAt: formattedDate,
      creator: user
    };
    // Setting the msg id locally to -1 (will self-correct on page refresh)
    let temporary = messageObject;
    temporary.id = "-1";
    messageList.value.push(temporary);
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
        body.value = "";
        // TODO: Local function call
        this.updateScroll();
      });
  }

  return {
    SendMessage,
    GetMessages
  };
};

// TODO: Figure out how to handle local function calls
export const Groups = () => {
  const store = useStore();
  const serverURL = computed(() => store.state.serverURL);
  const general = computed(() => store.state.general);
  const names = ref([]);
  const members = ref([]);
  const group = ref({});
  const groups = ref([]);
  const index = ref(-1);

  async function CreateGroup() {
    if (members.value.length == 0) {
      alert("Error: Invalid New Group Input");
      return;
    }
    let url = serverURL.value + "v1/channels";
    let sessionToken = localStorage.getItem("auth");
    let title = names.value.toString();
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
        store.commit("setGroupBuffer", {
          groupBuffer: newBuffer
        });
        // TODO: Figure out how to handle local function calls
        this.HideModal();
      });
  }
  async function GetGroups() {
    var url = serverURL.value + "v1/channels";
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
        groups.value = [];
        let receivedGroups = response.data;
        receivedGroups
          .slice()
          .reverse()
          .forEach(group => {
            groups.value.push(group);
          });
      });
  }
  async function UpdateGroupDetails() {
    // Update name & description
    let url = serverURL.value + "v1/channels/" + group.value.ID;
    let sessionToken = localStorage.getItem("auth");
    let body = {
      name: group.value.name,
      description: group.value.description
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
        store.commit("setGroupBuffer", {
          groupBuffer: newBuffer
        });
      });
  }
  async function DeleteGroup() {
    if (!confirm("Are you sure you want to delete this group?")) {
      return;
    }
    let url = serverURL.value + "v1/channels/" + group.value.ID;
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
        store.commit("setGroup", {
          group: general
        });
        let newBuffer = {
          group: general,
          type: "update",
          showModal: false
        };
        store.commit("setGroupBuffer", {
          groupBuffer: newBuffer
        });
        // TODO: Figure out how to handle local function calls
        this.HideModal();
      });
  }
  async function AddGroupMember() {
    // TODO: Figure out how to handle local function calls
    this.HideResults();
    let newMember = this.searchResults[index];

    if (this.type === "create") {
      this.members.push(newMember.id);
      this.names.push(newMember.text);
      return;
    }
    let url = serverURL.value + "v1/channels/" + group.value.ID + "/members";
    let sessionToken = localStorage.getItem("auth");
    let body = {
      id: newMember.id
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
        this.members.push(newMember.id);
        this.names.push(newMember.text);
        // The type field allows groupList to properly consume the changes to the group
        let newBuffer = {
          group: response.data,
          type: "update",
          showModal: false
        };
        store.commit("setGroupBuffer", {
          groupBuffer: newBuffer
        });
      });
  }
  async function RemoveGroupMember() {
    if (this.type === "create") {
      this.names.splice(index, 1);
      this.members.splice(index, 1);
      return;
    }
    let id = this.members[index];
    // Parse members & add them to new group obj before sending request
    let url = serverURL.value + "v1/channels/" + group.value.ID + "/members";
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
        store.commit("setGroupBuffer", {
          groupBuffer: newBuffer
        });
      });
  }
  return {
    CreateGroup,
    UpdateGroupDetails,
    GetGroups,
    DeleteGroup,
    AddGroupMember,
    RemoveGroupMember
  };
};
