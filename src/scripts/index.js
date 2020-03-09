// The following line makes sure your styles are included in the project. Don't remove this.
import "../styles/main.scss";
import "regenerator-runtime/runtime";
// Import any additional modules you want to include below \/

// \/ All of your javascript should go here \/
const apiKey = process.env.API_KEY;

class CreateRepo {
  constructor() {
    this.form = document.querySelector("form");
    this.attachEventListener();
    this.baseURL = "https://api.github.com/user/repos";
  }

  attachEventListener() {
    this.form.addEventListener("submit", e => {
      e.preventDefault();
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
        console.log("Success:", data);
      })
      .catch(error => {
        console.error("Error:", error);
      });
  }
}

new CreateRepo();
