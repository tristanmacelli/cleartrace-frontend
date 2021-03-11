import axios from "axios";

import { computed, ref, watch } from "vue";
import { useStore } from "vuex";

export const Messages = () => {
  const store = useStore();
  const body = ref("");
  const group = computed(() => store.state.group);
  const messageList = ref([]);
  const serverURL = computed(() => store.state.serverURL);
  const user = computed(() => store.state.user);

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
      })
      .catch(error => {
        alert(error);
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
      .then(() => {
        body.value = "";
        // TODO: Local function call
        this.updateScroll();
      })
      .catch(error => {
        alert(error);
      });
  }

  return {
    body,
    group,
    messageList,
    SendMessage,
    GetMessages
  };
};

export const Groups = () => {
  const store = useStore();
  const awaitingGroupDetails = ref(false);
  const general = computed(() => store.state.general);
  const group = ref({});
  const groups = ref([]);
  const members = ref([]);
  const memberIDs = computed(() => members.value.forEach(member => member.id));
  const memberNames = computed(() =>
    members.value.forEach(member => member.name)
  );
  const serverURL = computed(() => store.state.serverURL);
  const type = ref("");

  watch(group.value, (newVal, oldVal) => {
    if (this.type != "update") {
      return;
    }
    let updatedGroupDetails =
      oldVal.description !== "" &&
      oldVal.name !== "" &&
      newVal.name != oldVal.name &&
      newVal.description != oldVal.description;
    if (!updatedGroupDetails) {
      return;
    }
    if (!awaitingGroupDetails.value) {
      setTimeout(() => {
        this.UpdateGroupDetails();
        awaitingGroupDetails.value = false;
      }, 1000); // 1 sec delay
    }
    awaitingGroupDetails.value = true;
  });

  async function GetSpecificGroup(groupName) {
    var url = serverURL.value + "v1/channels?startsWith=" + groupName;
    let sessionToken = localStorage.getItem("auth");
    // send a get request with the above data
    let groups = await axios
      .get(url, {
        headers: {
          Authorization: sessionToken
        }
      })
      .then(response => {
        return response.data;
      })
      .catch(error => {
        alert(error);
      });
    return groups;
  }

  async function GetGeneralGroup() {
    let groups = await GetSpecificGroup("General");
    let general = groups[0];
    store.commit("setGroup", {
      group: general
    });
    store.commit("setGeneral", {
      group: general
    });
  }

  async function CreateGroup() {
    if (members.value.length == 0) {
      alert("Error: Invalid New Group Input");
      return;
    }
    let url = serverURL.value + "v1/channels";
    let sessionToken = localStorage.getItem("auth");
    let names = memberNames.value.toString();
    let ids = memberIDs.value.toString();
    let date = new Date();
    // title = title.substring(1, title.length - 2);
    // Create Group object
    let groupObject = {
      name: names,
      description: "*~Enter a description~*",
      private: true,
      members: ids,
      createdAt: date,
      editedAt: null
    };
    axios
      .post(url, groupObject, {
        headers: {
          Authorization: sessionToken
        }
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
      })
      .catch(error => {
        alert(error);
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
      })
      .catch(error => {
        alert(error);
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
      })
      .catch(error => {
        alert(error);
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
      });
  }
  async function AddGroupMember(newMember) {
    if (this.type === "create") {
      let member = {
        id: newMember.id,
        name: newMember.text
      };
      this.members.push(member);
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
      .then(response => {
        let member = {
          id: newMember.id,
          name: newMember.text
        };
        this.members.push(member);
        // The type field allows groupList to properly consume the changes to the group
        let newBuffer = {
          group: response.data,
          type: "update",
          showModal: false
        };
        store.commit("setGroupBuffer", {
          groupBuffer: newBuffer
        });
      })
      .catch(error => {
        alert(error);
      });
  }
  async function RemoveGroupMember(index) {
    if (this.type === "create") {
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
      .then(response => {
        // The type field allows groupList to properly consume the changes to the group
        this.members.splice(index, 1);
        let newBuffer = {
          message: response.data,
          type: "update",
          showModal: false
        };
        store.commit("setGroupBuffer", {
          groupBuffer: newBuffer
        });
      })
      .catch(error => {
        alert(error);
      });
  }
  return {
    group,
    groups,
    members,
    memberNames,
    type,
    GetSpecificGroup,
    GetGeneralGroup,
    CreateGroup,
    UpdateGroupDetails,
    GetGroups,
    DeleteGroup,
    AddGroupMember,
    RemoveGroupMember
  };
};
