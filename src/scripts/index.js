// The following line makes sure your styles are included in the project. Don't remove this.
import "../styles/main.scss";
import "regenerator-runtime/runtime";
import moment from "moment";
// Import any additional modules you want to include below \/

// \/ All of your javascript should go here \/
const apiKey = process.env.API_KEY;

class CreateRepo {
  constructor() {
    this.baseURL = "https://api.github.com/user/repos";
    this.sortedURL = "https://api.github.com/user/repos?sort=created";
    this.userURL = "https://api.github.com/user";
    this.form = document.querySelector("form");
    this.generateRepoList();
    this.attachEventListener();
    this.displayUser();
  }

  displayUser() {
    fetch(this.userURL, {
      method: "GET",
      headers: {
        Authorization: `token ${apiKey}`
      }
    })
      .then(response => response.json())

      .then(data => {
        let loggedUser = `
          <span class="signedIn"> Signed in as ${data.login}</span>
          <img
          class="user-img"
          src="${data.avatar_url}"
          alt=""
          />
          `;
        document.querySelector(".user").innerHTML = loggedUser;
      })
      .catch(error => {
        console.error("Error:", error);
      });
  }

  generateRepoList() {
    document.querySelector(".list-container").innerHTML = "";
    fetch(this.sortedURL, {
      method: "GET",
      headers: {
        Authorization: `token ${apiKey}`
      }
    })
      .then(response => response.json())
      .then(data => {
        data.forEach(element => {
          let repoListItem = `
            <li>
            <div class="repo-headline-container">
              <h3>${element.name}</h3>
              <p class="date-created">${moment(element.created_at).format(
                "MMM Do YYYY"
              )}</p>
            </div>
            <p>${element.description}</p>
            </li>
            `;
          document.querySelector(".list-container").innerHTML += repoListItem;
        });
      })
      .catch(error => {
        console.error("Error:", error);
      });
  }

  attachEventListener() {
    this.form.addEventListener("submit", e => {
      e.preventDefault();
      document.querySelector(".list-container").style.display = "none";
      document.querySelector(".sk-cube-grid").classList.add("visible");
      const repoName = document.querySelector(".repo-name").value;
      const description = document.querySelector(".description").value;
      const privacyType = this.form.elements.repoPrivacy;
      const readmeCheckbox = document.querySelector(".readme").checked;
      this.submitRepo({
        name: repoName,
        description: description,
        private: privacyType,
        auto_init: readmeCheckbox
      });
      document.querySelectorAll(".btn").forEach(button => {
        button.disabled = true;
      });
      this.form.reset();
    });
  }

  submitRepo(data) {
    fetch(this.baseURL, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        Authorization: `token ${apiKey}`
      }
    })
      .then(response => response.json())
      .then(data => {
        document.querySelector(".sk-cube-grid").classList.remove("visible");
        document.querySelector(".list-container").style.display = "block";

        console.log("Success:", data);
        this.generateRepoList();
        document.querySelectorAll(".btn").forEach(button => {
          button.disabled = false;
        });
      })
      .catch(error => {
        console.error("Error:", error);
      });
  }
}

new CreateRepo();
