 let search = document.getElementById("inputSearch")
 let submitBtn = document.getElementById("startSearch");

 const SEARCH = (sx = "kelvinsekx")=>
   fetch('https://api.github.com/graphql', {
    method: "POST",
    headers:  {
        "Content-Type":"application/json",
        "Authorization": "Bearer " + token
    },
    body: JSON.stringify({
        query: `
        query Info($user: String!){ 
            user (login: $user) {
              login
              name
              bioHTML
              avatarUrl
              repositories (last: 20,orderBy: {field: CREATED_AT, direction: ASC}) {
                totalCount
                nodes{
                  description
                  name
                  stargazers{
                    totalCount
                  }
                  forkCount
                  updatedAt
                  description
                  primaryLanguage {
                    name
                  }
                }
              }
            }
          }
      `,
      variables: {
          user: `${sx}`
      }
    })
}).then(data=>{
    if(data.error){
        console.log(data.error)
    }else {
       return data.json()
    }
}).then(result => {
   console.log(result)
   if(result.data.user == null){
    console.log("error")
    renderErrMessage("user not valid")
    return result.data.user
   }
   renderErrMessage("")
   const payLoad = result;
   render(payLoad)
   search.value = ""
}).catch((err)=>renderErrMessage(err));

/**
 * 
 * @param {*} err an error 
 */
const renderErrMessage = (err)=> {
  const el = document.getElementById("error")
  el.textContent = err 
}



/**
 * 
 * @param payLoad: a DOM object that is used to render update 
 */
const render = (payLoad = new Object()) => {
  const {data: {user}} = payLoad
  let element = document.getElementById("avi");
  let picz = document.getElementById("picz");
  let totalCount = document.getElementById("totalCount");
  let repo = document.getElementById("reporepo");
  let smallImg = document.getElementById("smallImg")
  function getC(lang){
    let c = ''
    if (lang == "JavaScript"){
      c = "yellow"
    }else if(lang == "CSS"){
      c = 'purple'
    }else if(lang == "TypeScript"){
      c = 'indigo'
    }else{
      c = "red"
    }
    return c;
  }
  let result = ""
  for(let r of user.repositories.nodes){
    result = result+`
    <div style=" border-bottom: 1px solid rgba(97, 94, 94, 0.4); display: flex;  flex-direction: column; justify-content: space-evenly; padding: 3% 0; gap: 10px;min-height: 6rem">

    <div class="u_">
        <div class="u_username">${r.name}</div>
        <div class="u_rateStar">
            <span style="position: relative; bottom: 1px;"><i class="bi bi-star" style="font-size: 88%;"></i></span> 
            <span>star</span>
        </div>
    </div>
    ${r.description ? (`<div style="padding-bottom: 1em; width: 60%"><small style="font-size: 0.8em; color: #666;">
    ${r.description}</small></div>`) : ''}
    <div style="display: flex;">
        <div style="display: flex; justify-content: space-between;width: 20rem; font-size: 75%;">
        ${r.primaryLanguage ? `<div>
          <div style="background: ${getC(r.primaryLanguage.name)}; padding: 6px; border-radius: 100%; position: relative; top: 2px; display:inline-block"></div>
           ${r.primaryLanguage.name }
        </div>` : "NA"}
            <div class="rateStar">
                <i class="bi bi-star"  style="font-size: 98%;"></i> ${r.stargazers.totalCount} 
            </div>
            <div class="rateStar">
                <i class="bi bi-diagram-2"></i><span class="po">${r.forkCount}</span>   
            </div>
            <div>
                updated at ${new Date(r.updatedAt).getDate()} ${new Date(r.updatedAt).toLocaleString('default', { month: 'short' })}
            </div>
        </div>
        </div>
    </div>`
  }

  repo.innerHTML = `
    ${result}
`

  totalCount.innerHTML = `${user.repositories.totalCount}`
  
  picz.innerHTML = `
    <div class="avatarUrl"><img src='${user.avatarUrl}' alt= ${user.name}></div>
  `

  smallImg.innerHTML = `<img src='${user.avatarUrl}' alt= ${user.name}>`

  element.innerHTML = `
  <div id="aavi">
    <div>
      <h3 class="u_name">${user.name}</h3>
      <div class="n">${user.login}</div>
    </div>
    <div class='u_bio'>
      ${user.bioHTML}
    </div>
  </div>
  `
  return true
}

submitBtn.addEventListener("click", ()=>SEARCH(search.value))



