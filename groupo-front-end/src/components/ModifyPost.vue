<template>
  <div id="modifyPost">
    <form @submit.prevent="modifyPost">
      <div id="btns">
        <label for="file">Choisir une nouvelle image</label>
        <input
          type="file"
          ref="image"
          name="image"
          class="upload"
          id="file"
          @change="updateFile"
        />
      </div>
      <div id="fileContainer">
        <img id="preview" :src="post.image" :alt="post.image" v-if="preview" />
        <p v-else>Ce post ne possède pas d'image</p>
      </div>
      <div id="text">
        <label for="textarea">Changer titre</label>
        <textarea name="textarea" v-model="post.title"></textarea>
      </div>
      <div id="text">
        <label for="textarea">Changer votre texte</label>
        <textarea name="textarea" v-model="post.content"></textarea>
      </div>
      <div id="modify">
        <input type="submit" value="modifier" class="btn" />
      </div>
      <p>{{ errMsg }}</p>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import router from "../router";
export default {
  name: "modify-post",
  beforeCreate() {
    let user = JSON.parse(localStorage.getItem("user"));
    const postId = this.$route.params.id;
    /* récupération du post ciblé selon id */
    fetch(`http://localhost:3000/api/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        data.file ? (this.preview = true) : (this.preview = false);
        this.post = { ...data };
      })
      .catch((error) => {
        error;
      });
  },
  data() {
    return {
      post: {},
      newFile: "",
      preview: null,
      errMsg: null,
    };
  },
  methods: {
    /** récupération du fichier image avant la modification */
    updateFile(event) {
      this.newFile = this.$refs.image.files[0];
      let input = event.target;
      if (input.files) {
        let reader = new FileReader();
        reader.onload = (e) => {
          document.getElementById("preview").src = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
        this.preview = true;
      }
    },
    /** modification du post */
    async modifyPost() {
      let user = JSON.parse(localStorage.getItem("user"));
      if (!this.post.content) {
        this.errMsg =
          "Error => vous devez remplir le champ <message> pour créer une nouvelle publication!";
        return;
      }

      let formData = new FormData();
      formData.append("title", this.post.title);
      formData.append("content", this.post.content);
      if (this.newFile) {
        formData.append("image", this.newFile);
      }

      if (confirm("êtes vous sûr de vouloir modifier votre post ?")) {
        const postId = this.$route.params.id;
        axios
          .put(`http://localhost:3000/api/posts/${postId}`, formData, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          })
          .then((res) => {
            console.log(res.data);
            router.push({ path: "/posts" });
          })
          .catch((error) => console.log(error));
      }
    },
  },
};
</script>

<style scoped>
#modifyPost {
  max-width: 100%;
  box-shadow: 2px 2px 8px 5px rgb(0 0 0 / 10%);
  margin: auto;
  margin-top: 2rem;
  padding: 1rem;
  border-radius: 4px;
  background-color: white;
}
form {
  display: flex;
  flex-direction: column;
}
#fileContainer {
  overflow: hidden;
  margin: 1rem 0 1rem 0;
}
img {
  height: 100%;
  width: 100%;
  object-fit: cover;
}
#btns {
  display: flex;
  flex-direction: column;
}
#file {
  cursor: pointer;
}
#text {
  display: flex;
  flex-direction: column;
}
label {
  margin: 1rem;
  padding: 0.5rem 0;
  text-align: center;
  border-radius: 8px;
  box-shadow: 2px 2px 8px 5px rgb(0 0 0 / 10%);
}
textarea {
  padding: 16px;
}
#modify {
  text-align: right;
}
.btn {
  background-color: #1c68e6;
  border-style: none;
  outline: none;
  width: 30%;
  border-radius: 8px;
  height: 40px;
  color: white;
  margin: 1rem 0 1rem 0;
}
@media screen and (max-width: 992px) {
  #modifyPost {
    max-width: 90%;
  }
}
</style>
