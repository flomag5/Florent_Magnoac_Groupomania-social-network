<template>
  <div>
    <HeaderLogin />
    <div class="card">
      <h1 class="card_title" v-if="mode == 'login'">Connexion</h1>
      <h1 class="card_title" v-else>Inscription</h1>
      <p class="card_subtitle" v-if="mode == 'login'">
        Vous n'avez pas encore de compte?
        <span class="card__action" @click="switchToCreateAccount()"
          >Créer un compte</span
        >
      </p>
      <p class="card__subtitle" v-else>
        Déjà membre?
        <span class="card__action" @click="switchToLogin()">Se connecter</span>
      </p>
      <div class="form-row" v-if="mode == 'create'">
        <input
          v-model="firstName"
          class="form-row__input"
          type="text"
          aria-label="Prénom"
          placeholder="Prénom"
        />
        <input
          v-model="lastName"
          class="form-row__input"
          type="text"
          aria-label="Nom de famille"
          placeholder="Nom"
        />
      </div>
      <div class="form-row">
        <input
          v-model="email"
          class="form-row__input"
          type="text"
          aria-label="Adresse e-mail"
          placeholder="Adresse mail"
        />
      </div>
      <div class="form-row">
        <input
          v-model="password"
          class="form-row__input"
          type="password"
          aria-label="Mot de passe"
          placeholder="Mot de passe"
          minlength="8"
        />
      </div>
      <div class="form-row" v-if="mode == 'login' && status == 'error_login'">
        Email ou mot de passe invalide
      </div>
      <div class="form-row" v-if="mode == 'create' && status == 'error_create'">
        Informations non valides
      </div>
      <div class="form-row">
        <button
          @click="login()"
          class="button"
          :class="{ 'button--disabled': !validatedFields }"
          v-if="mode == 'login'"
        >
          <span v-if="status == 'loading'">Connexion en cours...</span>
          <span v-else>Connexion</span>
        </button>
        <button
          @click="createAccount()"
          class="button"
          :class="{ 'button--disabled': !validatedFields }"
          v-else
        >
          <span v-if="status == 'loading'">Création en cours...</span>
          <span v-else>Créer mon compte</span>
        </button>
      </div>
    </div>
  </div>
</template>


<script>
import { mapState } from "vuex";
import HeaderLogin from "../components/HeaderLogin.vue";

export default {
  name: "Login",
  components: {
    HeaderLogin,
  },
  data: function () {
    return {
      mode: "login",
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      isAdmin: null,
    };
  },

  computed: {
    validatedFields: function () {
      if (this.mode == "create") {
        if (
          this.email != "" &&
          this.firstName != "" &&
          this.lastName != "" &&
          this.password != ""
        ) {
          return true;
        } else {
          return false;
        }
      } else {
        if (this.email != "" && this.password != "") {
          return true;
        } else {
          return false;
        }
      }
    },
    ...mapState(["status"]),
  },
  methods: {
    switchToCreateAccount: function () {
      this.mode = "create";
    },
    switchToLogin: function () {
      this.mode = "login";
    },

    // ----- LOGIN USER ----- //
    login: function () {
      // const self = this;
      this.$store
        .dispatch("login", {
          email: this.email,
          password: this.password,
        })
        .then(function () {
          //self.$router.push("/posts");
          //self.$router.push({ name: "AllPosts" });
          window.location.href = "posts";
        }),
        function (error) {
          console.log(error);
        };
    },

    // ----- SIGN UP USER ----- //
    createAccount: function () {
      const self = this;
      /* déclaration de nos regex de contrôle */
      const regexEmail =
        /^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$/;
      const regexPassword = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,50}$/;
      /* contrôle de l'email et mot de passe */
      if (this.email === "") {
        alert("Veuillez remplir votre adresse email");
      } else if (regexEmail.test(this.email) === false) {
        alert("Veuillez écrire une adresse email valide");
      }
      if (this.password === "") {
        alert("Veuillez remplir votre mot de passe");
      } else if (regexPassword.test(this.password) === false) {
        alert(
          "Mot de passe invalide, il doit contenir 8 caractères minimum et au moins une majuscule, un chiffre"
        );
      }
      /* envoi des informations pour création du compte */
      this.$store
        .dispatch("createAccount", {
          email: this.email,
          firstName: this.firstName,
          lastName: this.lastName,
          password: this.password,
        })
        .then(
          function () {
            self.login();
          },
          function (error) {
            console.log(error);
          }
        );
    },
  },
};
</script>


<style scoped lang="scss">
.form-row {
  display: flex;
  margin: 16px 0px;
  gap: 16px;
  flex-wrap: wrap;
}
.form-row__input {
  padding: 8px;
  border: none;
  border-radius: 8px;
  background: #f2f2f2;
  font-weight: 500;
  font-size: 16px;
  flex: 1;
  min-width: 100px;
  color: black;
}
.form-row__input::placeholder {
  color: #aaaaaa;
}
.card {
  max-width: 100%;
  width: 540px;
  background: white;
  border-radius: 16px;
  padding: 32px;
}
.card__title {
  text-align: center;
  font-weight: 800;
}
.card__subtitle {
  text-align: center;
  color: #666;
  font-weight: 500;
}
.button {
  background: #1f31ff;
  color: white;
  border-radius: 8px;
  font-weight: 800;
  font-size: 15px;
  border: none;
  width: 100%;
  padding: 16px;
  transition: 0.4s background-color;
}
.card__action {
  color: #4825f6;
  text-decoration: underline;
}
.card__action:hover {
  cursor: pointer;
}
.button:hover {
  cursor: pointer;
  background: #1976d2;
}
.button--disabled {
  background: #4d4d4d;
  color: #ececec;
}
.button--disabled:hover {
  cursor: not-allowed;
  background: #cecece;
}
@media screen and (max-width: 562px) {
  .card {
    max-width: 100%;
    width: 340px;
  }
}
</style>