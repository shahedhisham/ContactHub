let userphotoInput = document.getElementById("photoInput");
let userNameInput = document.getElementById("userName");
let userPhoneInput = document.getElementById("userPhone");
let userEmailInput = document.getElementById("userEmail");
let userAddressInput = document.getElementById("userAddress");
let userGroupInput = document.getElementById("group");
let userNoteInput = document.getElementById("userNote");
let userFavoriteInput = document.getElementById("favorite");
let userEmergencyInput = document.getElementById("emergency");
let searchInput = document.getElementById("searchInput");

let userList = [];
let currentIndex = null;

const phoneRegex = /^01[0125][0-9]{8}$/;
const nameRegex = /^[\u0600-\u06FFa-zA-Z\s]+(?:[\s\u0600-\u06FFa-zA-Z]+){2,}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net|org|edu|gov)$/i;

const nameError = document.getElementById("nameError");
const phoneError = document.getElementById("phoneError");
const emailError = document.getElementById("emailError");




userNameInput.addEventListener("input", function () {
    if (nameRegex.test(this.value.trim())) {
        nameError.classList.add("d-none");
        this.classList.remove("invalid");
    } else {
        nameError.classList.remove("d-none");
        this.classList.add("invalid");
    }
});


userPhoneInput.addEventListener("input", function () {
    if (phoneRegex.test(this.value.trim())) {
        phoneError.classList.add("d-none");
        this.classList.remove("invalid");
    } else {
        phoneError.classList.remove("d-none");
        this.classList.add("invalid");
    }
});


userEmailInput.addEventListener("input", function () {
    if (!this.value || emailRegex.test(this.value.trim())) {
        emailError.classList.add("d-none");
        this.classList.remove("invalid");
    } else {
        emailError.classList.remove("d-none");
        this.classList.add("invalid");
    }
});

function addUser(event) {
    event.preventDefault();

    const name = userNameInput.value.trim();
    const phone = userPhoneInput.value.trim();
    const email = userEmailInput.value.trim();

    if (!nameRegex.test(name)) return;
    if (!phoneRegex.test(phone)) return;
    if (email && !emailRegex.test(email)) return;

    let user = {
        img: userphotoInput.files[0] ? e.target.result : (currentIndex === null ? "/images/profile.png" : userList[currentIndex].img),
        name: name,
        phone: phone,
        email: email,
        address: userAddressInput.value,
        group: userGroupInput.value,
        note: userNoteInput.value,
        fav: userFavoriteInput.checked,
        emerg: userEmergencyInput.checked,
    };

    if (currentIndex === null) {
        userList.push(user);
        Swal.fire("Added", "Contact added successfully!", "success");
    } else {
        userList[currentIndex] = user;
        currentIndex = null;
        Swal.fire("Updated", "Contact updated successfully!", "success");
    }

    localStorage.setItem("userContainer", JSON.stringify(userList));
    displayData();
    favoriteUpdated();
    updateCounters();
    closeModal();
    clearForm();

    if (userphotoInput.files[0]) {
        reader.readAsDataURL(userphotoInput.files[0]);
    } else {

        reader.onload({ target: { result: currentIndex === null ? "/images/profile.png" : userList[currentIndex].img }});
    }
}

function clearForm() {
    userphotoInput.value = "";
    userNameInput.value = "";
    userPhoneInput.value = "";
    userEmailInput.value = "";
    userAddressInput.value = "";
    userGroupInput.value = "Select group";
    userNoteInput.value = "";
    userFavoriteInput.checked = false;
    userEmergencyInput.checked = false;
}

function closeModal() {
    let modalEl = document.getElementById("staticBackdrop");
    let modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();
}

