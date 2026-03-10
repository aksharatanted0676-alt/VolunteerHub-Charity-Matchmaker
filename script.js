/* ===============================
VOLUNTEERHUB MAIN SCRIPT
=============================== */


/* ===============================
NGO STORAGE
=============================== */

let ngos = []

const ngoNames = [
"Helping Hands Foundation",
"Bright Future Initiative",
"Hope For All",
"Green Planet Trust",
"Care & Share Mission",
"Education Bridge",
"Community Builders",
"Smile Support NGO",
"Unity Welfare Society",
"Humanity First",
"Kind Hearts Collective",
"Future Path NGO",
"Green Earth Alliance",
"Animal Safe Haven",
"Learning Tree Trust"
]

const roles = [
"Teaching Volunteer",
"Fundraising Assistant",
"Community Outreach Volunteer",
"Social Media Volunteer",
"Tree Plantation Volunteer",
"Animal Care Volunteer",
"Food Distribution Volunteer",
"Child Mentor"
]

const categories = [
"Education",
"Environment",
"Animal Welfare"
]

const skills = [
"Teaching",
"Marketing",
"Communication",
"Environment",
"Animal Care",
"Leadership",
"Social Media",
"Community Work"
]

const impacts = [
"Help provide education and mentorship to underprivileged children.",
"Support tree plantation and environmental awareness programs.",
"Assist in rescuing and caring for stray animals.",
"Help distribute food to homeless communities.",
"Support skill development programs for youth.",
"Assist NGOs in organizing community events.",
"Promote environmental sustainability initiatives.",
"Help coordinate animal rescue and shelter care.",
"Assist volunteers in community outreach campaigns.",
"Support educational workshops for rural students."
]


/* ===============================
GENERATE RANDOM NGOs
=============================== */

function generateRandomNGOs(city, count = 50){

ngos = []

for(let i=0;i<count;i++){

const randomName = ngoNames[Math.floor(Math.random()*ngoNames.length)]
const randomRole = roles[Math.floor(Math.random()*roles.length)]
const randomCategory = categories[Math.floor(Math.random()*categories.length)]
const randomSkill = skills[Math.floor(Math.random()*skills.length)]
const randomImpact = impacts[Math.floor(Math.random()*impacts.length)]

const verified = Math.random() > 0.5

ngos.push({
org: randomName,
role: randomRole,
city: city,
skill: randomSkill,
category: randomCategory,
impact: randomImpact,
verified: verified
})

}

loadNGOs()

}


/* ===============================
DISPLAY NGO CARDS
=============================== */

function loadNGOs(){

const container = document.getElementById("ngoContainer")
if(!container) return

container.innerHTML = ""

ngos.forEach(ngo=>{

const card = document.createElement("div")
card.className = "card"
card.setAttribute("data-category", ngo.category)

card.innerHTML = `

${ngo.verified ? `<div class="verified">Verified Charity</div>` : ""}

<h2>${ngo.org}</h2>
<h3>${ngo.role}</h3>

<p><strong>City:</strong> ${ngo.city}</p>

<div>
<span class="badge">${ngo.skill}</span>
<span class="badge">${ngo.category}</span>
</div>

<p>${ngo.impact}</p>

<button class="apply-btn" onclick="applyVolunteer('${ngo.org}')">
Apply
</button>

`

container.appendChild(card)

})

}


/* ===============================
SEARCH BY CITY
=============================== */

function searchCity(){

const cityInput = document.getElementById("citySearch")
if(!cityInput) return

const city = cityInput.value.trim()

if(city === ""){
alert("Please enter a city")
return
}

generateRandomNGOs(city,60)

}


/* ===============================
CATEGORY FILTER
=============================== */

function filterByCategory(){

const selected = document.getElementById("categoryFilter").value
const cards = document.querySelectorAll(".card")

cards.forEach(card=>{

const category = card.getAttribute("data-category")

if(selected === "all" || category === selected){
card.style.display = "block"
}else{
card.style.display = "none"
}

})

}


/* ===============================
RECENT ACTIVITY SYSTEM
=============================== */

function saveActivity(text){

let activities = JSON.parse(localStorage.getItem("recentActivities")) || []

const activity = {
text:text,
time:new Date().toLocaleDateString()
}

activities.unshift(activity)

localStorage.setItem("recentActivities",JSON.stringify(activities))

}


function loadActivities(){

const container = document.getElementById("activityList")
if(!container) return

const activities = JSON.parse(localStorage.getItem("recentActivities")) || []

container.innerHTML=""

activities.slice(0,5).forEach(a=>{

const item=document.createElement("div")
item.className="activity-item"

item.innerHTML=`

<div class="activity-icon">🤝</div>

<div class="activity-text">
<h3>${a.text}</h3>
<p>${a.time}</p>
</div>

`

container.appendChild(item)

})

}


/* ===============================
APPLY BUTTON
=============================== */

function applyVolunteer(org){

const popup = document.createElement("div")

popup.className="success-popup"
popup.innerText=`✅ Application sent! You applied to ${org}`

document.body.appendChild(popup)

setTimeout(()=>{
popup.remove()
},3000)

/* Increase dashboard statistics */

let hours = Number(localStorage.getItem("totalHours")) || 0
hours += 5
localStorage.setItem("totalHours", hours)

let projects = Number(localStorage.getItem("totalProjects")) || 0
projects++
localStorage.setItem("totalProjects", projects)

/* Save activity */

saveActivity(`Completed session at ${org} • 5 hours contributed`)

loadDashboard()
loadActivities()

}


/* ===============================
AUTH SYSTEM
=============================== */

let selectedSkills = []

function toggleSkill(button){

button.classList.toggle("active")

const skill = button.innerText

if(selectedSkills.includes(skill)){
selectedSkills = selectedSkills.filter(s => s !== skill)
}else{
selectedSkills.push(skill)
}

}


