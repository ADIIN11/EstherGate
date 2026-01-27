
const nameInpt=document.getElementById("username-inp")
const emailInpt=document.getElementById("email-inp")
const passwordInpt=document.getElementById("password-inp")
const cnfmPasswordInpt=document.getElementById("cnfm-password-inp")
const captchaInpt=document.getElementById("captcha-inp")

const msgPara=document.getElementById("msg-id")
const form=document.getElementById("form-id")













form.addEventListener("submit",submit) //only function reference is given in the 2nd argu as funtion is defined down 

async function submit(event){ // event is a parameter to refer the event within the function
    event.preventDefault()       // this prevents the default submit event from occuring

   
if(!nameInpt.value||
        !emailInpt.value||

        !passwordInpt.value||
        !cnfmPasswordInpt.value&&
        !captchaInpt.value
    )
    {
    msgPara.textContent="Fill all the box"
    console.log("Fill all the box")

    return

}
else if(nameInpt.value&&
        emailInpt.value&&

        passwordInpt.value&&
        cnfmPasswordInpt.value&&
        !captchaInpt.value
    )
    {
    msgPara.textContent="Pls Fill Captcha"
    console.log("Pls Fill Captcha")

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
            verification:false, 
            profileImg:null,
            deleteProfileImg:null,
            myCart:[],
            myOrders:[],
            address:null,
            sellerVerification:false,
            productListed:[],
            role:"customerAccount"
            }





    try{

        const res = await axios.post("/Auth/Sign_Up", userData)
        console.log(res.data)
        if(res.data.exists===1){   // call to check user already exist in db
            msgPara.textContent="Username already taken"
            console.log("username already taken")
        }
        else if(res.data.exists===2){
            msgPara.textContent="Account already exists,Pls Sign in"   
            console.log("Account already exists")
        }
        
        else{
                                      // call to create user in db
            msgPara.textContent="Account Created Successfully"
            console.log("Account Created Successfully")

        }
        form.reset()

    }
    catch(err){
        console.error("Error:", err) 
        msgPara.textContent = "Something went wrong, try again"
    
        }

}
    
}







