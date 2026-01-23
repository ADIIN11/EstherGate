const msgPara=document.getElementById("msg-id")
const passwordInpt=document.getElementById("password-inp")
const nameEmailInpt=document.getElementById("username-email-inp")
const captchaInpt=document.getElementById("captcha-inp")



const form=document.getElementById("form-id")


form.addEventListener("submit",submit)

async function submit(event){ // event is a parameter to refer the event within the function
    event.preventDefault()       // this prevents the default submit event from occuring

   if(!nameEmailInpt.value||
        !passwordInpt.value&&
        !captchaInpt.value
    )
    {
    msgPara.textContent="Fill all the box"
    console.log("Fill all the box")

    return

}
else if(nameEmailInpt.value&&
        passwordInpt.value&&
        !captchaInpt.value
    )
    {
    msgPara.textContent="Pls Fill Captcha"
    console.log("Pls Fill Captcha")

    return

}

else{

           let userData = {
            usernameEmail: nameEmailInpt.value,
            password: passwordInpt.value,
            }





    try{

        const res = await axios.post("/Sign_In", userData)

        if(!res.data.exists){                              // call to check user already exist in db
            msgPara.textContent="Account Does Not Exists, Pls Sign-Up"
            console.log("Account already exists")
            return
        }
        else if(!res.data.passwordCorrect){
            msgPara.textContent="Password Incorrect"
            console.log("Password Incorrect")
            return
        }
        else{
            console.log(res.data)
            
            localStorage.setItem("token", res.data.token)
            msgPara.textContent="Signed In Successfully"
            console.log("Signed In Successfully")
            verifyToken()
            

        }
        form.reset()

    }
    catch(err){
        console.error("Error:", err) 
        msgPara.textContent = "Something went wrong, try again"
    
        }

}

}

async function verifyToken(){
    
    const token = localStorage.getItem("token")
    const tokenObj={
        token:token
    }

    try{

        const res = await axios.post("/Token_Verification", tokenObj)
        if(res.data.tokenVerified){
            
            const username=res.data.username
            const role=res.data.role
            const id=res.data.id
            
            localStorage.setItem("currentUsername",username)
            localStorage.setItem("currentUserRole",role)
            localStorage.setItem("currentUserId",id)
            localStorage.setItem("TokenData","true")
            console.log("Token Verified")

        }

        else{
            console.log("token expired pls login again")
        }
    }  
        catch(err){
        console.error("Error:", err)
        }




}