function displayData() {
  let term = searchInput.value.toLowerCase();
  let calls = "";

  for (let i = 0; i < userList.length; i++) {
    if (
      userList[i].name.toLowerCase().includes(term) ||
      userList[i].phone.includes(term) ||
      userList[i].email.toLowerCase().includes(term)
    ) {
      calls += `
        <div class="col-6">
          <div class="card">
            <div class="card-body">
              <div class="profile d-flex gap-2">
                <div class="profile-user position-relative d-inline-block">
                  <img src="${userList[i].img}" alt="${userList[i].name}">
                  ${userList[i].fav ? `<span class="star position-absolute"><i class="fa-solid fa-star text-white"></i></span>` : ''}
                  ${userList[i].emerg ? `<span class="heart position-absolute"><i class="fa-solid fa-heart-pulse text-white"></i></span>` : ''}
                </div>
                <div class="user-info pt-2">
                  <h3>${userList[i].name}</h3>
                  <small><i class="fa-solid fa-phone"></i>${userList[i].phone}</small>
                </div>
              </div>

              <div class="user-body">
                <p class="my-3"><i class="fa-solid fa-envelope"></i>${userList[i].email}</p>
                <p class="mb-2"><i class="fa-solid fa-location-dot"></i>${userList[i].address}</p>
              </div>

              <div class="user-status mt-1">
                <span class="group-status">${userList[i].group}</span>
                ${userList[i].emerg ? `<span class="Emergency-status"><i class="fa-solid fa-heart-pulse"></i>Emergency</span>` : ''}
              </div>
            </div>

            <div class="card-footer d-flex justify-content-between align-items-center">
              <div class="contact-info d-flex gap-2">
                <a href="tel:${userList[i].phone}" class="phone"><i class="fa-solid fa-phone"></i></a>
                <a href="mailto:${userList[i].email}" class="email"><i class="fa-solid fa-envelope"></i></a>
              </div>

              <div class="updats-status d-flex gap-2">
                <button onclick="toggleFavorite(${i})" class="fav"><i class="fa-solid fa-star"></i></button>
                <button onclick="toggleEmergency(${i})" class="emerg"><i class="fa-solid fa-heart-pulse"></i></button>
                <button onclick="setUpdateInfo(${i})" class="edit"><i class="fa-solid fa-pen"></i></button>
                <button onclick="deleteItem(${i})" class="delete"><i class="fa-solid fa-trash"></i></button>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  }

  document.getElementById("rowData").innerHTML = calls;
  const emptyState = document.querySelector(".text-center.mt-5.p-5");
  if (calls === "") {
    emptyState.classList.remove("d-none"); 
  } else {
    emptyState.classList.add("d-none"); 
  }
}

function toggleFavorite(index) {
  userList[index].fav = !userList[index].fav;
  localStorage.setItem("userContainer", JSON.stringify(userList));
  favoriteUpdated();
  displayData();
  updateCounters(); 
}

function toggleEmergency(index) {
  userList[index].emerg = !userList[index].emerg;
  localStorage.setItem("userContainer", JSON.stringify(userList));
  favoriteUpdated();
  displayData();
  updateCounters();
}

function deleteItem(index) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  }).then((result) => {
    if (result.isConfirmed) {

      userList.splice(index, 1);
      localStorage.setItem("userContainer", JSON.stringify(userList));

      displayData();
      favoriteUpdated();
      updateCounters();

      Swal.fire({
        title: "Deleted!",
        text: "Contact has been deleted.",
        icon: "success"
      });
    }
  });
}

function setUpdateInfo(index) {
  currentIndex = index;
  let user = userList[index];

  userNameInput.value = user.name;
  userPhoneInput.value = user.phone;
  userEmailInput.value = user.email;
  userAddressInput.value = user.address;
  userGroupInput.value = user.group;
  userNoteInput.value = user.note;
  userFavoriteInput.checked = user.fav;
  userEmergencyInput.checked = user.emerg;

  let modal = new bootstrap.Modal(document.getElementById("staticBackdrop"));
  modal.show();
  
}

function updateCounters() {
  let total = userList.length;
  let favorites = userList.filter(u => u.fav).length;
  let emergency = userList.filter(u => u.emerg).length;

  document.querySelector("#total-number h2").textContent = total;
  document.querySelector("#favorites-number").textContent = favorites;
  document.querySelector("#emergency-number").textContent = emergency;
  document.querySelector(".all-contacts-title p span").textContent = total;
}

function favoriteUpdated() {
  let favBox = "";
  let emergBox = "";

  userList.forEach((user) => {
    if (user.fav) {
      favBox += `
        <div class="col-sm-6 col-md-6 col-lg-12">
          <div class="card">
            <div class="profile d-flex gap-2 justify-content-between">
              <div class="profile-man d-flex gap-2">
                <div class="profile-user">
                  <img src="${user.img}" alt="${user.name}">
                </div>
                <div class="user-info pt-1">
                  <h3>${user.name}</h3>
                  <small>${user.phone}</small>
                </div>
              </div>
              <div class="call-btn text-end">
                <a href="tel:${user.phone}" class="phone"><i class="fa-solid fa-phone"></i></a>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    if (user.emerg) {
      emergBox += `
        <div class="col-sm-6 col-md-6 col-lg-12">
          <div class="card">
            <div class="profile d-flex gap-2 justify-content-between">
              <div class="profile-man d-flex gap-2">
                <div class="profile-user">
                  <img src="${user.img}" alt="${user.name}">
                </div>
                <div class="user-info pt-1">
                  <h3>${user.name}</h3>
                  <small>${user.phone}</small>
                </div>
              </div>
              <div class="call-btn text-end">
                <a href="tel:${user.phone}" class="phone"><i class="fa-solid fa-phone"></i></a>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  });

  document.getElementById("favoritesBox").innerHTML = favBox;
  document.getElementById("emergencyBox").innerHTML = emergBox;

  const emptyBox = document.querySelector(".empty-box");
  if (favBox  === "") {
    emptyBox.classList.remove("d-none"); 
  } else {
    emptyBox.classList.add("d-none"); 
  }

  const emptyBoxEmg = document.querySelector(".empty-box-emg");
  if (emergBox  === "") {
    emptyBoxEmg.classList.remove("d-none"); 
  } else {
    emptyBoxEmg.classList.add("d-none"); 
  }
} 