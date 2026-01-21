
const nameInpt=document.getElementById("username-ip")
const emailInpt=document.getElementById("email-ip")
const passwordInpt=document.getElementById("password-ip")
const cnfmPasswordInpt=document.getElementById("cnfm-password-ip")
const captchaInpt=document.getElementById("captcha-ip")

const msgPara=document.getElementById("msg-id")
const form=document.getElementById("form-id")
const submitBtn=document.getElementById("submit-btn")












form.addEventListener("submit",submit) //only function reference is given in the 2nd argu as funtion is defined down 

async function submit(event){ 
         // event is a parameter to refer the event within the function
    event.preventDefault()       // this prevents the default submit event from occuring

   
if(nameInpt.value===""||
        emailInpt.value===""||

        passwordInpt.value===""||
        cnfmPasswordInpt.value===""||
        captchaInpt.value===""
    )
    {
    msgPara.textContent="Fill all the box"
    console.log("Fill all the box")

    return

}

    else if(passwordInpt.value!= cnfmPasswordInpt.value)
         { console.log("confirm password")
            msgPara.textContent="Confirm password, Please"
             return
         }

else{

           let userData = {
            username: nameInpt.value,
            email: emailInpt.value,
            password: passwordInpt.value,
            createdAt: new Date().toDateString(),
            verfication:0, 
            myOrders:null,
            sellerVerification:0,
            productListed:null,
            

            }





    try{

        const res = await axios.post("/Sign_Up", userData)

        if(res.data.exists){                              // call to check user already exist in db
            msgPara.textContent="Account already exists, Pls Sign-In"
            console.log("Account already exists")
        }
        else{
                                      // call to create user in db
            msgPara.textContent="Account Created successfully"
            console.log("Account Created successfully")

        }
        form.reset()

    }
    catch(err){
        console.error("Error:", err) 
        msgPara.textContent = "Something went wrong, try again"
    
        }

}
    
}







