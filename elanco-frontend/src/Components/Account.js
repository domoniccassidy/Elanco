import React, { useState } from 'react'
import { updateUser } from '../html'
import "../accountStyle.css"

const Account = () => {
    const [account,setAccount] = useState(JSON.parse(localStorage.getItem("account")))
    const [addingPet,setAddingPet] = useState(false);
    const [fileName,setFileName] = useState("")
    const[pet,setPet] = useState({
        name:"",
        file:"",
        species:""
    })
    const onChangeDetails = (e) =>{
        e.preventDefault();
        localStorage.setItem("account",JSON.stringify(account))
        updateUser(account);
    }
    const onAddPet = () =>{
        setAccount({...account,pets:[...account.pets,pet]})
        setPet({
                name:"",
                file:"",
                species:""
            })
        setAddingPet(false)
    }

  return (
    <section class="account-section">
        <div class="account-container">
            <div class="account-header">
                <div class="account-header-details">
                    <h3>Welcome, {account?.forename}!</h3>
                    <p>Your Elanco account</p>
                </div>
            </div>
            <div class="account-nav-and-contents">
                <div class="account-nav">
                    <a class="nav-link @ManageNavPages.IndexNavClass(ViewContext)" id="profile" asp-page="./Index" >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person" viewBox="0 0 16 16">
                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                        </svg>
                        Profile
                    </a>
                    <a class="nav-link @ManageNavPages.EmailNavClass(ViewContext)" id="email" asp-page="./Email" >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-at" viewBox="0 0 16 16">
                        <path d="M13.106 7.222c0-2.967-2.249-5.032-5.482-5.032-3.35 0-5.646 2.318-5.646 5.702 0 3.493 2.235 5.708 5.762 5.708.862 0 1.689-.123 2.304-.335v-.862c-.43.199-1.354.328-2.29.328-2.926 0-4.813-1.88-4.813-4.798 0-2.844 1.921-4.881 4.594-4.881 2.735 0 4.608 1.688 4.608 4.156 0 1.682-.554 2.769-1.416 2.769-.492 0-.772-.28-.772-.76V5.206H8.923v.834h-.11c-.266-.595-.881-.964-1.6-.964-1.4 0-2.378 1.162-2.378 2.823 0 1.737.957 2.906 2.379 2.906.8 0 1.415-.39 1.709-1.087h.11c.081.67.703 1.148 1.503 1.148 1.572 0 2.57-1.415 2.57-3.643zm-7.177.704c0-1.197.54-1.907 1.456-1.907.93 0 1.524.738 1.524 1.907S8.308 9.84 7.371 9.84c-.895 0-1.442-.725-1.442-1.914z"/>
                        </svg>
                        Email
                    </a>
                    <a class="nav-link @ManageNavPages.ChangePasswordNavClass(ViewContext)" id="change-password" asp-page="./ChangePassword" >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-lock" viewBox="0 0 16 16">
                        <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/>
                        </svg>
                        Password
                    </a>
                    <a class="nav-link @ManageNavPages.ExternalLoginsNavClass(ViewContext)" asp-page="./ExternalLogins" >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-in-right" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0v-2z"/>
                        <path fill-rule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                        </svg>
                        External Logins
                    </a>
                    <a class="nav-link @ManageNavPages.TwoFactorAuthenticationNavClass(ViewContext)" id="two-factor" asp-page="./TwoFactorAuthentication" >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-shield-lock" viewBox="0 0 16 16">
                        <path d="M5.338 1.59a61.44 61.44 0 0 0-2.837.856.481.481 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.725 10.725 0 0 0 2.287 2.233c.346.244.652.42.893.533.12.057.218.095.293.118a.55.55 0 0 0 .101.025.615.615 0 0 0 .1-.025c.076-.023.174-.061.294-.118.24-.113.547-.29.893-.533a10.726 10.726 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.775 11.775 0 0 1-2.517 2.453 7.159 7.159 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7.158 7.158 0 0 1-1.048-.625 11.777 11.777 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 62.456 62.456 0 0 1 5.072.56z"/>
                        <path d="M9.5 6.5a1.5 1.5 0 0 1-1 1.415l.385 1.99a.5.5 0 0 1-.491.595h-.788a.5.5 0 0 1-.49-.595l.384-1.99a1.5 1.5 0 1 1 2-1.415z"/>
                        </svg>
                        Security
                    </a>
                    <a class="nav-link @ManageNavPages.PersonalDataNavClass(ViewContext)" id="personal-data" asp-page="./PersonalData" >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                        <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                        </svg>
                        Privacy
                    </a>
                    <form method="post" asp-area="Identity" asp-page="/Account/Logout" asp-route-returnUrl="/">
                        <button type="submit">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-door-open" viewBox="0 0 16 16">
                            <path d="M8.5 10c-.276 0-.5-.448-.5-1s.224-1 .5-1 .5.448.5 1-.224 1-.5 1z"/>
                            <path d="M10.828.122A.5.5 0 0 1 11 .5V1h.5A1.5 1.5 0 0 1 13 2.5V15h1.5a.5.5 0 0 1 0 1h-13a.5.5 0 0 1 0-1H3V1.5a.5.5 0 0 1 .43-.495l7-1a.5.5 0 0 1 .398.117zM11.5 2H11v13h1V2.5a.5.5 0 0 0-.5-.5zM4 1.934V15h6V1.077l-6 .857z"/>
                            </svg>
                            Log Out
                        </button>
                    </form>
                </div>
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
                                    <label asp-for="Account.FirstName" class="form-label" >First name</label>
                                    <input asp-for="Account.FirstName" class="form-control"value = {account.forename} onChange={(e) => setAccount({...account,forename:e.target.value})} />
                                </div>
                                <div class="form-field">
                                    <label asp-for="Account.LastName" class="form-label">Last name</label>
                                    <input asp-for="Account.LastName" class="form-control"  value = {account.surname} onChange={(e) => setAccount({...account,surname:e.target.value})}/>
                                </div>
                                <div class="form-field">
                                    <label asp-for="Username" class="form-label" >Email</label>
                                    <input asp-for="Username" class="form-control" disabled value = {account.email} onChange={(e) => setAccount({...account,email:e.target.value})}/>
                                    <p>Want to change your email? <a asp-page="./Email">Click here</a></p>
                                </div>
                                <div class="form-field">
                                    <label asp-for="Input.PhoneNumber" class="form-label" >Phone</label>
                                    <input asp-for="Input.PhoneNumber" class="form-control" value = {account.phone} onChange={(e) => setAccount({...account,phone:e.target.value})}/>
                                    <span asp-validation-for="Input.PhoneNumber"></span>
                                </div>
                            </div>
                        </div>
                        <div class="account-card">
                            <div class="account-card-header-address">
                                <h4>Your address</h4>
                               
                            </div>
                            <div className="account-card-field"><div class="form-field">
                                    <label asp-for="Account.FirstName" class="form-label" >Street address</label>
                                    <input asp-for="Account.FirstName" class="form-control"value = {account.address} onChange={(e) => setAccount({...account,address:e.target.value})} />
                                </div>
                                <div class="form-field">
                                    <label asp-for="Account.LastName" class="form-label">City</label>
                                    <input asp-for="Account.LastName" class="form-control"  value = {account.city} onChange={(e) => setAccount({...account,city:e.target.value})}/>
                                </div>
                                <div class="form-field">
                                    <label asp-for="Username" class="form-label" >State</label>
                                    <input asp-for="Username" class="form-control"  value = {account.state} onChange={(e) => setAccount({...account,state:e.target.value})}/>
                                </div>
                                <div class="form-field">
                                    <label asp-for="Input.PhoneNumber" class="form-label" >Zip</label>
                                    <input asp-for="Input.PhoneNumber" class="form-control" value = {account.zip} onChange={(e) => setAccount({...account,zip:e.target.value})}/>
                                    <span asp-validation-for="Input.PhoneNumber"></span>
                                </div></div>
                            
                        </div>
                        <div class="account-card">
                            <div class="account-card-header">
                                <h4>Your pets</h4>
                                <a class="account-card-header-cta" asp-page="./AddPet">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
                                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                                    </svg>
                                    <div onClick={() => {console.log("hello"); setAddingPet(true)}}>Add</div>
                                </a>
                            </div>
                            <div class="account-pets-container">
                                {account.pets.map((p)=>{
                                    return(<div class="account-pet">
                                    <input type="hidden" asp-for="@pet.Id" />
                                    <img src={p.file} width="140" height="120"/>
                                    <div class="account-pet-details">
                                        <h5>{p.name}</h5>
                                        <a class="account-pet-details-cta" asp-page="./EditPet" asp-route-id="@pet.Id">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                                            </svg>
                                            <p>Edit</p>
                                        </a>
                                        <a class="account-pet-details-cta" asp-page="./DeletePet" asp-route-id="@pet.Id">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                            </svg>
                                            <p>Delete</p>
                                        </a>
                                    </div>
                                </div>)
                                })}
                                {account.pets.length == 0 && <div>You currently have no pets added</div>}
                                {addingPet && 
                                <>
                                <form className = "pet-add">
                                <div class="form-field">
                                    <label asp-for="Account.FirstName" class="form-label" >Pet name</label>
                                    <input asp-for="Account.FirstName" class="form-control"value = {pet.name} onChange={(e) => setPet({...pet,name:e.target.value})} />
                                </div>
                                <div class="form-field">
                                    <label asp-for="Account.LastName" class="form-label">Pet Species</label>
                                    <input asp-for="Account.LastName" class="form-control"  value = {pet.species} onChange={(e) => setPet({...pet,species:e.target.value})}/>
                                </div>

                                <div style={{fontSize:"14px",marginBottom:"5px"}}>Pet Photo</div>
                                <div class="pet-image-input" >
                                    
                                    <label asp-for="Account.LastName" class="form-label">{fileName}</label>
                                    <input onChange={(e) =>{ 
                                        setFileName(e.target.value); 
                                        let reader = new FileReader();
                                        reader.onloadend = () =>{
                                            const base64String = reader.result
                                            .replace(';base64:', '')
                                      
                                            setPet({...pet,file:base64String})

                                        }
                                        reader.readAsDataURL(e.target.files[0])
                                        }} type="file" style={{opacity:"0"}} />
                                </div>
                                </form>                                
                                <button className='add-pet-button' onClick={onAddPet}>Add pet</button>

                                </>}
                                
                            </div>
                        </div>
                    </div>
                    <div class="account-save">
                        <a asp-page="./Index">Cancel</a>
                        <button id="update-profile-button" onClick={onChangeDetails}>Save changes</button>
                    </div>
                </form>
            </div>
        </div>
    </section>
  )
}

export default Account