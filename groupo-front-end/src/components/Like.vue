<template>
  <div v-if="likes">
    <button
      v-if="likes.findIndex((like) => like.userId == userMe.userId) == -1"
      @click="likePost(postId)"
      class="btn"
    >
      <i class="far fa-thumbs-up likeBtn like"></i>
      {{ likes.length }}
    </button>
    <button v-else @click="unlikePost(postId)" class="btn">
      <i class="far fa-thumbs-up likeBtn liked"></i>
      {{ likes.length }}
    </button>
  </div>
</template>

<script>
export default {
  name: "Likes",
  props: {
    postId: Number,
    userId: Number,
  },
  data() {
    return {
      likes: [],
      liked: null,
      userMe: -1,
    };
  },
  methods: {
    // ----- LIKE D'UN POST ----- //
    likePost(postId) {
      let user = JSON.parse(localStorage.getItem("user"));
      const data = {
        like: true,
        userId: user.userId,
        postId: postId,
      };
      fetch(`http://localhost:3000/api/posts/${JSON.stringify(postId)}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((data) => this.likes.push(data))
        .catch((error) => console.log(error));
      /** user a liké le post */
      this.liked = true;
    },

    // ----- UNLIKE D'UN POST ----- //
    unlikePost(postId) {
      let user = JSON.parse(localStorage.getItem("user"));
      const data = {
        like: false,
        userId: user.userId,
        postId: postId,
      };

      fetch(
        `http://localhost:3000/api/posts/${JSON.stringify(postId)}/unlike`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      this.likes = this.likes.filter((like) => like.userId != user.userId);
      this.liked = false;
    },
  },

  /**récupération du user pour checker son statut like par rapport au post */
  created() {
    this.userMe = JSON.parse(localStorage.getItem("user"));

    console.log(this.userMe, "USERMEEEEEE");
    console.log("POSTID", this.postId);
    fetch(
      `http://localhost:3000/api/posts/${JSON.stringify(this.postId)}/likes`
    )
      .then((response) => response.json())

      .then((data) => {
        console.log(data);
        this.likes = data;
      });
  },
};
</script>

<style scoped>
button {
  background: none;
  border-style: none;
  outline: none;
  /*width: 20%;*/
}
p {
  margin: 1rem 0 1rem 0;
}
.liked {
  color: white;
  background-color: #3174e4;
  border: 1px solid #3174e4;
  border-radius: 50%;
  padding: 0.5rem;
}
.like {
  color: #3174e4;
  background-color: white;
  border: 1px solid #3174e4;
  border-radius: 50%;
  padding: 0.5rem;
}
i {
  margin-right: 4px;
}
</style>