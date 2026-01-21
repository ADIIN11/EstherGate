
const nameInpt=document.getElementById("username-ip")
const emailInpt=document.getElementById("email-ip")
const passwordInpt=document.getElementById("password-ip")
const cnfmPasswordInpt=document.getElementById("cnfm-password-ip")
const captchaInpt=document.getElementById("captcha-ip")

const msgPara=document.getElementById("msg-id")
const form=document.getElementById("form-id")


const axios= require("axios")

let now = new Date();


form.addEventListener("submit",submit) //only function reference is given in the 2nd argu as funtion is defined down 

function submit(event){   // event is a parameter to refer the event within the function
    event.preventDefault()  // this prevents the default submit event from occuring

    if(nameInpt.value===""||
        emailInpt.value===""||

        passwordInpt.valu===""||
        cnfmPasswordInpt.value===""||
        captchaInpt.value===""
        
    )
    {
    msgPara.textContent="Fill all the box"
    console.log("Fill all the box")
}

    else if(passwordInpt.value!= cnfmPasswordInpt.value)
         { console.log("confirm password")
            msgPara.textContent="Confirm password, Please"
         }
    
}






