import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { updateUser } from "../html";
import "../accountStyle.css";

const originalNewDetails = {
    email: "",
    confirmEmail: "",
    password:"",
    confirmPassword:"",
}


const Account = () => {
  const nav = useNavigate();
  const [account, setAccount] = useState(
    JSON.parse(localStorage.getItem("account"))
  );
  const [newDetails, setNewDetails] = useState(originalNewDetails);
  const [content, setContent] = useState("details");
  const [addingPet, setAddingPet] = useState(false);
  const [editing, setEditingPet] = useState(-1);
  const [fileName, setFileName] = useState("");
  const [pet, setPet] = useState({
    name: "",
    file: "",
    species: "",
  });
  const onChangeDetails = (e) => {
    e.preventDefault();
    localStorage.setItem("account", JSON.stringify(account));
    updateUser(account);
  };
  const onAddPet = () => {
    setAccount({ ...account, pets: [...account.pets, pet] });
    setPet({
      name: "",
      file: "",
      species: "",
    });
    setAddingPet(false);
  };
  const onEditPet = () => {
    let tempPets = account.pets;
    tempPets[editing] = pet;

    setAccount({ ...account, pets: tempPets });
    setPet({
      name: "",
      file: "",
      species: "",
    });
    setEditingPet(-1);
  };
  const onUpdateEmail = (e) =>{
    e.preventDefault()
    if(newDetails.confirmEmail === newDetails.email){
        setAccount({...account, email:newDetails.email})
        setNewDetails(originalNewDetails);
    }
  }
  const onUpdatePassword = (e) =>{
      e.preventDefault()
      if(newDetails.confirmPassword === newDetails.password){
        setAccount({...account, password:newDetails.password})
        setNewDetails(originalNewDetails);
    }
  }
  const onSignOut = (e) =>{
    e.preventDefault();
    localStorage.removeItem("account");
    nav("/")
  }
  return (
    <section class="account-section">
      <div class="account-container">
        <div class="account-header">
          <div class="account-header-details">
            {account?.forename ? <h3>Welcome, {account?.forename}!</h3>: <h3>Welcome!</h3>}
            <p>Your Elanco account</p>
          </div>
        </div>
        <div class="account-nav-and-contents">
          <div class="account-nav">
            <a
              class={`nav-link ${content == "details" && "selected"}`}
              id="profile"
              asp-page="./Index"
              onClick={() => setContent("details")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-person"
                viewBox="0 0 16 16"
              >
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
              </svg>
              Profile
            </a>
            <a
              class={`nav-link ${content == "email" && "selected"}`}
              id="email"
              onClick={() => setContent("email")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-at"
                viewBox="0 0 16 16"
              >
                <path d="M13.106 7.222c0-2.967-2.249-5.032-5.482-5.032-3.35 0-5.646 2.318-5.646 5.702 0 3.493 2.235 5.708 5.762 5.708.862 0 1.689-.123 2.304-.335v-.862c-.43.199-1.354.328-2.29.328-2.926 0-4.813-1.88-4.813-4.798 0-2.844 1.921-4.881 4.594-4.881 2.735 0 4.608 1.688 4.608 4.156 0 1.682-.554 2.769-1.416 2.769-.492 0-.772-.28-.772-.76V5.206H8.923v.834h-.11c-.266-.595-.881-.964-1.6-.964-1.4 0-2.378 1.162-2.378 2.823 0 1.737.957 2.906 2.379 2.906.8 0 1.415-.39 1.709-1.087h.11c.081.67.703 1.148 1.503 1.148 1.572 0 2.57-1.415 2.57-3.643zm-7.177.704c0-1.197.54-1.907 1.456-1.907.93 0 1.524.738 1.524 1.907S8.308 9.84 7.371 9.84c-.895 0-1.442-.725-1.442-1.914z" />
              </svg>
              Email
            </a>
            <a  onClick={() => setContent("password")}
              class={`nav-link ${content == "password" && "selected"}`}
              id="change-password"
              asp-page="./ChangePassword"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-lock"
                viewBox="0 0 16 16"
              >
                <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" />
              </svg>
              Password
            </a>

            <form
              
              asp-area="Identity"
              asp-page="/Account/Logout"
              asp-route-returnUrl="/"
            >
              <button onClick={onSignOut}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-door-open"
                  viewBox="0 0 16 16"
                >
                  <path d="M8.5 10c-.276 0-.5-.448-.5-1s.224-1 .5-1 .5.448.5 1-.224 1-.5 1z" />
                  <path d="M10.828.122A.5.5 0 0 1 11 .5V1h.5A1.5 1.5 0 0 1 13 2.5V15h1.5a.5.5 0 0 1 0 1h-13a.5.5 0 0 1 0-1H3V1.5a.5.5 0 0 1 .43-.495l7-1a.5.5 0 0 1 .398.117zM11.5 2H11v13h1V2.5a.5.5 0 0 0-.5-.5zM4 1.934V15h6V1.077l-6 .857z" />
                </svg>
                Log Out
              </button>
            </form>
          </div>
          {content == "details" && (
            <form id="profile-form" method="post" class="account-contents">
              <h1>Profile</h1>
              <div class="account-cards">
                <partial name="_StatusMessage" for="StatusMessage" />
                <div asp-validation-summary="ModelOnly"></div>
                <input asp-for="Account.Id" type="hidden" />
                <input asp-for="Account.User.Id" type="hidden" />
                <div class="account-card">
                  <h4>Personal</h4>
                  <div class="account-card-field">
                    <div class="form-field">
                      <label asp-for="Account.FirstName" class="form-label">
                        First name
                      </label>
                      <input
                        asp-for="Account.FirstName"
                        class="form-control"
                        value={account.forename}
                        onChange={(e) =>
                          setAccount({ ...account, forename: e.target.value })
                        }
                      />
                    </div>
                    <div class="form-field">
                      <label asp-for="Account.LastName" class="form-label">
                        Last name
                      </label>
                      <input
                        asp-for="Account.LastName"
                        class="form-control"
                        value={account.surname}
                        onChange={(e) =>
                          setAccount({ ...account, surname: e.target.value })
                        }
                      />
                    </div>

                    <div class="form-field">
                      <label asp-for="Input.PhoneNumber" class="form-label">
                        Phone
                      </label>
                      <input
                        asp-for="Input.PhoneNumber"
                        class="form-control"
                        value={account.phone}
                        onChange={(e) =>
                          setAccount({ ...account, phone: e.target.value })
                        }
                      />
                      <span asp-validation-for="Input.PhoneNumber"></span>
                    </div>
                  </div>
                </div>
                <div class="account-card">
                  <div class="account-card-header-address">
                    <h4>Your address</h4>
                  </div>
                  <div className="account-card-field">
                    <div class="form-field">
                      <label asp-for="Account.FirstName" class="form-label">
                        Street address
                      </label>
                      <input
                        asp-for="Account.FirstName"
                        class="form-control"
                        value={account.address}
                        onChange={(e) =>
                          setAccount({ ...account, address: e.target.value })
                        }
                      />
                    </div>
                    <div class="form-field">
                      <label asp-for="Account.LastName" class="form-label">
                        City
                      </label>
                      <input
                        asp-for="Account.LastName"
                        class="form-control"
                        value={account.city}
                        onChange={(e) =>
                          setAccount({ ...account, city: e.target.value })
                        }
                      />
                    </div>
                    <div class="form-field">
                      <label asp-for="Username" class="form-label">
                        State
                      </label>
                      <input
                        asp-for="Username"
                        class="form-control"
                        value={account.state}
                        onChange={(e) =>
                          setAccount({ ...account, state: e.target.value })
                        }
                      />
                    </div>
                    <div class="form-field">
                      <label asp-for="Input.PhoneNumber" class="form-label">
                        Zip
                      </label>
                      <input
                        asp-for="Input.PhoneNumber"
                        class="form-control"
                        value={account.zip}
                        onChange={(e) =>
                          setAccount({ ...account, zip: e.target.value })
                        }
                      />
                      <span asp-validation-for="Input.PhoneNumber"></span>
                    </div>
                  </div>
                </div>
                <div class="account-card">
                  <div class="account-card-header">
                    <h4>Your pets</h4>
                    <a
                      onClick={() => {
                        console.log("hello");
                        setAddingPet(true);
                      }}
                      class="account-card-header-cta"
                      asp-page="./AddPet"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-plus"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                      </svg>
                      <div>Add</div>
                    </a>
                  </div>
                  <div class="account-pets-container">
                    {account.pets.map((p, index) => {
                      return (
                        <div key={index} class="account-pet">
                          <input type="hidden" asp-for="@pet.Id" />
                          <img src={p.file} width="140" height="120" />
                          <div class="account-pet-details">
                            <h5>{p.name}</h5>
                            <h6>{p.species}</h6>
                            <a
                              onClick={() => {
                                setPet(account.pets[index]);
                                setEditingPet(index);
                              }}
                              class="account-pet-details-cta"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                class="bi bi-pencil"
                                viewBox="0 0 16 16"
                              >
                                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                              </svg>
                              <p>Edit</p>
                            </a>
                            <a
                              onClick={(e) => {
                                const tempPets = account.pets;
                                tempPets.splice(index, 1);
                                console.log(tempPets);

                                setAccount({ ...account, pet: tempPets });
                              }}
                              class="account-pet-details-cta"
                              asp-page="./DeletePet"
                              asp-route-id="@pet.Id"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                class="bi bi-trash"
                                viewBox="0 0 16 16"
                              >
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                <path
                                  fill-rule="evenodd"
                                  d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                                />
                              </svg>
                              <p>Delete</p>
                            </a>
                          </div>
                        </div>
                      );
                    })}
                    {account.pets.length == 0 && (
                      <div>You currently have no pets added</div>
                    )}
                    {addingPet && (
                      <>
                        <form className="pet-add">
                          <div class="form-field">
                            <label
                              asp-for="Account.FirstName"
                              class="form-label"
                            >
                              Pet name
                            </label>
                            <input
                              asp-for="Account.FirstName"
                              class="form-control"
                              value={pet.name}
                              onChange={(e) =>
                                setPet({ ...pet, name: e.target.value })
                              }
                            />
                          </div>
                          <div class="form-field">
                            <label
                              asp-for="Account.LastName"
                              class="form-label"
                            >
                              Pet Species
                            </label>
                            <input
                              asp-for="Account.LastName"
                              class="form-control"
                              value={pet.species}
                              onChange={(e) =>
                                setPet({ ...pet, species: e.target.value })
                              }
                            />
                          </div>

                          <div
                            style={{ fontSize: "14px", marginBottom: "5px" }}
                          >
                            Pet Photo
                          </div>
                          <div class="pet-image-input">
                            <label
                              asp-for="Account.LastName"
                              class="form-label"
                            >
                              {fileName}
                            </label>
                            <input
                              onChange={(e) => {
                                var filename = e.target.value.replace(/^.*\\/, "");
                                setFileName(filename);
                                let reader = new FileReader();
                                reader.onloadend = () => {
                                  const base64String = reader.result.replace(
                                    ";base64:",
                                    ""
                                  );

                                  setPet({ ...pet, file: base64String });
                                };
                                reader.readAsDataURL(e.target.files[0]);
                              }}
                              type="file"
                              style={{ opacity: "0" }}
                            />
                          </div>
                        </form>
                        <button className="add-pet-button" onClick={onAddPet}>
                          Add pet
                        </button>
                      </>
                    )}
                    {editing >= 0 && (
                      <>
                        <form className="pet-add">
                          <div class="form-field">
                            <label
                              asp-for="Account.FirstName"
                              class="form-label"
                            >
                              Pet name
                            </label>
                            <input
                              asp-for="Account.FirstName"
                              class="form-control"
                              value={pet.name}
                              onChange={(e) =>
                                setPet({ ...pet, name: e.target.value })
                              }
                            />
                          </div>
                          <div class="form-field">
                            <label
                              asp-for="Account.LastName"
                              class="form-label"
                            >
                              Pet Species
                            </label>
                            <input
                              asp-for="Account.LastName"
                              class="form-control"
                              value={pet.species}
                              onChange={(e) =>
                                setPet({ ...pet, species: e.target.value })
                              }
                            />
                          </div>

                          <div
                            style={{ fontSize: "14px", marginBottom: "5px" }}
                          >
                            Pet Photo
                          </div>
                          <div class="pet-image-input">
                            <label
                              asp-for="Account.LastName"
                              class="form-label"
                            >
                              {fileName}
                            </label>
                            <input
                              onChange={(e) => {
                                var filename = e.target.value.replace(/^.*\\/, "");
                                setFileName(filename);
                                let reader = new FileReader();
                                reader.onloadend = () => {
                                  const base64String = reader.result.replace(
                                    ";base64:",
                                    ""
                                  );

                                  setPet({ ...pet, file: base64String });
                                };
                                reader.readAsDataURL(e.target.files[0]);
                              }}
                              type="file"
                              style={{ opacity: "0" }}
                            />
                          </div>
                        </form>
                        <button className="add-pet-button" onClick={onEditPet}>
                          Edit pet
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div class="account-save">
                <Link to="/">Back</Link>
                <button id="update-profile-button" onClick={onChangeDetails}>
                  Save changes
                </button>
              </div>
            </form>
          )}
          {content == "email" && (
            <form id="profile-form"  class="account-contents">
              <h1>Email</h1>
              <div class="account-cards">
                <partial name="_StatusMessage" for="StatusMessage" />
                <div asp-validation-summary="ModelOnly"></div>
                <input asp-for="Account.Id" type="hidden" />
                <input asp-for="Account.User.Id" type="hidden" />
                <div class="account-card">
                  <h4>Personal</h4>
                  <div class="account-card-field">
                    <div class="form-field">
                      <label asp-for="Account.FirstName" class="form-label">
                        Original Email
                      </label>
                      <input
                        asp-for="Account.FirstName"
                        class="form-control"
                        value={account.email}
                        onChange={(e) =>
                          setAccount({ ...account, forename: e.target.value })
                        }
                      />
                    </div>
                    <div class="form-field">
                      <label asp-for="Account.LastName" class="form-label">
                        New Email
                      </label>
                      <input
                        asp-for="Account.LastName"
                        class="form-control"
                        value={newDetails.email}
                        onChange={(e) =>
                          setNewDetails({ ...newDetails, email: e.target.value })
                        }
                      />
                    </div>

                    <div class="form-field">
                      <label asp-for="Input.PhoneNumber" class="form-label">
                        Confirm Email
                      </label>
                      <input
                        asp-for="Input.PhoneNumber"
                        class="form-control"
                        value={newDetails.confirmEmail}
                        onChange={(e) =>
                          setNewDetails({ ...newDetails, confirmEmail: e.target.value })
                        }
                      />
                      <button className="add-pet-button" onClick={onUpdateEmail}>
                          Update Email
                        </button>
                      <span asp-validation-for="Input.PhoneNumber"></span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="account-save">
                <Link to="/">Back</Link>
                <button id="update-profile-button" onClick={onChangeDetails}>
                  Save changes
                </button>
              </div>
            </form>
          )}
          {content == "password" && (
            <form id="profile-form"  class="account-contents">
              <h1>Password</h1>
              <div class="account-cards">
                <partial name="_StatusMessage" for="StatusMessage" />
                <div asp-validation-summary="ModelOnly"></div>
                <input asp-for="Account.Id" type="hidden" />
                <input asp-for="Account.User.Id" type="hidden" />
                <div class="account-card">
                  <h4>Change Password</h4>
                  <div class="account-card-field">

                    <div class="form-field">
                      <label asp-for="Account.LastName" class="form-label">
                        New Password
                      </label>
                      <input type="password"
                        asp-for="Account.LastName"
                        class="form-control"
                        value={newDetails.password}
                        onChange={(e) =>
                          setNewDetails({ ...newDetails, password: e.target.value })
                        }
                      />
                    </div>

                    <div class="form-field">
                      <label asp-for="Input.PhoneNumber" class="form-label">
                        Confirm Password
                      </label>
                      <input  type="password"
                        class="form-control"
                        value={newDetails.confirmPassword}
                        onChange={(e) =>
                          setNewDetails({ ...newDetails, confirmPassword: e.target.value })
                        }
                      />
                      <button className="add-pet-button" onClick={onUpdatePassword}>
                          Update Password
                        </button>
                      <span asp-validation-for="Input.PhoneNumber"></span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="account-save">
                <Link to="/">Back</Link>
                <button id="update-profile-button" onClick={onChangeDetails}>
                  Save changes
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default Account;
