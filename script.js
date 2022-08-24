const ROOT_API_URL = "https://api.github.com/users/";
const form = document.getElementById("form");
const search = document.getElementById("search");
const card = document.getElementById("card");

const getUser = async (username) => {
  try {
    const { data } = await axios.get(ROOT_API_URL + username);
    // console.log(data);
    createCard(data);
    getRepos(username);
  } catch (err) {
    console.log(err);
    if (err.response.status == 404 || err.response.status == 503) {
      createErrorCard(`No profile found with username ${username}`);
    }
  }
};

const getRepos = async (username) => {
  try {
    const { data } = await axios.get(
      ROOT_API_URL + username + "/repos?sort=created"
    );
    addReposToCard(data);
  } catch (err) {
    console.log("Something went wrong in fetching repos");
  }
};

const addReposToCard = (data) => {
  const repos = document.getElementById("repos");
  data.slice(0, 10).forEach((repo) => {
    const repoEl = document.createElement("a");
    repoEl.classList.add("repo");
    repoEl.href = repo.html_url;
    repoEl.target = "_blank";
    repoEl.innerText = repo.name;

    repos.appendChild(repoEl);
  });
  // console.log(data);
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const user = search.value;
  if (user) {
    getUser(user);
    search.value = "";
  }
});

const createCard = (user) => {
  const cardHTML = `
    <div class ="card_container">
    <img
    src="${user.avatar_url}"
    alt="${user.username}"
    class="avatar"
  />
  <div class="user_details">
    <h2>${user.name}</h2>
    <p>
    ${user.bio}
    </p>
    <ul>
      <li>${user.followers}<strong>Followers</strong></li>
      <li>${user.following}<strong>Following</strong></li>
      <li>${user.public_repos}<strong>Repos</strong></li>
    </ul>
    <div id="repos">
    </div>
  </div>
  </div>`;

  card.innerHTML = cardHTML;
};

const createErrorCard = (message) => {
  const errorHTML = `
    <h1>${message} </h1>
    `;
  card.innerHTML = errorHTML;
};