/* SHOW SIGNUP */

function showSignup(){

const login = document.getElementById("loginBox")
const signup = document.getElementById("signupBox")

if(login) login.style.display="none"
if(signup) signup.style.display="block"

}


/* SHOW LOGIN */

function showLogin(){

const login = document.getElementById("loginBox")
const signup = document.getElementById("signupBox")

if(login) login.style.display="block"
if(signup) signup.style.display="none"

}


/* CREATE ACCOUNT */

function createAccount(){

const name = document.getElementById("name").value
const email = document.getElementById("email").value
const password = document.getElementById("password").value
const phone = document.getElementById("phone").value
const location = document.getElementById("location").value
const availability = document.getElementById("availability").value

if(name==="" || email==="" || password===""){
alert("Please fill required fields")
return
}

const user={
name,
email,
password,
phone,
location,
availability,
skills:selectedSkills
}

localStorage.setItem("volunteerUser",JSON.stringify(user))

let volunteers = Number(localStorage.getItem("totalVolunteers")) || 0
volunteers++
localStorage.setItem("totalVolunteers", volunteers)

alert("✅ Account created!")
window.location.href="profile.html"

}


/* LOGIN USER */

function loginUser(){

const email=document.getElementById("loginEmail").value
const password=document.getElementById("loginPassword").value

const savedUser = JSON.parse(localStorage.getItem("volunteerUser"))

if(!savedUser){
alert("No account found. Please sign up.")
return
}

if(email===savedUser.email && password===savedUser.password){

alert("✅ Login successful!")
window.location.href="profile.html"

}else{
alert("Invalid email or password")
}

}


/* ===============================
PROFILE PAGE
=============================== */

function loadProfile(){

const user = JSON.parse(localStorage.getItem("volunteerUser"))
if(!user) return

const nameEl=document.getElementById("profileName")
const emailEl=document.getElementById("profileEmail")
const phoneEl=document.getElementById("profilePhone")
const locationEl=document.getElementById("profileLocation")
const availEl=document.getElementById("profileAvailability")
const avatar=document.getElementById("avatarLetter")
const skillContainer=document.getElementById("profileSkills")

if(nameEl) nameEl.innerText=user.name
if(emailEl) emailEl.innerText=user.email
if(phoneEl) phoneEl.innerText=user.phone
if(locationEl) locationEl.innerText=user.location
if(availEl) availEl.innerText=user.availability+" hrs/week"

if(avatar) avatar.innerText=user.name.charAt(0)

if(skillContainer){

skillContainer.innerHTML=""

user.skills.forEach(skill=>{

const span=document.createElement("span")
span.className="badge"
span.innerText=skill

skillContainer.appendChild(span)

})

}

loadRecommendations(user)

}


/* ===============================
RECOMMENDED OPPORTUNITIES
=============================== */

function loadRecommendations(user){

const container=document.getElementById("recommendedContainer")
if(!container) return

container.innerHTML=""

const matches = ngos.filter(ngo => user.skills.includes(ngo.skill))
const recommended = matches.slice(0,3)

recommended.forEach(ngo=>{

const card=document.createElement("div")
card.className="recommend-card"

card.innerHTML=`

<h3>${ngo.org}</h3>
<p><strong>Role:</strong> ${ngo.role}</p>
<p><strong>Why it matches:</strong> Fits your ${ngo.skill} skill.</p>

`

container.appendChild(card)

})

}


/* ===============================
DASHBOARD SYSTEM
=============================== */

function initDashboard(){

if(!localStorage.getItem("totalVolunteers")){
localStorage.setItem("totalVolunteers",0)
}

if(!localStorage.getItem("totalHours")){
localStorage.setItem("totalHours",0)
}

if(!localStorage.getItem("totalProjects")){
localStorage.setItem("totalProjects",0)
}

}


function loadDashboard(){

const v=document.getElementById("totalVolunteers")
const h=document.getElementById("totalHours")
const p=document.getElementById("totalProjects")

if(v) v.innerText = localStorage.getItem("totalVolunteers") || 0
if(h) h.innerText = localStorage.getItem("totalHours") || 0
if(p) p.innerText = localStorage.getItem("totalProjects") || 0

}


/* ===============================
CLIENT REVIEWS SYSTEM
=============================== */

function loadReviews(){

const container = document.getElementById("reviewsContainer")
if(!container) return

const savedReviews = JSON.parse(localStorage.getItem("clientReviews")) || []

container.innerHTML=""

savedReviews.forEach(review => {

const card = document.createElement("div")
card.className = "testimonial-card"

card.innerHTML = `
<h3>${review.name}</h3>
<div class="stars">${review.rating}</div>
<p>${review.text}</p>
`

container.appendChild(card)

})

}


function submitReview(event){

event.preventDefault()

const name = document.getElementById("clientName").value
const text = document.getElementById("clientReview").value
const rating = document.getElementById("clientRating").value

const review = { name, text, rating }

let reviews = JSON.parse(localStorage.getItem("clientReviews")) || []

reviews.push(review)

localStorage.setItem("clientReviews", JSON.stringify(reviews))

loadReviews()

document.getElementById("reviewForm").reset()

}


/* ===============================
DEFAULT LOAD
=============================== */

document.addEventListener("DOMContentLoaded",function(){

initDashboard()

generateRandomNGOs("Mumbai",30)

loadProfile()

loadDashboard()

loadActivities()

loadReviews()

const signupBox=document.getElementById("signupBox")
if(signupBox) signupBox.style.display="none"

const reviewForm=document.getElementById("reviewForm")
if(reviewForm){
reviewForm.addEventListener("submit",submitReview)
}

})