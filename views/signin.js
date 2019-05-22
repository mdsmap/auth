const checkToken = () => {
    let token = "";
    if(document.cookie){ 
        token=document.cookie.split(" ").filter(e=>e.indexOf("token=")==0)[0] 
    }
    if(token) {
        toogle([document.querySelector('#logout-form')])
    }
    else{
        toogle([document.querySelector('#login-form')])
    }
}

const getUser=()=>{
    const url = window.location.href+'getUser';
    fetch(url)
        .then(res=>res.json())
        .then(e=>console.log(e))
}

const toogle = (targets) =>{
    targets.forEach(div => {div.classList.toggle("off")})
}

const signin = () => {
    const url = window.location.href+'sign_in';
    fetch(url,{
        method:'POST',
        headers: {'Content-Type': 'application/json'},
        body:JSON.stringify({
            email: document.querySelector("#login_email").value,
            password: document.querySelector("#login_password").value
        })
    })
    .then(res=>res.json())
    .then(res => {
        if(!res.message.token){ 
            document.cookie = "token="+'=; Max-Age=-99999999;';
            if(res.message == "User not verified"){
                toogle([document.querySelector('#login-form'),document.querySelector('#verify-form')])
            }
            else{
                alert(res.message)
            }
        }
        else{
            document.cookie = "token="+res.message.token;
            toogle([document.querySelector('#login-form'),document.querySelector('#logout-form')])
        }
    });
}

const verify = ()=>{
    const url = window.location.href+'verify';
    fetch(url,{
        method:'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: "include",
        body:JSON.stringify({
            email: document.querySelector("#verify_email").value,
            password: document.querySelector("#verify_password").value,
            verifyToken: document.querySelector("#verify_token").value,
        })
    })
    .then(response=> response.json())
    .then(result => {
        if(result.message != "success") alert(result.message)
        toogle([document.querySelector('#verify-form'),document.querySelector('#logout-form')])
    });
}

const logout = ()=>{
    toogle([
        document.querySelector('#logout-form'),
        document.querySelector('#login-form')
    ])

    document.cookie = "token="+'=; Max-Age=-99999999;';

}

const register = ()=>{
    const url = window.location.href+'register';
    fetch(url,{
        method:'POST',
        headers: {'Content-Type': 'application/json'},
        body:JSON.stringify({
            name: document.querySelector("#register_name").value,
            email: document.querySelector("#register_email").value,
            password: document.querySelector("#register_password").value
        })
    })
    .then(res=>res.json())
    .then(res => {
        if(res.message != "success") alert(res.message)
        else{
            toogle([document.querySelector('#register-form'),document.querySelector('#login-form')])
        }
    });
}

const createTable = (table,data) => {
  table.innerHTML = "";

  var tr = document.createElement("TR");
      tr.innerHTML  = data.uniqueKeys().map(e=>`<th>${e}</th>`).join('');
  table.append(tr)

  data.forEach(row=>{
    var fullRow = data.uniqueKeys().map(e=> row[e])

    var tr = document.createElement("TR");
        tr.innerHTML  = fullRow.map(e=>`<td>${e==undefined?'':e}</td>`).join('');

      table.append(tr)
  })
}

const listUsers = ()=>{
  const url = window.location.href+'listUsers';
  fetch(url)
    .then(response=>response.json())
    .then(result=>{
      if(result.message) alert(result.message)
      else{
        createTable(document.querySelector('#userTable'),result)
        toogle([document.querySelector('#logout-form'),document.querySelector('#userTable')])  
      }
    })

}


Array.prototype.uniqueKeys = function(){
  const flatKeys = this.flatMap(e=>Object.keys(e))
  uniqueValues =  [...new Set(flatKeys)]
  return uniqueValues; 
}
